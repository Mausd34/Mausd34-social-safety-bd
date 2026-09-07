import json
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Count, Q, Sum
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Area, Case, City, SafetyReport

def _json(request):
    try:
        return json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return None

@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Only POST method is allowed."}, status=405)
    body = _json(request)
    if body is None:
        return JsonResponse({"success": False, "message": "Invalid JSON data."}, status=400)
    email, password = str(body.get("email", "")).strip(), body.get("password", "")
    if not email or not password:
        return JsonResponse({"success": False, "message": "Email and password are required."}, status=400)
    user = User.objects.filter(email__iexact=email).first()
    if not user or not authenticate(username=user.username, password=password):
        return JsonResponse({"success": False, "message": "Invalid email or password."}, status=401)
    return JsonResponse({"success": True, "message": "Login successful.", "user": {"id": user.id, "username": user.username, "email": user.email, "is_staff": user.is_staff, "is_superuser": user.is_superuser}})

def cities(request):
    data = [{"id": c.id, "name": c.name, "slug": c.slug, "reported": c.reported_cases, "investigation": c.under_investigation, "trial": c.under_trial, "convicted": c.convicted, "acquitted": c.acquitted} for c in City.objects.all().order_by("name")]
    return JsonResponse(data, safe=False)

def areas(request):
    city = request.GET.get("city", "").strip()
    qs = Area.objects.select_related("city").all()
    if city:
        qs = qs.filter(Q(city__slug__iexact=city) | Q(city__name__iexact=city))
    data = [{"id": a.id, "city": a.city.name, "city_slug": a.city.slug, "name": a.name, "reported": a.reported_cases, "investigation": a.under_investigation, "trial": a.under_trial, "convicted": a.convicted, "acquitted": a.acquitted} for a in qs.order_by("city__name", "name")]
    return JsonResponse(data, safe=False)

def cases(request):
    qs = Case.objects.select_related("city", "area").all()
    search, status, city, verified = request.GET.get("search", "").strip(), request.GET.get("status", "").strip().upper(), request.GET.get("city", "").strip(), request.GET.get("verified")
    if search:
        qs = qs.filter(Q(case_id__icontains=search) | Q(city__name__icontains=search) | Q(area__name__icontains=search) | Q(source_name__icontains=search))
    if status: qs = qs.filter(status=status)
    if city: qs = qs.filter(Q(city__slug__iexact=city) | Q(city__name__iexact=city))
    if verified in {"true", "false"}: qs = qs.filter(verified=verified == "true")
    data = [{"case_id": c.case_id, "city": c.city.name, "area": c.area.name if c.area else None, "status": c.status, "court_status": c.court_status, "incident_date": c.incident_date.isoformat() if c.incident_date else None, "source_name": c.source_name, "source_url": c.source_url, "verified": c.verified, "last_updated": c.last_updated.isoformat()} for c in qs.order_by("-incident_date", "-last_updated")]
    return JsonResponse(data, safe=False)

def statistics(request):
    qs = City.objects.all()
    totals = qs.aggregate(reported=Sum("reported_cases"), investigation=Sum("under_investigation"), trial=Sum("under_trial"), convicted=Sum("convicted"), acquitted=Sum("acquitted"))
    return JsonResponse({"cities": qs.count(), **{k: v or 0 for k, v in totals.items()}, "case_status": list(Case.objects.values("status").annotate(count=Count("id")).order_by("status")), "city_totals": list(qs.values("name", "slug", "reported_cases", "convicted").order_by("-reported_cases"))})

def dashboard(request):
    return statistics(request)

def case_detail(request, case_id):
    case = Case.objects.select_related("city", "area").filter(case_id=case_id, verified=True).first()
    if not case: return JsonResponse({"success": False, "message": "Verified case not found."}, status=404)
    return JsonResponse({"case_id": case.case_id, "city": case.city.name, "area": case.area.name if case.area else None, "status": case.status, "court_status": case.court_status, "incident_date": case.incident_date.isoformat() if case.incident_date else None, "source_name": case.source_name, "source_url": case.source_url, "verified": case.verified})

@csrf_exempt
def report_create(request):
    if request.method != "POST": return JsonResponse({"success": False, "message": "Only POST method is allowed."}, status=405)
    location, category, description = request.POST.get("location", "").strip(), request.POST.get("category", "").strip(), request.POST.get("description", "").strip()
    if not location or not category or not description: return JsonResponse({"success": False, "message": "Location, category and description are required."}, status=400)
    report = SafetyReport.objects.create(location=location, category=category, description=description, evidence=request.FILES.get("evidence"))
    return JsonResponse({"success": True, "message": "Report submitted for review.", "id": report.id}, status=201)

def health(request):
    return JsonResponse({"status": "ok", "service": "Social Safety BD API"})
