# Social Safety BD

Professional prototype with:
- frontend/ — React + Vite + Leaflet + Recharts
- backend/ — Django API
- docs/prototype.png — generated visual prototype

## Run frontend
```bash
cd frontend
npm install
npm run dev
```

## Run backend
Windows PowerShell:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

## Connect frontend to API
The current frontend uses local demo data so it runs immediately. Replace `frontend/src/data.js` with fetch calls to the Django endpoints when you are ready.

## Responsible-data requirements
This project must use authoritative, verifiable sources before real publication. Every case record should include source, verification status and last updated date. Never publish victim identities, private addresses, phone numbers, or unverified accusations. Do not call someone a “rapist” unless the relevant court outcome is verified and publication is lawful and appropriate.
