# PRD — BusUNS: Sistem Informasi Jadwal Bus Kampus Berbasis Halte

## 1. Ringkasan Produk

**BusUNS** adalah web app yang menyediakan informasi jadwal bus kampus UNS. Sistem ini membantu mahasiswa melihat jadwal keberangkatan bus berdasarkan halte yang dipilih.

Pada tahap awal, BusUNS **tidak menggunakan fitur tracking GPS, live location, atau estimasi waktu tiba real-time**. Fokus utama sistem adalah menyediakan informasi jadwal bus yang mudah diakses, berbasis halte, dan dapat diperbarui oleh admin.

Konsep utama BusUNS adalah:

> Mahasiswa memilih halte terlebih dahulu, lalu sistem menampilkan jadwal keberangkatan bus dari halte tersebut.

BusUNS hanya memiliki **satu rute utama** yang terdiri dari beberapa halte. Oleh karena itu, sistem tidak menggunakan konsep banyak rute seperti Rute A, Rute B, dan Rute C.

---

## 2. Latar Belakang

Mahasiswa sering mengalami kesulitan mengetahui jadwal keberangkatan bus kampus dari halte tertentu. Informasi jadwal bus sering kali tidak tersedia secara terpusat, sulit diperbarui, atau hanya diketahui melalui informasi manual.

Akibatnya, mahasiswa dapat menunggu terlalu lama di halte karena tidak mengetahui kapan bus akan berangkat atau melewati halte tersebut. Selain itu, mahasiswa baru juga dapat mengalami kesulitan memahami urutan halte dan jalur bus kampus.

Untuk mengatasi masalah tersebut, diperlukan sebuah web app yang dapat menampilkan jadwal bus berdasarkan halte. Dengan sistem ini, mahasiswa cukup memilih halte tempat mereka menunggu, kemudian melihat jadwal keberangkatan bus dari halte tersebut.

---

## 3. Tujuan Produk

Tujuan utama BusUNS adalah:

1. Menyediakan informasi jadwal bus kampus berbasis halte.
2. Memudahkan mahasiswa memilih halte dan melihat jadwal keberangkatan dari halte tersebut.
3. Menampilkan urutan halte dalam satu rute utama BusUNS.
4. Menyediakan informasi pengumuman operasional bus.
5. Memudahkan admin dalam mengelola halte, jadwal tiap halte, dan pengumuman.
6. Mengurangi kebingungan mahasiswa saat menunggu bus di halte.
7. Menjadi solusi awal yang sederhana, murah, dan realistis sebelum pengembangan fitur tracking real-time.

---

## 4. Ruang Lingkup Produk

### 4.1 Termasuk dalam Scope

Fitur yang termasuk dalam tahap awal:

1. Halaman utama untuk mahasiswa.
2. Daftar halte bus dalam bentuk card/folder.
3. Detail jadwal keberangkatan pada setiap halte.
4. Informasi halte berikutnya.
5. Informasi urutan halte dalam satu rute utama.
6. Search/filter untuk mencari halte atau jadwal.
7. Pengumuman operasional.
8. Dashboard admin sederhana.
9. Fitur tambah, edit, dan hapus halte.
10. Fitur tambah, edit, dan hapus jadwal pada setiap halte.
11. Fitur tambah, edit, dan hapus pengumuman.
12. Tampilan responsive untuk desktop dan mobile.

### 4.2 Tidak Termasuk dalam Scope Tahap Awal

Fitur yang tidak dibuat pada tahap awal:

1. Tracking lokasi bus secara real-time.
2. Live location bus.
3. Estimasi waktu tiba berbasis GPS.
4. Aplikasi khusus sopir.
5. Sensor jumlah penumpang.
6. Notifikasi otomatis berbasis lokasi.
7. Sistem pembayaran.
8. Integrasi dengan sistem akademik kampus.
9. Konsep multi-rute seperti Rute A, Rute B, dan Rute C.

---

## 5. Konsep Utama Sistem

BusUNS menggunakan konsep **jadwal berbasis halte**.

Alur utama sistem:

```text
Mahasiswa membuka web
↓
Mahasiswa memilih halte
↓
Sistem menampilkan jadwal keberangkatan dari halte tersebut
↓
Mahasiswa melihat halte berikutnya dan informasi operasional
```

Sistem tidak menampilkan jadwal berdasarkan rute. Karena hanya ada satu rute utama, jadwal ditampilkan berdasarkan halte.

### 5.1 Struktur yang Digunakan

```text
Pilih Halte
↓
Jadwal Halte
↓
Detail Keberangkatan
```

### 5.2 Struktur yang Tidak Digunakan

```text
Pilih Rute
↓
Jadwal Rute
↓
Detail Rute
```

BusUNS harus menghindari penggunaan istilah dan tampilan seperti:

* Rute A
* Rute B
* Rute C
* Jadwal per rute
* Tracking bus
* Live location
* ETA real-time

---

## 6. Target Pengguna

### 6.1 Mahasiswa

Mahasiswa menggunakan BusUNS untuk:

* Melihat daftar halte bus.
* Memilih halte tempat mereka akan naik bus.
* Melihat jadwal keberangkatan dari halte tersebut.
* Mengetahui halte berikutnya.
* Membaca pengumuman operasional.
* Memahami urutan halte pada rute utama.

### 6.2 Admin

Admin menggunakan BusUNS untuk:

* Mengelola daftar halte.
* Mengatur urutan halte dalam rute utama.
* Mengelola jadwal keberangkatan pada setiap halte.
* Mengelola pengumuman operasional.
* Memastikan informasi yang ditampilkan kepada mahasiswa selalu terbaru.

---

## 7. Persona Pengguna

### 7.1 Mahasiswa Reguler

Mahasiswa yang sering menggunakan bus kampus untuk berpindah antar fakultas. Kebutuhan utamanya adalah mengetahui jadwal bus dari halte tempat ia menunggu.

### 7.2 Mahasiswa Baru

Mahasiswa yang belum memahami lokasi halte dan urutan jalur bus kampus. Kebutuhan utamanya adalah melihat daftar halte, urutan halte, dan jadwal keberangkatan secara jelas.

### 7.3 Admin Transportasi Kampus

Pihak yang bertanggung jawab memperbarui informasi jadwal bus. Kebutuhan utamanya adalah dashboard yang mudah digunakan untuk mengatur halte, jadwal, dan pengumuman.

---

## 8. User Problem

Masalah utama yang ingin diselesaikan:

1. Mahasiswa tidak mengetahui jadwal keberangkatan bus dari halte tertentu.
2. Mahasiswa harus menunggu tanpa kepastian di halte.
3. Informasi jadwal bus tidak tersedia secara terpusat.
4. Mahasiswa baru belum memahami urutan halte bus kampus.
5. Informasi perubahan jadwal sulit disampaikan secara cepat.
6. Jadwal berbentuk manual sulit diperbarui jika terjadi perubahan.

---

## 9. User Flow

### 9.1 User Flow Mahasiswa

1. Mahasiswa membuka web BusUNS.
2. Mahasiswa melihat halaman utama.
3. Mahasiswa melihat daftar halte dalam bentuk card/folder.
4. Mahasiswa mencari halte melalui search bar atau memilih langsung dari daftar.
5. Mahasiswa memilih salah satu halte.
6. Sistem menampilkan detail jadwal keberangkatan dari halte tersebut.
7. Sistem menampilkan halte berikutnya.
8. Mahasiswa membaca pengumuman operasional jika tersedia.
9. Mahasiswa dapat kembali ke daftar halte untuk memilih halte lain.

### 9.2 User Flow Admin

1. Admin membuka halaman login.
2. Admin masuk ke dashboard admin.
3. Admin melihat ringkasan data halte, jadwal, dan pengumuman.
4. Admin memilih menu kelola halte.
5. Admin menambah, mengedit, atau menghapus halte.
6. Admin memilih menu kelola jadwal.
7. Admin memilih halte tertentu.
8. Admin menambah, mengedit, atau menghapus jadwal untuk halte tersebut.
9. Admin mengelola pengumuman operasional.
10. Perubahan data tampil pada halaman mahasiswa.

---

## 10. Fitur Utama

### 10.1 Halaman Mahasiswa

Halaman mahasiswa adalah halaman publik yang dapat diakses tanpa login.

Komponen utama:

1. Navbar BusUNS.
2. Hero section.
3. Search bar.
4. Daftar halte dalam bentuk card/folder.
5. Detail jadwal halte yang dipilih.
6. Informasi halte berikutnya.
7. Visualisasi sederhana rute utama.
8. Pengumuman operasional.

### 10.2 Pilih Halte

Mahasiswa memilih halte terlebih dahulu sebelum melihat jadwal.

Contoh tampilan:

```text
Pilih Halte Keberangkatan

[Gerbang Depan] [Teknik] [FEB] [FISIP]
[Hukum] [Gerbang Belakang] [Pasca]
[Kedokteran] [Psikologi] [MIPA]
[Pertanian] [Rektorat] [Gerbang Samping]
[FKIP] [FIB] [FSRD] [Peternakan]
```

Setiap halte ditampilkan seperti folder/card yang bisa diklik.

### 10.3 Jadwal Halte

Setelah mahasiswa memilih halte, sistem menampilkan jadwal keberangkatan khusus dari halte tersebut.

Data yang ditampilkan:

1. Nama halte.
2. Jam keberangkatan.
3. Halte berikutnya.
4. Hari operasional.
5. Keterangan jadwal.

Contoh:

#### Halte Gerbang Depan

| Jam   | Halte Berikutnya | Hari        | Keterangan     |
| ----- | ---------------- | ----------- | -------------- |
| 06.30 | Teknik           | Senin–Jumat | Jadwal pagi    |
| 07.00 | Teknik           | Senin–Jumat | Jadwal pagi    |
| 09.00 | Teknik           | Senin–Jumat | Jadwal reguler |
| 12.30 | Teknik           | Senin–Jumat | Jadwal siang   |
| 16.00 | Teknik           | Senin–Jumat | Jadwal sore    |

#### Halte Teknik

| Jam   | Halte Berikutnya | Hari        | Keterangan     |
| ----- | ---------------- | ----------- | -------------- |
| 06.40 | FEB              | Senin–Jumat | Jadwal pagi    |
| 07.10 | FEB              | Senin–Jumat | Jadwal pagi    |
| 09.10 | FEB              | Senin–Jumat | Jadwal reguler |
| 12.40 | FEB              | Senin–Jumat | Jadwal siang   |
| 16.10 | FEB              | Senin–Jumat | Jadwal sore    |

### 10.4 Rute Utama BusUNS

BusUNS hanya memiliki satu rute utama.

Urutan halte rute utama:

```text
Gerbang Depan
↓
Teknik
↓
FEB
↓
FISIP
↓
Hukum
↓
Gerbang Belakang
↓
Pasca
↓
Kedokteran
↓
Psikologi
↓
MIPA
↓
Pertanian
↓
Rektorat
↓
Gerbang Samping
↓
FKIP
↓
FIB
↓
FSRD
↓
Peternakan
```

Catatan: urutan halte dapat disesuaikan kembali berdasarkan hasil pendataan lapangan.

### 10.5 Search dan Filter

Search digunakan untuk mencari halte atau jadwal.

Mahasiswa dapat mencari berdasarkan:

1. Nama halte.
2. Nama fakultas.
3. Jam keberangkatan.
4. Halte berikutnya.

Contoh:

* Jika mahasiswa mengetik “Teknik”, sistem menampilkan halte Teknik dan jadwal yang berkaitan.
* Jika mahasiswa mengetik “06.30”, sistem menampilkan jadwal yang memiliki jam 06.30.
* Jika mahasiswa mengetik “FEB”, sistem menampilkan halte FEB atau jadwal yang menuju FEB.

### 10.6 Pengumuman Operasional

Pengumuman digunakan untuk menyampaikan informasi penting kepada mahasiswa.

Contoh pengumuman:

* “Jadwal dapat berubah saat hujan deras.”
* “Bus tidak beroperasi pada hari libur nasional.”
* “Jadwal sore dimulai pukul 16.00.”
* “Halte tertentu tidak digunakan sementara karena kegiatan kampus.”

### 10.7 Dashboard Admin

Dashboard admin digunakan untuk mengelola data sistem.

Komponen utama:

1. Ringkasan jumlah halte.
2. Ringkasan jumlah jadwal.
3. Ringkasan pengumuman aktif.
4. Menu kelola halte.
5. Menu kelola jadwal per halte.
6. Menu kelola pengumuman.

---

## 11. Kebutuhan Data

### 11.1 Data Halte

Contoh struktur data:

```json
{
  "id": "halte_gerbang_depan",
  "name": "Gerbang Depan",
  "order": 1,
  "nextStopId": "halte_teknik",
  "status": "active"
}
```

### 11.2 Data Jadwal Halte

Contoh struktur data:

```json
{
  "id": "schedule_001",
  "stopId": "halte_gerbang_depan",
  "time": "06.30",
  "nextStop": "Teknik",
  "days": "Senin–Jumat",
  "note": "Jadwal pagi",
  "status": "active"
}
```

### 11.3 Data Rute Utama

Contoh struktur data:

```json
{
  "id": "main_route",
  "name": "Rute Utama BusUNS",
  "stops": [
    "Gerbang Depan",
    "Teknik",
    "FEB",
    "FISIP",
    "Hukum",
    "Gerbang Belakang",
    "Pasca",
    "Kedokteran",
    "Psikologi",
    "MIPA",
    "Pertanian",
    "Rektorat",
    "Gerbang Samping",
    "FKIP",
    "FIB",
    "FSRD",
    "Peternakan"
  ],
  "status": "active"
}
```

### 11.4 Data Pengumuman

Contoh struktur data:

```json
{
  "id": "announcement_001",
  "title": "Informasi Operasional",
  "content": "Jadwal bus dapat berubah saat kegiatan kampus besar.",
  "status": "active",
  "createdAt": "2026-05-29"
}
```

---

## 12. Kebutuhan Halaman

### 12.1 Halaman Mahasiswa

URL contoh:

```text
/
```

Isi halaman:

1. Header.
2. Hero section.
3. Search bar.
4. Daftar halte.
5. Detail jadwal halte yang dipilih.
6. Informasi halte berikutnya.
7. Visualisasi rute utama.
8. Pengumuman operasional.

### 12.2 Halaman Detail Halte

URL contoh:

```text
/halte/gerbang-depan
```

Isi halaman:

1. Nama halte.
2. Daftar jadwal keberangkatan dari halte.
3. Halte berikutnya.
4. Hari operasional.
5. Keterangan.
6. Tombol kembali ke daftar halte.

### 12.3 Halaman Admin

URL contoh:

```text
/admin
```

Isi halaman:

1. Login admin.
2. Dashboard ringkasan.
3. Menu kelola halte.
4. Menu kelola jadwal.
5. Menu kelola pengumuman.

### 12.4 Halaman Admin Kelola Halte

URL contoh:

```text
/admin/halte
```

Isi halaman:

1. Tabel daftar halte.
2. Urutan halte.
3. Halte berikutnya.
4. Status halte.
5. Tombol tambah halte.
6. Tombol edit halte.
7. Tombol hapus halte.

### 12.5 Halaman Admin Kelola Jadwal

URL contoh:

```text
/admin/jadwal
```

Isi halaman:

1. Pilihan halte.
2. Tabel jadwal berdasarkan halte yang dipilih.
3. Tombol tambah jadwal.
4. Tombol edit jadwal.
5. Tombol hapus jadwal.

### 12.6 Halaman Admin Kelola Pengumuman

URL contoh:

```text
/admin/pengumuman
```

Isi halaman:

1. Daftar pengumuman.
2. Status aktif/nonaktif.
3. Tombol tambah pengumuman.
4. Tombol edit pengumuman.
5. Tombol hapus pengumuman.

---

## 13. Kebutuhan Non-Fungsional

1. Web harus responsive di desktop dan mobile.
2. Halaman mahasiswa dapat diakses tanpa login.
3. Halaman admin harus dilindungi login.
4. Informasi jadwal harus mudah dibaca.
5. Daftar halte harus mudah dipilih.
6. Sistem harus tetap berjalan tanpa fitur GPS.
7. Tampilan harus ringan dan tidak membingungkan.
8. Data jadwal harus dapat diperbarui admin.
9. Sistem harus menggunakan struktur data yang mudah dihubungkan ke backend.
10. Website sebaiknya dapat diakses melalui QR code yang ditempel di halte.

---

## 14. Prioritas Fitur

### 14.1 Prioritas Tinggi

1. Halaman mahasiswa.
2. Daftar halte.
3. Detail jadwal per halte.
4. Search/filter halte dan jadwal.
5. Informasi halte berikutnya.
6. Pengumuman operasional.
7. Tampilan responsive.

### 14.2 Prioritas Sedang

1. Dashboard admin.
2. Tambah/edit/hapus halte.
3. Tambah/edit/hapus jadwal per halte.
4. Tambah/edit/hapus pengumuman.
5. Login admin.

### 14.3 Prioritas Rendah

1. QR code per halte.
2. Export jadwal.
3. Riwayat perubahan jadwal.
4. Notifikasi pengingat jadwal.
5. Estimasi durasi antarshalte secara statis.

---

## 15. MVP

MVP atau versi awal BusUNS harus memiliki:

1. Halaman mahasiswa.
2. Daftar halte dalam bentuk card/folder.
3. Detail jadwal untuk halte yang dipilih.
4. Search/filter halte.
5. Search/filter jadwal.
6. Informasi halte berikutnya.
7. Pengumuman operasional.
8. Halaman admin sederhana.
9. Fitur kelola jadwal per halte.
10. Tampilan responsive.
11. Data dummy atau database sederhana.

---

## 16. Acceptance Criteria

Produk dianggap berhasil pada tahap awal jika:

1. Mahasiswa dapat membuka web BusUNS tanpa login.
2. Mahasiswa dapat melihat daftar halte.
3. Mahasiswa dapat memilih salah satu halte.
4. Sistem menampilkan jadwal keberangkatan khusus dari halte yang dipilih.
5. Mahasiswa dapat mencari halte berdasarkan nama halte atau fakultas.
6. Mahasiswa dapat mencari jadwal berdasarkan jam atau halte berikutnya.
7. Mahasiswa dapat melihat informasi halte berikutnya.
8. Mahasiswa dapat membaca pengumuman operasional.
9. Admin dapat menambah, mengedit, dan menghapus halte.
10. Admin dapat menambah, mengedit, dan menghapus jadwal pada setiap halte.
11. Admin dapat mengelola pengumuman.
12. Sistem tidak menampilkan konsep multi-rute seperti Rute A, Rute B, atau Rute C.
13. Sistem tidak menampilkan fitur tracking GPS atau live location.
14. Tampilan dapat digunakan dengan baik di desktop dan mobile.

---

## 17. Pembagian Tugas Tim

### 17.1 UI/UX Designer

Tugas:

1. Membuat desain halaman mahasiswa.
2. Membuat desain card/folder halte.
3. Membuat desain halaman detail jadwal halte.
4. Membuat desain dashboard admin.
5. Menentukan warna, layout, typography, dan komponen UI.

### 17.2 Frontend Developer 1

Tugas:

1. Membuat halaman mahasiswa.
2. Membuat komponen daftar halte.
3. Membuat komponen detail jadwal halte.
4. Membuat search/filter halte.
5. Membuat tampilan responsive halaman mahasiswa.

### 17.3 Frontend Developer 2

Tugas:

1. Membuat halaman admin.
2. Membuat tabel kelola halte.
3. Membuat tabel kelola jadwal per halte.
4. Membuat form tambah/edit jadwal.
5. Membuat form tambah/edit pengumuman.

### 17.4 Backend Developer

Tugas:

1. Menentukan struktur database.
2. Membuat koneksi database.
3. Membuat autentikasi admin.
4. Menyediakan data halte.
5. Menyediakan data jadwal per halte.
6. Menyediakan data pengumuman.

### 17.5 Bug Tester

Tugas:

1. Menguji pemilihan halte.
2. Menguji tampilan jadwal per halte.
3. Menguji search/filter.
4. Menguji tambah/edit/hapus data.
5. Menguji tampilan mobile dan desktop.
6. Mencatat bug dan hasil pengujian.

### 17.6 Dokumentasi

Tugas:

1. Menulis latar belakang.
2. Menulis tujuan sistem.
3. Menulis analisis kebutuhan.
4. Menulis dokumentasi fitur.
5. Menyusun screenshot hasil sistem.
6. Menyusun panduan penggunaan.

### 17.7 Tim Lapangan 1

Tugas:

1. Mendata halte.
2. Memastikan nama halte sesuai kondisi kampus.
3. Memastikan urutan halte dalam rute utama.
4. Mengambil foto halte jika diperlukan.

### 17.8 Tim Lapangan 2

Tugas:

1. Membantu pendataan halte.
2. Membantu validasi urutan halte.
3. Membantu pemasangan QR code jika fitur QR digunakan.
4. Menguji apakah QR dapat dibuka dengan baik.

---

## 18. Risiko dan Batasan

| Risiko                              | Dampak                          | Solusi                                        |
| ----------------------------------- | ------------------------------- | --------------------------------------------- |
| Jadwal bus berubah-ubah             | Informasi bisa tidak akurat     | Admin harus mudah memperbarui jadwal          |
| Urutan halte belum valid            | Informasi rute membingungkan    | Tim lapangan melakukan validasi               |
| Data jadwal per halte belum lengkap | Jadwal tidak membantu mahasiswa | Buat data awal berdasarkan observasi          |
| Mahasiswa tidak tahu web tersedia   | Web jarang digunakan            | Tempel QR code di halte                       |
| Admin lupa update data              | Informasi menjadi usang         | Buat dokumentasi penggunaan admin             |
| UI terlalu rumit                    | Mahasiswa sulit menggunakan     | Gunakan desain sederhana berbasis card/folder |

---

## 19. Teknologi yang Disarankan

### 19.1 Frontend

1. Next.js.
2. Tailwind CSS.
3. Lucide React untuk ikon.
4. Shadcn/UI jika ingin komponen UI lebih rapi.

### 19.2 Struktur Frontend yang Disarankan

```text
app/
├── page.jsx
├── halte/
│   └── [slug]/page.jsx
├── admin/
│   ├── page.jsx
│   ├── halte/page.jsx
│   ├── jadwal/page.jsx
│   └── pengumuman/page.jsx
├── layout.jsx
└── globals.css

components/
├── Navbar.jsx
├── StopFolderGrid.jsx
├── StopCard.jsx
├── StopScheduleDetail.jsx
├── StopScheduleTable.jsx
├── MainRouteMap.jsx
├── AnnouncementCard.jsx
├── AdminSidebar.jsx
├── StopForm.jsx
├── ScheduleForm.jsx
└── AnnouncementForm.jsx

data/
└── dummyData.js
```

Pada tahap frontend awal, data dapat disimpan di `dummyData.js`. Setelah backend siap, data dummy dapat diganti dengan data dari database.

### 19.3 Backend/Database

1. Firebase Firestore atau Supabase.
2. Firebase Auth atau Supabase Auth untuk login admin.

### 19.4 Hosting

1. Vercel.
2. Netlify.
3. Firebase Hosting.

---

## 20. Roadmap Pengerjaan

### Tahap 1 — Perancangan

1. Finalisasi PRD.
2. Finalisasi daftar halte.
3. Finalisasi urutan halte.
4. Membuat wireframe UI.
5. Membagi tugas tim.

### Tahap 2 — Frontend Dummy

1. Membuat halaman mahasiswa.
2. Membuat daftar halte berbentuk card/folder.
3. Membuat halaman detail jadwal halte.
4. Membuat search/filter.
5. Membuat halaman admin.
6. Menggunakan data dummy.

### Tahap 3 — Backend dan Database

1. Membuat struktur database halte.
2. Membuat struktur database jadwal per halte.
3. Membuat struktur database pengumuman.
4. Membuat login admin.
5. Menghubungkan data ke frontend.

### Tahap 4 — Integrasi dan Testing

1. Menguji pemilihan halte.
2. Menguji jadwal per halte.
3. Menguji search/filter.
4. Menguji fitur admin.
5. Menguji tampilan mobile.
6. Memperbaiki bug.

### Tahap 5 — Demo dan Presentasi

1. Menyiapkan data contoh.
2. Menyiapkan skenario demo.
3. Menyiapkan laporan.
4. Menyiapkan slide presentasi jika diperlukan.
5. Menyiapkan QR dummy jika diperlukan.

---

## 21. Catatan Penting untuk Developer dan AI Coding

BusUNS hanya memiliki **satu rute utama**.

Jangan membuat sistem multi-rute seperti:

* Rute A
* Rute B
* Rute C

Jangan membuat jadwal langsung berdasarkan rute.

Alur yang benar adalah:

```text
Pilih Halte
↓
Tampilkan Jadwal Halte
```

Gunakan istilah:

* Pilih Halte
* Jadwal Halte
* Halte Berikutnya
* Rute Utama BusUNS
* Jadwal Keberangkatan dari Halte

Hindari istilah:

* Rute A
* Rute B
* Rute C
* Jadwal per rute
* Tracking bus
* Live location
* ETA real-time

Frontend harus mengutamakan card/folder halte sebagai pintu masuk utama sebelum pengguna melihat jadwal.
