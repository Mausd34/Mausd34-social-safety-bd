from django.http import JsonResponse
from .models import City, Area, Case

def cities(request):
    data = [{
        "name": c.name,
        "slug": c.slug,
        "reported": c.reported_cases,
        "investigation": c.under_investigation,
        "trial": c.under_trial,
        "convicted": c.convicted,
        "acquitted": c.acquitted,
    } for c in City.objects.all().order_by("name")]
    return JsonResponse(data, safe=False)

def areas(request):
    data = [{
        "id": a.id,
        "city": a.city.name,
        "name": a.name,
        "reported": a.reported_cases,
        "investigation": a.under_investigation,
        "trial": a.under_trial,
        "convicted": a.convicted,
        "acquitted": a.acquitted,
    } for a in Area.objects.select_related("city").all().order_by("city__name", "name")]
    return JsonResponse(data, safe=False)

def cases(request):
    data = [{
        "case_id": c.case_id,
        "city": c.city.name,
        "area": c.area.name if c.area else None,
        "status": c.status,
        "court_status": c.court_status,
        "incident_date": c.incident_date,
        "source_name": c.source_name,
        "source_url": c.source_url,
        "verified": c.verified,
        "last_updated": c.last_updated,
    } for c in Case.objects.select_related("city", "area").all().order_by("-incident_date")]
    return JsonResponse(data, safe=False)
