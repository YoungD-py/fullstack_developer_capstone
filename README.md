# Car Dealership & Reviews (IBM Capstone)

Proyek full-stack Django + React untuk listing dealer, detail dealer, dan ulasan dengan integrasi analisis sentimen.

## Struktur Folder

```
backend/
  manage.py
  ibm_dealership/
  djangoapp/
frontend/
  package.json
  src/
requirements.txt
```

## Menjalankan Backend (Django)

1. Buat virtualenv (Windows PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Migrasi database dan jalankan server:

```powershell
cd backend
python manage.py migrate
python manage.py createsuperuser  # opsional untuk akses /admin
python manage.py runserver 0.0.0.0:8000
```

3. Endpoint utama:
- GET /djangoapp/get_dealers
- GET /djangoapp/get_dealers/<STATE>
- GET /djangoapp/dealer/<ID>
- GET /djangoapp/reviews/dealer/<ID>
- POST /djangoapp/add_review
- POST /djangoapp/login
- POST /djangoapp/logout
- POST /djangoapp/register (untuk form registrasi React)

> Catatan: Service Node/NoSQL untuk dealer/review dapat diset via env `REVIEWS_API_BASE` dan `DEALERS_API_BASE`. Jika tidak tersedia, fallback mock digunakan.

## Menjalankan Frontend (React + Vite)

1. Install dependency dan jalankan dev server:

```powershell
cd frontend
npm install
npm run dev
```

2. Akses di http://localhost:5173 (pastikan backend berjalan di http://localhost:8000)

## Konfigurasi CORS/CSRF
- CORS diaktifkan untuk pengembangan lokal.
- CSRF trusted origins: `http://localhost:5173`.

## Analisis Sentimen
- Menggunakan VADER (`vaderSentiment`).
- Dipanggil saat endpoint `POST /djangoapp/add_review` untuk menentukan `positive/negative/neutral`.

## Model Penilaian (Submission)
- `Question`, `Choice (is_correct)`, `Submission (choices M2M)`.
- `Question.is_correct_submission(submission)` membandingkan pilihan benar vs pilihan user.
- `Submission.score()` menjumlah grade untuk setiap pertanyaan yang benar.

## Bootstrap
- Frontend memakai Bootstrap via CDN di `frontend/index.html`.

## Build Production
```powershell
cd frontend
npm run build
```
Output produksi akan berada di `frontend/dist`.
