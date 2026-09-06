from django.urls import path
from .views import cities, areas, cases

urlpatterns = [
    path("cities/", cities),
    path("areas/", areas),
    path("cases/", cases),
]
