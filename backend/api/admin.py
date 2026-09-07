from django.contrib import admin
from .models import Area, Case, City, SafetyReport

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name", "reported_cases", "under_investigation", "under_trial", "convicted", "acquitted")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "reported_cases", "under_investigation", "under_trial", "convicted")
    list_filter = ("city",)
    search_fields = ("name", "city__name")

@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ("case_id", "city", "area", "status", "verified", "incident_date", "last_updated")
    list_filter = ("status", "verified", "city")
    search_fields = ("case_id", "city__name", "area__name", "source_name")
    readonly_fields = ("last_updated",)

@admin.register(SafetyReport)
class SafetyReportAdmin(admin.ModelAdmin):
    list_display = ("id", "category", "location", "status", "created_at")
    list_filter = ("status", "category")
    search_fields = ("location", "category", "description")
    readonly_fields = ("created_at",)
