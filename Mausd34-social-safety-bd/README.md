# Social Safety BD 🇧🇩

A professional public-safety awareness and verified-statistics prototype for Bangladesh.

## Stack
- **Frontend:** React, Vite, React Router, Leaflet, Recharts
- **Backend:** Django + Django REST Framework
- **Database:** SQLite for development
- **Authentication:** Django session authentication
- **Uploads:** Django media storage

## Features
- Responsive public safety dashboard
- Bangladesh city and area statistics
- Interactive safety map
- Verified case directory and case details
- Search and filtering support
- User registration, login, logout and current-user API
- Community safety report submission with optional evidence
- Staff-only report review API
- Admin management for cities, areas, cases and reports
- Environment-based CORS, hosts and secret configuration

## Local setup

### Backend — Windows PowerShell
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

If PowerShell blocks activation, run the commands without activation using `venv\Scripts\python.exe`.

### Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend defaults to `http://127.0.0.1:8000/api`. For another backend URL, copy `.env.example` to `.env` and set `VITE_API_URL`.

## API
- `GET /api/health/`
- `POST /api/register/`
- `POST /api/login/`
- `GET /api/me/`
- `POST /api/logout/`
- `GET /api/cities/`
- `GET /api/areas/?city=dhaka`
- `GET /api/cases/`
- `GET /api/cases/<case_id>/`
- `GET /api/statistics/`
- `GET /api/dashboard/`
- `POST /api/reports/`
- `GET/PATCH /api/admin/reports/` — staff only

## Production configuration
Set these environment variables on the backend:
```text
DJANGO_SECRET_KEY=<strong-random-secret>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=<your-backend-domain>
CORS_ALLOWED_ORIGINS=https://<your-frontend-domain>
```

Run production static collection with:
```bash
python manage.py collectstatic --noinput
```
Use a production WSGI server such as Gunicorn and a persistent database/storage service for real deployment.

## Demo-data warning
`seed_demo` contains synthetic prototype values for UI/testing. Replace them with authoritative, verifiable data before publication. Case records exposed publicly are limited to verified records.

## Responsible-data policy
Do not publish victim identities, private addresses, phone numbers, or other sensitive personal information. Do not publish unverified accusations or label a person a criminal based only on a complaint. Public case information should be based on lawful, authoritative sources and clearly show verification/source metadata.
