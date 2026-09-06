from django.db import models

class City(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(unique=True)
    reported_cases = models.PositiveIntegerField(default=0)
    under_investigation = models.PositiveIntegerField(default=0)
    under_trial = models.PositiveIntegerField(default=0)
    convicted = models.PositiveIntegerField(default=0)
    acquitted = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class Area(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="areas")
    name = models.CharField(max_length=120)
    reported_cases = models.PositiveIntegerField(default=0)
    under_investigation = models.PositiveIntegerField(default=0)
    under_trial = models.PositiveIntegerField(default=0)
    convicted = models.PositiveIntegerField(default=0)
    acquitted = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("city", "name")

    def __str__(self):
        return f"{self.city.name} - {self.name}"

class Case(models.Model):
    STATUS_CHOICES = [
        ("REPORTED", "Reported"),
        ("INVESTIGATION", "Under Investigation"),
        ("TRIAL", "Under Trial"),
        ("CONVICTED", "Convicted"),
        ("ACQUITTED", "Acquitted"),
    ]
    case_id = models.CharField(max_length=80, unique=True)
    city = models.ForeignKey(City, on_delete=models.PROTECT)
    area = models.ForeignKey(Area, on_delete=models.PROTECT, null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES)
    court_status = models.CharField(max_length=180, blank=True)
    incident_date = models.DateField(null=True, blank=True)
    source_name = models.CharField(max_length=200)
    source_url = models.URLField(blank=True)
    verified = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.case_id

class SafetyReport(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending Review"),
        ("VERIFIED", "Verified"),
        ("REJECTED", "Rejected"),
    ]
    location = models.CharField(max_length=180)
    category = models.CharField(max_length=120)
    description = models.TextField()
    evidence = models.FileField(upload_to="report-evidence/", blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.location}"
