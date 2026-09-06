```python
from django.urls import path

from .views import cities, areas, cases, login_view


urlpatterns = [
    path("login/", login_view),
    path("cities/", cities),
    path("areas/", areas),
    path("cases/", cases),
]
```
