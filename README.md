# RuangTenang

Aplikasi web kesehatan mental terpadu untuk remaja Indonesia. Dibangun dengan pendekatan rekayasa web murni (zero-dependency vanilla stack), mengutamakan privasi penuh di sisi klien, aksesibilitas inklusif, dan arah desain Swiss Industrial Print.

Proyek ini dikembangkan untuk kompetisi pengembang web tingkat lanjut dengan standar kualitas produksi tinggi tanpa ketergantungan build-tool.

---

## 1. Ikhtisar Solusi

RuangTenang dirancang untuk menjawab kesenjangan akses dukungan kesehatan mental di kalangan remaja usia 13-19 tahun di Indonesia. Aplikasi ini menyediakan sarana regulasi emosi mandiri, pelacakan suasana hati harian, direktori kontak bantuan resmi, dan literasi psikologis yang bebas dari istilah rumit serta bebas stigma.

### Karakteristik Kunci Rekayasa:
- Arsitektur Nol Ketergantungan: 100% berkas HTML5, CSS3, dan Vanilla JavaScript standar tanpa pustaka eksternal, bundler, atau kompilator.
- Privasi Klien Mutlak: Seluruh catatan jurnal dan log suasana hati tersimpan secara lokal di peramban pengguna (localStorage). Nol transmisi data ke server luar.
- Sintesis Audio Prosedural: Pemicu audio relaksasi napas dibangkitkan secara langsung melalui Web Audio API tanpa file audio eksternal.
- Visualisasi Vektor Prosedural: Grafik analitik emosi digambar melalui manipulasi DOM SVG murni menggunakan kalkulasi rasio geometris real-time.
- Kesiapan Progressive Web App (PWA): Didukung Service Worker cache-first dengan strategi offline navigation fallback.
- Optimasi Mesin Pencari (SEO): Dilengkapi 5 skema JSON-LD terstruktur, Open Graph, Twitter Cards, dan rel canonical tags.

---

## 2. Struktur Modul Aplikasi

Aplikasi terbagi menjadi lima modul fungsional:

| Kode | Berkas | Peruntukan Fungsional |
|---|---|---|
| [00] | index.html | Dasbor pusat, navigasi modul, pengantar sistem, dan Quick Pulse log suasana hati instan |
| [01] | napas.html | Studio pernapasan terpandu dengan 3 teknik ilmiah (4-7-8, Box Breathing 4-4-4-4, Napas Tenang 4-6) |
| [02] | jurnal.html | Composer catatan, kunci privasi PIN lokal, analitik distribusi emosi SVG, pencarian, dan ekspor/impor data |
| [03] | bantuan.html | Direktori kontak krisis resmi (Healing119, 112, Halo Kemenkes) dan panduan Psychological First Aid (PFA) |
| [04] | panduan.html | Literatur edukasi praktis penanganan burnout belajar, cemas ujian, detoks media sosial, dan komunikasi keluarga |

---

## 3. Detail Implementasi Teknis

### A. Arah Desain Visual (Swiss Industrial Print)
Desain visual mengikuti prinsip desain datar murni (flat design) dengan palet sage yang tenang:
- Latar Belakang: #F7F9F6
- Permukaan Kartu: #FFFFFF dan #F2F5F0
- Garis dan Pembatas: #E2E8DF dan #CCD6CA
- Aksen Utama: #5A7D60 (Hover: #4A6B50, Pale: #EDF2EB)
- Tipografi Teks: #2C3E30 (Utama) dan #5C6E60 (Sekunder)
- Tipografi: Kombinasi Plus Jakarta Sans (konten editorial) dan IBM Plex Mono (telemetri, metadata, indikator teknis)
- Larangan Gradien: Nol penggunaan CSS linear-gradient atau radial-gradient di seluruh stylesheet.

### B. Animasi & Interaksi Mikro
- Header Hairline Draw: Animasi pembentangan garis horizontal presisi pada navbar saat pemuatan halaman (durasi 0.6s cubic-bezier(0.16, 1, 0.3, 1)).
- Telemetry Pulse: Denyut halus berkelanjutan pada indikator status navbar (.status-dot) untuk menegaskan status operasional sistem.
- Staggered Entry Reveal: Kemunculan elemen halaman bertahap melalui keyframes pageReveal dengan jeda waktu terkalibrasi per kartu.
- Micro-Interactions: Elevasi halus (-3px) saat kursor melayang di atas kartu modul, dan umpan balik taktil (1px) saat tombol ditekan.
- Standar Aksesibilitas: Seluruh animasi dinonaktifkan secara otomatis pada lingkungan sistem operasi yang mengaktifkan prefers-reduced-motion: reduce.

### C. Mesin Sintesis Audio (Web Audio API)
Alih-alih memuat berkas audio eksternal berukuran besar yang rentan gagal dimuat saat jaringan lambat, audio relaksasi dibangkitkan secara prosedural:
- Osilator: Gelombang sinus murni (sine wave)
- Frekuensi: Transisi eksponensial dari 528 Hz (frekuensi solfeggio relaksasi) ke 432 Hz
- Gain Envelope: Attack halus 0.1 detik dan peluruhan eksponensial selama 1.4 detik
- Penanganan Kebijakan Autoplay: AudioContext dikelola secara defensif dan hanya diaktifkan atas preferensi pengguna.

### D. Visualisasi Analitik SVG Mandiri
Grafik sebaran emosi pada jurnal dibangun tanpa Chart.js:
- Perhitungan proporsi jumlah entitas per mood secara dinamis
- Penentuan koordinat visual (x, y, width, height) berbasis rasio viewBox 500x220
- Pembuatan elemen rect dan text menggunakan document.createElementNS('http://www.w3.org/2000/svg', ...)
- Penerapan aksesibilitas gambar melalui role="img" dan aria-label yang memuat konteks data

### E. Aksesibilitas & Standar W3C (WCAG 2.1 AA)
- Struktur semantik lengkap: header, nav, main, section, article, footer, form, fieldset, legend.
- Aksesibilitas dialog modal: Atribut role="dialog", aria-modal="true", aria-labelledby, dan aria-describedby pada modal PIN.
- Navigasi keyboard: Dukungan penuh tombol Escape untuk menutup modal dan pengembalian fokus ke elemen pemicu.
- Sinkronisasi status ARIA: Atribut aria-pressed="true/false" diperbarui secara real-time pada seluruh tombol filter (jurnal dan bantuan).
- Skip Link: Tautan lompat langsung ke konten utama (#konten) untuk pengguna pembaca layar.
- Hierarki heading teratur: Urutan H1 -> H2 -> H3 tanpa loncatan level heading di seluruh dokumen.

### F. Kesiapan Offline (PWA & Service Worker)
- Berkas sw.js mengelola caching aset inti (HTML, CSS, JS, manifest, SVG icon) dengan skema cache-first.
- Offline Navigation Fallback: Permintaan navigasi baru saat perangkat luring secara otomatis dialihkan ke cache index.html, mencegah munculnya halaman galat bawaan peramban.

### G. Optimasi Mesin Pencari (SEO & Metadata)
- Structured Data: Skema JSON-LD spesifik pada setiap halaman (WebApplication, HowTo, SoftwareApplication, FAQPage).
- Meta Tag Lengkap: Title teroptimasi (47-61 karakter), meta description terarah (127-135 karakter), Open Graph, Twitter Cards, dan rel canonical.

---

## 4. Struktur Berkas Repositori

```
RuangTenang/
|-- index.html          # Dasbor Pusat & Modul 00
|-- napas.html          # Studio Latihan Napas (Modul 01)
|-- jurnal.html         # Jurnal & Analitik Emosi (Modul 02)
|-- bantuan.html        # Direktori Kontak & PFA (Modul 03)
|-- panduan.html        # Panduan Mental Remaja (Modul 04)
|-- style.css           # Seluruh Token Desain, Tata Letak, & Animasi
|-- script.js           # Mesin Logika Aplikasi, Audio, SVG, & Storage
|-- sw.js               # Service Worker PWA & Offline Cache
|-- manifest.json       # Manifest Web Application
|-- icon.svg            # Aset Vektor Ikon Aplikasi
|-- .gitignore          # Konfigurasi Pengabaian Berkas
`-- README.md           # Dokumentasi Rekayasa & Panduan Teknis
```

---

## 5. Cara Menjalankan Aplikasi

Aplikasi ini tidak memerlukan instalasi Node.js, npm, webpack, ataupun dependensi runtime lainnya.

### Opsi A: Membuka Langsung di Peramban
Klik dua kali berkas `index.html` atau seret berkas tersebut ke peramban modern apa pun (Chrome, Edge, Firefox, Safari).

### Opsi B: Menggunakan Local HTTP Server (Direkomendasikan untuk PWA)
Untuk menguji fungsionalitas Service Worker secara optimal:
```bash
# Menggunakan Python 3
python -m http.server 8000

# Atau menggunakan npx serve
npx serve .
```
Buka peramban pada alamat `http://localhost:8000`.

---

## 6. Verifikasi & Pengujian Kualitas Kode

Kualitas dan integritas kode dapat diverifikasi secara otomatis menggunakan runner Node.js:

```bash
# Validasi sintaksis JavaScript
node --check script.js
node --check sw.js
```

### Hasil Audit Internal:
- Validasi Sintaksis JS: Lulus tanpa galat (Exit code 0).
- Larangan Gradien: 0 gradien ditemukan (100% flat design).
- Larangan Komentar: 0 komentar pada seluruh berkas produksi (style.css, script.js, dan 5 berkas HTML).
- Kesesuaian Kelas CSS: 151 dari 151 kelas HTML terdefinisi secara presisi di style.css.
- Validasi Skema JSON-LD: 5 dari 5 skema tervalidasi sebagai JSON terstruktur yang benar.
- Kepatuhan Hierarki Heading: Lulus tanpa loncatan level heading di seluruh halaman.
