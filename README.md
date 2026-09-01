# SIM-GASUK (Sistem Monitoring Gagal Tusuk)

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/id/6/65/Pmi.png" alt="Logo PMI" width="120" />
  <h3>Unit Transfusi Darah (UTD) PMI Kota Pasuruan</h3>
  <p><strong>Sistem Informasi Manajemen Monitoring Gagal Tusuk & Evaluasi Kegagalan Donor Darah</strong></p>
</div>

---

## 📌 Tentang Proyek

**SIM-GASUK** adalah sistem informasi berbasis web yang dirancang khusus untuk memantau, mencatat, mengelola, dan mengevaluasi insiden kegagalan penusukan jarum (kanulasi/aftap) serta kegagalan pada tahap seleksi/screening medis pendonor di Unit Transfusi Darah (UTD) PMI Kota Pasuruan.

Sistem ini bertujuan untuk:
- Meningkatkan akurasi pencatatan data kegagalan donor.
- Membantu petugas dan manajemen mengevaluasi faktor penyebab kegagalan (teknis aftap maupun kondisi medis pendonor).
- Mempermudah rekapitulasi laporan berkala dalam format digital (Excel & PDF).
- Menjaga standar kualitas dan keselamatan pelayanan transfusi darah.

---

## 🚀 Fitur Utama

- **📊 Dashboard Interaktif & Statistik Real-Time**
  - Ringkasan total data donor gagal tusuk / donor tertunda.
  - Tracking insiden hari ini secara otomatis.
  - Filter pencarian cepat berdasarkan Nama/ID, Golongan Darah (A, B, AB, O), dan Kategori Kegagalan.
  - Fitur Ekspor Data ke Excel (`.xlsx`) dan Impor/Sinkronisasi Data.

- **🩺 Modul Input Screening (Pemeriksaan Medis Awal)**
  - Pencatatan pendonor yang tidak lolos tahap screening awal (seperti Hemoglobin rendah/tinggi, tekanan darah/tensi tidak memenuhi syarat, riwayat konsumsi obat, berat badan kurang, dsb).

- **💉 Modul Input Aftap (Tindakan Pengambilan Darah / Kanulasi)**
  - Pencatatan insiden gagal tusuk saat proses flebotomi/aftap (seperti vena kolaps/pecah, hematoma, aliran darah macet/berhenti, vena sulit ditemukan, dsb).

- **📑 Modul Database & Laporan Terpusat (`/db`)**
  - Tabel rekapitulasi data lengkap pendonor dan riwayat kegagalan.
  - Cetak laporan langsung dan ekspor ke format PDF (`html2pdf.js`).
  - Ekspor data laporan ke spreadsheet Excel.
  - Aksi hapus data & navigasi cepat ke form edit.

- **✏️ Modul Edit & Pembaruan Data (`/edit`)**
  - Pembaruan informasi pendonor, penyebab kegagalan, dan catatan medis lanjutan.

- **🔔 Sistem Notifikasi & Toast (`NotificationProvider`)**
  - Notifikasi interaktif untuk feedback aksi pengguna (sukses simpan, edit, hapus, dan unduh data).

- **🌐 Halaman Beranda Publik & Profil UTD PMI**
  - Informasi layanan SIM-GASUK, visi dan misi UTD PMI Kota Pasuruan, banner dokumentasi kegiatan, serta integrasi peta lokasi dan kontak resmi.

---

## 🛠️ Teknologi & Dependensi

Proyek ini dibangun menggunakan teknologi web modern:

| Kategori | Teknologi |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) & JavaScript (ES6+) |
| **Library UI** | [React 18](https://react.dev/) |
| **Styling** | Vanilla CSS (Modern Glassmorphism, Micro-animations, Responsive Layout) |
| **Ekspor Excel** | [XLSX (SheetJS)](https://sheetjs.com/) |
| **Ekspor PDF** | [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) |
| **Penyimpanan Data** | Browser LocalStorage (Client-side Data Store, siap diintegrasikan dengan REST API / Database) |

---

## 📁 Struktur Direktori Proyek

```text
sistem-gagal-tusuk/
├── app/
│   ├── aftap/             # Form input insiden gagal tusuk aftap
│   ├── dashboard/         # Halaman dashboard, ringkasan statistik & filter
│   ├── db/                # Tabel database laporan, cetak PDF & ekspor Excel
│   ├── edit/              # Form edit / update data donor
│   ├── login/             # Halaman login petugas
│   ├── signin/            # Halaman pendaftaran/registrasi akun petugas
│   ├── screening/         # Form input kegagalan tahap screening medis
│   ├── globals.css        # Desain global, styling, animasi, dan tema
│   ├── layout.tsx         # Root layout & pembungkus NotificationProvider
│   └── page.tsx           # Landing page utama & informasi UTD PMI
├── components/
│   └── NotificationProvider.tsx # Provider toast & notifikasi sistem
├── public/                # File statis dan aset gambar
├── .gitignore             # Daftar file & folder yang diabaikan Git
├── next.config.js         # Konfigurasi Next.js
├── package.json           # Dependensi dan skrip proyek
├── tsconfig.json          # Konfigurasi TypeScript
└── README.md              # Dokumentasi proyek
```

---

## 💻 Panduan Instalasi & Menjalankan Proyek

Pastikan Anda telah menginstal **Node.js** (versi 18.x atau lebih baru) dan **npm** di komputer Anda.

### 1. Clone Repository
```bash
git clone https://github.com/Rev52/Sistem-gagal-tusuk.git
cd Sistem-gagal-tusuk
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```

Buka browser dan akses [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

### 4. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 📍 Kontak & Lokasi

**Unit Transfusi Darah (UTD) PMI Kota Pasuruan**
- 📍 **Alamat**: Jl. Untung Suropati No. 23, Kota Pasuruan 67117, Jawa Timur
- 📞 **Telepon**: 0343-416615 / 082244824037
