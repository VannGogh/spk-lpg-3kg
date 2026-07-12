# SPK LPG 3KG - Core App

Aplikasi SPK alokasi distribusi LPG 3KG. 
**Stack:** Laravel (Backend) + React / Inertia.js (Frontend) + Supabase (DB) + Vercel (Hosting).

## 📂 Struktur Project (Developer Guide)

Struktur ini sudah dirampingkan. Developer baru cukup fokus ke direktori berikut:

- **`resources/js/Pages/`**
  UI dan logic Frontend (React.js). Tempat semua halaman berada (contoh: `Dashboard.jsx`, `Warung/Index.jsx`).
- **`app/Http/Controllers/`**
  Logic Backend (PHP). Menangani request, ambil data dari database, lalu di-return ke Frontend via Inertia.
- **`app/Models/`**
  Definisi skema dan relasi tabel database (Eloquent ORM).
- **`routes/web.php`**
  Peta semua URL/endpoint aplikasi.
- **`api/index.php` & `vercel.json`**
  Konfigurasi khusus agar aplikasi bisa berjalan di hosting Vercel (Serverless). Jangan diganggu.

---
*ponytail: Boilerplate bawaan Laravel seperti folder `tests/`, konfigurasi Docker, dan `phpunit` sudah dipangkas (YAGNI) karena sistem berjalan murni di atas Vercel + Supabase tanpa automated local tests.*
