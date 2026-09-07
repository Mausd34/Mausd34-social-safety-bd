from django.urls import path
from .views import cities, areas, cases, login_view, statistics, dashboard, case_detail, report_create, health

urlpatterns = [
    path("health/", health),
    path("login/", login_view),
    path("cities/", cities),
    path("areas/", areas),
    path("cases/", cases),
    path("cases/<str:case_id>/", case_detail),
    path("statistics/", statistics),
    path("dashboard/", dashboard),
    path("reports/", report_create),
]
