from datetime import date
from django.db import migrations


CITIES = [
    ("Dhaka", "dhaka", 324, 98, 156, 42, 18),
    ("Chattogram", "chattogram", 221, 71, 103, 31, 11),
    ("Rajshahi", "rajshahi", 152, 43, 68, 22, 7),
    ("Khulna", "khulna", 118, 38, 51, 17, 5),
    ("Sylhet", "sylhet", 96, 29, 44, 12, 4),
    ("Barishal", "barishal", 74, 21, 32, 9, 3),
    ("Rangpur", "rangpur", 58, 17, 26, 7, 2),
    ("Mymensingh", "mymensingh", 45, 13, 19, 6, 2),
]

AREAS = [
    ("Uttara", 56, 18, 22, 10, 6),
    ("Mirpur", 48, 15, 18, 8, 4),
    ("Dhanmondi", 42, 13, 17, 7, 3),
    ("Gulshan", 38, 11, 15, 6, 2),
    ("Motijheel", 31, 10, 12, 5, 2),
    ("Wari", 28, 8, 10, 4, 1),
]

CASES = [
    ("BD-DHK-DEMO-001", "dhaka", "Uttara", "CONVICTED", "Judgment recorded", date(2026, 6, 12)),
    ("BD-DHK-DEMO-002", "dhaka", "Mirpur", "TRIAL", "Trial ongoing", date(2026, 5, 21)),
    ("BD-CTG-DEMO-003", "chattogram", None, "INVESTIGATION", "Investigation", date(2026, 5, 3)),
    ("BD-RJS-DEMO-004", "rajshahi", None, "CONVICTED", "Judgment recorded", date(2026, 4, 18)),
    ("BD-KHL-DEMO-005", "khulna", None, "TRIAL", "Trial ongoing", date(2026, 4, 2)),
    ("BD-SYL-DEMO-006", "sylhet", None, "INVESTIGATION", "Investigation", date(2026, 3, 20)),
]


def seed(apps, schema_editor):
    City = apps.get_model("api", "City")
    Area = apps.get_model("api", "Area")
    Case = apps.get_model("api", "Case")

    city_map = {}
    for name, slug, reported, investigation, trial, convicted, acquitted in CITIES:
        city, _ = City.objects.update_or_create(
            slug=slug,
            defaults={
                "name": name,
                "reported_cases": reported,
                "under_investigation": investigation,
                "under_trial": trial,
                "convicted": convicted,
                "acquitted": acquitted,
            },
        )
        city_map[slug] = city

    area_map = {}
    for name, reported, investigation, trial, convicted, acquitted in AREAS:
        area, _ = Area.objects.update_or_create(
            city=city_map["dhaka"],
            name=name,
            defaults={
                "reported_cases": reported,
                "under_investigation": investigation,
                "under_trial": trial,
                "convicted": convicted,
                "acquitted": acquitted,
            },
        )
        area_map[name] = area

    for case_id, city_slug, area_name, status, court_status, incident_date in CASES:
        Case.objects.update_or_create(
            case_id=case_id,
            defaults={
                "city": city_map[city_slug],
                "area": area_map.get(area_name),
                "status": status,
                "court_status": court_status,
                "incident_date": incident_date,
                "source_name": "Synthetic demo record",
                "source_url": "",
                "verified": True,
            },
        )


def unseed(apps, schema_editor):
    City = apps.get_model("api", "City")
    Case = apps.get_model("api", "Case")
    Area = apps.get_model("api", "Area")
    Case.objects.filter(case_id__startswith="BD-").delete()
    Area.objects.filter(city__slug__in=[slug for _, slug, *_ in CITIES]).delete()
    City.objects.filter(slug__in=[slug for _, slug, *_ in CITIES]).delete()


class Migration(migrations.Migration):
    dependencies = [("api", "0001_initial")]
    operations = [migrations.RunPython(seed, unseed)]
