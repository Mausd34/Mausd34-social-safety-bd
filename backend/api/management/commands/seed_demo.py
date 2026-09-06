from django.core.management.base import BaseCommand
from api.models import City, Area, Case

CITIES = [
    ("Dhaka","dhaka",324,98,156,42,18),
    ("Chattogram","chattogram",221,71,103,31,11),
    ("Rajshahi","rajshahi",152,43,68,22,7),
    ("Khulna","khulna",118,38,51,17,5),
    ("Sylhet","sylhet",96,29,44,12,4),
    ("Barishal","barishal",74,21,32,9,3),
    ("Rangpur","rangpur",58,17,26,7,2),
    ("Mymensingh","mymensingh",45,13,19,6,2),
]

class Command(BaseCommand):
    help = "Load clearly marked demo data for the prototype"

    def handle(self, *args, **kwargs):
        city_map = {}
        for row in CITIES:
            name, slug, r, i, t, co, ac = row
            city, _ = City.objects.update_or_create(slug=slug, defaults={
                "name": name, "reported_cases": r, "under_investigation": i,
                "under_trial": t, "convicted": co, "acquitted": ac
            })
            city_map[slug] = city

        dhaka = city_map["dhaka"]
        for name, r, i, t, co, ac in [
            ("Uttara",56,18,22,10,6),("Mirpur",48,15,18,8,4),
            ("Dhanmondi",42,13,17,7,3),("Gulshan",38,11,15,6,2),
            ("Motijheel",31,10,12,5,2),("Wari",28,8,10,4,1)
        ]:
            Area.objects.update_or_create(city=dhaka, name=name, defaults={
                "reported_cases":r,"under_investigation":i,"under_trial":t,
                "convicted":co,"acquitted":ac
            })

        self.stdout.write(self.style.SUCCESS("Demo data loaded. Replace it with verified source data before publication."))
