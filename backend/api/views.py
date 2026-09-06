```python
import json

from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from .models import City, Area, Case


def login_view(request):
    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Only POST method is allowed."
            },
            status=405
        )

    try:
        body = json.loads(request.body)

        email = body.get("email", "").strip()
        password = body.get("password", "")

        if not email or not password:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Email and password are required."
                },
                status=400
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid email or password."
                },
                status=401
            )

        authenticated_user = authenticate(
            username=user.username,
            password=password
        )

        if authenticated_user is None:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid email or password."
                },
                status=401
            )

        return JsonResponse(
            {
                "success": True,
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                }
            }
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON data."
            },
            status=400
        )


def cities(request):
    data = [
        {
            "name": c.name,
            "slug": c.slug,
            "reported": c.reported_cases,
            "investigation": c.under_investigation,
            "trial": c.under_trial,
            "convicted": c.convicted,
            "acquitted": c.acquitted,
        }
        for c in City.objects.all().order_by("name")
    ]

    return JsonResponse(data, safe=False)


def areas(request):
    data = [
        {
            "id": a.id,
            "city": a.city.name,
            "name": a.name,
            "reported": a.reported_cases,
            "investigation": a.under_investigation,
            "trial": a.under_trial,
            "convicted": a.convicted,
            "acquitted": a.acquitted,
        }
        for a in Area.objects.select_related("city").all().order_by(
            "city__name",
            "name"
        )
    ]

    return JsonResponse(data, safe=False)


def cases(request):
    data = [
        {
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
        }
        for c in Case.objects.select_related(
            "city",
            "area"
        ).all().order_by("-incident_date")
    ]

    return JsonResponse(data, safe=False)
```
