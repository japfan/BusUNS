# PRD — BusUNS: Sistem Informasi Jadwal dan Rute Bus Kampus

## 1. Ringkasan Produk

**BusUNS** adalah web app yang menyediakan informasi jadwal dan rute bus kampus untuk mahasiswa. Sistem ini membantu mahasiswa mengetahui jam keberangkatan, rute yang tersedia, halte yang dilewati, serta pengumuman operasional bus kampus.

Pada tahap awal, BusUNS **tidak menggunakan fitur tracking GPS atau live location**. Fokus utama sistem adalah menampilkan informasi jadwal dan rute secara jelas, mudah diakses, dan dapat diperbarui oleh admin.

## 2. Latar Belakang

Mahasiswa sering mengalami kesulitan mengetahui jadwal keberangkatan bus kampus secara pasti. Informasi jadwal biasanya tersebar, tidak selalu diperbarui, atau hanya tersedia secara manual di titik tertentu. Akibatnya, mahasiswa dapat menunggu terlalu lama di halte atau tidak mengetahui rute bus yang sesuai dengan tujuan mereka.

Untuk mengatasi masalah tersebut, diperlukan web app yang dapat menjadi pusat informasi jadwal dan rute bus kampus. Sistem ini dapat diakses melalui browser dan dapat dihubungkan dengan QR code yang ditempel di halte.

## 3. Tujuan Produk

Tujuan utama BusUNS adalah:

1. Menyediakan informasi jadwal bus kampus secara terpusat.
2. Memudahkan mahasiswa melihat rute dan halte yang dilewati bus.
3. Memudahkan mahasiswa mengetahui jadwal keberangkatan berdasarkan rute.
4. Memudahkan admin memperbarui jadwal, rute, halte, dan pengumuman operasional.
5. Mengurangi kebingungan mahasiswa saat menunggu bus di halte.

## 4. Ruang Lingkup Produk

### 4.1 Termasuk dalam Scope

Fitur yang termasuk dalam tahap awal:

1. Halaman informasi untuk mahasiswa.
2. Daftar jadwal keberangkatan bus.
3. Daftar rute bus kampus.
4. Detail halte pada setiap rute.
5. Fitur pencarian atau filter jadwal.
6. Pengumuman operasional bus.
7. Dashboard admin sederhana.
8. Fitur tambah, edit, dan hapus jadwal oleh admin.
9. Fitur tambah, edit, dan hapus rute/halte oleh admin.
10. Tampilan responsive untuk desktop dan mobile.

### 4.2 Tidak Termasuk dalam Scope Tahap Awal

Fitur yang belum dibuat pada tahap awal:

1. Tracking lokasi bus secara real-time.
2. Estimasi waktu tiba berbasis GPS.
3. Aplikasi khusus sopir.
4. Sensor jumlah penumpang.
5. Notifikasi otomatis berbasis lokasi.
6. Integrasi pembayaran.
7. Integrasi dengan sistem akademik kampus.

## 5. Target Pengguna

### 5.1 Mahasiswa

Mahasiswa menggunakan BusUNS untuk:

- Melihat jadwal keberangkatan bus.
- Mencari rute berdasarkan halte atau tujuan.
- Melihat daftar halte yang dilewati rute tertentu.
- Membaca pengumuman terkait operasional bus.

### 5.2 Admin

Admin menggunakan BusUNS untuk:

- Mengelola data jadwal bus.
- Mengelola data rute.
- Mengelola data halte.
- Mengelola pengumuman operasional.
- Memastikan informasi yang tampil untuk mahasiswa tetap terbaru.

## 6. Persona Pengguna

### 6.1 Mahasiswa Reguler

Mahasiswa yang setiap hari menggunakan bus kampus untuk berpindah antar fakultas. Kebutuhan utamanya adalah mengetahui jadwal dan rute bus secara cepat.

### 6.2 Mahasiswa Baru

Mahasiswa yang belum hafal lokasi fakultas, halte, dan rute bus. Kebutuhan utamanya adalah melihat jalur rute dan urutan halte dengan jelas.

### 6.3 Admin Transportasi Kampus

Pihak yang bertugas memperbarui informasi jadwal dan rute bus. Kebutuhan utamanya adalah dashboard yang mudah digunakan untuk menambah atau mengubah data.

## 7. User Problem

Masalah utama yang ingin diselesaikan:

1. Mahasiswa tidak mengetahui jadwal keberangkatan bus secara pasti.
2. Mahasiswa tidak mengetahui rute mana yang melewati fakultas atau halte tertentu.
3. Informasi jadwal bus sulit diperbarui jika hanya berbentuk poster/manual.
4. Mahasiswa harus bertanya atau menunggu tanpa kepastian di halte.
5. Pengumuman perubahan jadwal tidak tersampaikan secara merata.

## 8. User Flow

### 8.1 User Flow Mahasiswa

1. Mahasiswa membuka web BusUNS.
2. Mahasiswa melihat jadwal keberangkatan terdekat.
3. Mahasiswa mencari rute, halte, atau jam keberangkatan.
4. Sistem menampilkan jadwal yang sesuai.
5. Mahasiswa memilih rute tertentu.
6. Sistem menampilkan detail halte yang dilewati rute tersebut.
7. Mahasiswa membaca pengumuman jika ada perubahan operasional.

### 8.2 User Flow Admin

1. Admin membuka halaman login.
2. Admin masuk ke dashboard.
3. Admin melihat ringkasan data rute, halte, jadwal, dan pengumuman.
4. Admin menambah atau mengedit jadwal.
5. Admin menambah atau mengedit rute dan halte.
6. Admin menambahkan pengumuman operasional.
7. Perubahan data tampil pada halaman mahasiswa.

## 9. Fitur Utama

### 9.1 Halaman Mahasiswa

Halaman mahasiswa adalah halaman utama yang dapat diakses tanpa login.

Komponen utama:

- Navbar aplikasi.
- Search bar.
- Card jadwal berikutnya.
- Tabel jadwal keberangkatan.
- Daftar rute bus.
- Detail halte per rute.
- Pengumuman operasional.
- Mockup atau visualisasi rute sederhana.

### 9.2 Jadwal Bus

Sistem menampilkan daftar jadwal keberangkatan berdasarkan rute.

Data yang ditampilkan:

- Nama rute.
- Jam keberangkatan.
- Halte awal.
- Tujuan akhir.
- Hari operasional.
- Keterangan tambahan.

### 9.3 Rute dan Halte

Sistem menampilkan daftar rute beserta halte yang dilewati.

Data rute awal:

- **Rute A:** Gerbang Depan → Teknik → FEB → FISIP → Hukum
- **Rute B:** Gerbang Belakang → Pasca → Kedokteran → Psikologi → MIPA → Pertanian → Rektorat
- **Rute C:** Gerbang Samping → FKIP → FIB → FSRD → Peternakan

### 9.4 Search dan Filter

Mahasiswa dapat mencari jadwal berdasarkan:

- Nama rute.
- Nama halte.
- Jam keberangkatan.
- Tujuan.

Contoh:

- Mahasiswa mengetik “Teknik”, maka sistem menampilkan jadwal rute yang melewati Teknik.
- Mahasiswa mengetik “Rute B”, maka sistem menampilkan jadwal Rute B.
- Mahasiswa mengetik “06.30”, maka sistem menampilkan jadwal pada jam tersebut.

### 9.5 Pengumuman Operasional

Admin dapat menambahkan pengumuman yang akan tampil di halaman mahasiswa.

Contoh pengumuman:

- “Jadwal bus dapat berubah saat hujan deras.”
- “Rute B tidak beroperasi sementara karena kegiatan kampus.”
- “Mulai Senin, jadwal keberangkatan pagi dimulai pukul 06.30.”

### 9.6 Dashboard Admin

Dashboard admin digunakan untuk mengelola data yang tampil di halaman mahasiswa.

Komponen utama:

- Ringkasan jumlah rute.
- Ringkasan jumlah halte.
- Ringkasan jumlah jadwal.
- Ringkasan jumlah pengumuman aktif.
- Tabel jadwal.
- Form tambah/edit jadwal.
- Form tambah/edit rute.
- Form tambah/edit pengumuman.

## 10. Kebutuhan Data

### 10.1 Data Rute

Contoh struktur data:

```json
{
  "id": "route_a",
  "name": "Rute A",
  "stops": ["Gerbang Depan", "Teknik", "FEB", "FISIP", "Hukum"],
  "status": "active"
}
```

### 10.2 Data Jadwal

Contoh struktur data:

```json
{
  "id": "schedule_001",
  "routeId": "route_a",
  "time": "06.30",
  "from": "Gerbang Depan",
  "to": "Hukum",
  "days": "Senin–Jumat",
  "note": "Jadwal pagi",
  "status": "active"
}
```

### 10.3 Data Pengumuman

Contoh struktur data:

```json
{
  "id": "announcement_001",
  "title": "Perubahan Jadwal",
  "content": "Jadwal dapat berubah saat kegiatan kampus besar.",
  "status": "active",
  "createdAt": "2026-05-28"
}
```

## 11. Kebutuhan Halaman

### 11.1 Halaman Mahasiswa

URL contoh: `/`

Isi halaman:

1. Header.
2. Hero section.
3. Search/filter jadwal.
4. Jadwal berikutnya.
5. Tabel jadwal.
6. Daftar rute.
7. Detail halte.
8. Pengumuman.

### 11.2 Halaman Admin

URL contoh: `/admin`

Isi halaman:

1. Login admin.
2. Dashboard ringkasan.
3. Tabel jadwal.
4. Form tambah/edit jadwal.
5. Tabel rute dan halte.
6. Form tambah/edit rute.
7. Tabel pengumuman.
8. Form tambah/edit pengumuman.

## 12. Kebutuhan Non-Fungsional

1. Web harus responsive di laptop dan smartphone.
2. Informasi jadwal harus mudah dibaca.
3. Navigasi harus sederhana.
4. Data jadwal harus bisa diperbarui oleh admin.
5. Halaman mahasiswa dapat diakses tanpa login.
6. Halaman admin harus dilindungi login.
7. Tampilan harus ringan dan tidak membingungkan.
8. Sistem tahap awal harus tetap bisa berjalan tanpa GPS.

## 13. Prioritas Fitur

### 13.1 Prioritas Tinggi

1. Halaman mahasiswa.
2. Tabel jadwal bus.
3. Daftar rute dan halte.
4. Search/filter jadwal.
5. Pengumuman operasional.
6. Tampilan responsive.

### 13.2 Prioritas Sedang

1. Dashboard admin.
2. Tambah/edit/hapus jadwal.
3. Tambah/edit/hapus rute.
4. Tambah/edit/hapus pengumuman.
5. Login admin.

### 13.3 Prioritas Rendah

1. QR code per halte.
2. Export jadwal.
3. Riwayat perubahan jadwal.
4. Notifikasi pengingat jadwal.

## 14. MVP

MVP atau versi awal BusUNS harus memiliki:

1. Halaman mahasiswa yang menampilkan jadwal bus.
2. Daftar rute A, B, dan C.
3. Detail halte pada setiap rute.
4. Search/filter jadwal.
5. Pengumuman operasional.
6. Halaman admin sederhana untuk mengelola jadwal.
7. Data dummy atau database sederhana.
8. Tampilan responsive.

## 15. Acceptance Criteria

Produk dianggap berhasil pada tahap awal jika:

1. Mahasiswa dapat membuka web tanpa login.
2. Mahasiswa dapat melihat daftar jadwal bus.
3. Mahasiswa dapat mencari jadwal berdasarkan rute, halte, atau jam.
4. Mahasiswa dapat melihat detail halte pada setiap rute.
5. Mahasiswa dapat membaca pengumuman operasional.
6. Admin dapat menambah, mengedit, dan menghapus jadwal.
7. Admin dapat mengubah pengumuman operasional.
8. Tampilan dapat digunakan dengan baik di desktop dan mobile.
9. Sistem tetap berjalan tanpa fitur tracking GPS.

## 16. Pembagian Tugas Tim

### 16.1 UI/UX Designer

Tugas:

- Membuat desain halaman mahasiswa.
- Membuat desain halaman admin.
- Menentukan warna, layout, typography, dan komponen UI.
- Membuat prototype alur penggunaan.

### 16.2 Frontend Developer 1

Tugas:

- Membuat halaman mahasiswa.
- Membuat tabel jadwal.
- Membuat search/filter jadwal.
- Membuat tampilan daftar rute dan detail halte.

### 16.3 Frontend Developer 2

Tugas:

- Membuat halaman admin.
- Membuat form tambah/edit jadwal.
- Membuat form tambah/edit rute dan pengumuman.
- Membantu responsive design.

### 16.4 Backend Developer

Tugas:

- Menentukan struktur database.
- Membuat koneksi database.
- Membuat autentikasi admin.
- Menyediakan data jadwal, rute, halte, dan pengumuman.

### 16.5 Bug Tester

Tugas:

- Menguji fitur search/filter.
- Menguji tambah/edit/hapus data.
- Menguji tampilan mobile dan desktop.
- Mencatat bug dan hasil pengujian.

### 16.6 Dokumentasi

Tugas:

- Menulis latar belakang.
- Menulis tujuan sistem.
- Menulis analisis kebutuhan.
- Menulis dokumentasi fitur.
- Menyusun screenshot hasil sistem.

### 16.7 Tim Lapangan 1

Tugas:

- Mendata titik halte.
- Memastikan nama halte sesuai dengan kondisi kampus.
- Mengambil foto halte jika diperlukan.

### 16.8 Tim Lapangan 2

Tugas:

- Membantu pendataan halte.
- Membantu pemasangan QR code jika fitur QR digunakan.
- Menguji apakah QR dapat dibuka dengan baik.

## 17. Risiko dan Batasan

| Risiko | Dampak | Solusi |
|---|---|---|
| Jadwal bus berubah-ubah | Informasi bisa tidak akurat | Admin harus mudah memperbarui jadwal |
| Data halte belum lengkap | Rute sulit dipahami | Tim lapangan melakukan pendataan |
| Mahasiswa tidak tahu web tersedia | Web jarang digunakan | Tempel QR code di halte dan publikasi |
| Admin lupa update data | Informasi menjadi usang | Buat pengingat dan dokumentasi admin |
| Tampilan terlalu rumit | Mahasiswa sulit menggunakan | Buat UI sederhana dan mobile-friendly |

## 18. Teknologi yang Disarankan

### 18.1 Frontend

- Next.js
- Tailwind CSS
- Lucide React untuk ikon
- Shadcn/UI jika ingin komponen UI yang lebih rapi

### 18.2 Struktur Frontend yang Disarankan

Struktur halaman Next.js yang disarankan:

```text
app/
├── page.jsx                  # Halaman mahasiswa
├── admin/
│   ├── page.jsx              # Dashboard admin
│   ├── jadwal/page.jsx       # Kelola jadwal
│   ├── rute/page.jsx         # Kelola rute dan halte
│   └── pengumuman/page.jsx   # Kelola pengumuman
├── layout.jsx
└── globals.css

components/
├── Navbar.jsx
├── ScheduleTable.jsx
├── RouteCard.jsx
├── RouteDetail.jsx
├── AnnouncementCard.jsx
├── AdminSidebar.jsx
└── ScheduleForm.jsx

data/
└── dummyData.js
```

Pada tahap frontend awal, data dapat disimpan di `dummyData.js`. Setelah backend siap, data dummy dapat diganti dengan data dari database.

### 18.3 Backend/Database

- Firebase Firestore atau Supabase
- Firebase Auth atau Supabase Auth untuk login admin

### 18.4 Hosting

- Vercel
- Netlify
- Firebase Hosting

## 19. Roadmap Pengerjaan

### Tahap 1 — Perancangan

- Finalisasi PRD.
- Finalisasi data rute dan halte.
- Membuat wireframe UI.
- Membagi tugas tim.

### Tahap 2 — Frontend Dummy

- Membuat halaman mahasiswa.
- Membuat halaman admin.
- Menggunakan data dummy.
- Membuat search/filter.
- Membuat form tambah/edit sementara.

### Tahap 3 — Backend dan Database

- Membuat struktur database.
- Membuat login admin.
- Menghubungkan data jadwal ke database.
- Menghubungkan data rute dan pengumuman ke database.

### Tahap 4 — Integrasi dan Testing

- Menguji semua fitur.
- Memperbaiki bug.
- Menguji tampilan mobile.
- Menyiapkan dokumentasi akhir.

### Tahap 5 — Demo dan Presentasi

- Menyiapkan data contoh.
- Menyiapkan skenario demo.
- Menyiapkan laporan.
- Menyiapkan slide presentasi jika diperlukan.

## 20. Catatan Penting

BusUNS tahap awal tidak bertujuan menggantikan sistem monitoring real-time. Produk ini dibuat sebagai solusi awal yang lebih sederhana, murah, dan realistis untuk membantu mahasiswa mengakses informasi jadwal dan rute bus kampus.

Fitur tracking GPS dapat dipertimbangkan pada pengembangan berikutnya jika tersedia anggaran, perangkat, dan kesiapan sistem yang memadai.

