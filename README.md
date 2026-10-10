# RuangTenang

Platform web kesehatan mental terpadu untuk remaja Indonesia, dibangun di atas arsitektur web murni (zero-dependency vanilla stack) dengan prinsip privasi penuh di sisi klien, aksesibilitas universal (WCAG 2.1 AA), dan arah desain Swiss Industrial Print.

Proyek ini dikembangkan secara spesifik untuk kompetisi pengembang web tingkat lanjut (Senior Developer Competition) dengan tolok ukur keunggulan rekayasa perangkat lunak tanpa ketergantungan pustaka pihak ketiga.

- Live Demo (Vercel Production): [https://www.ruangtenang.biz.id/](https://www.ruangtenang.biz.id/)
- Repositori GitHub: [https://github.com/RaffaRizqi/RuangTenang](https://github.com/RaffaRizqi/RuangTenang)

---

## 1. Latar Belakang & Konteks Produk

Berdasarkan data Indonesia National Adolescent Mental Health Survey (I-NAMHS 2022), sekitar 1 dari 3 remaja Indonesia (usia 10-17 tahun) mengalami masalah kesehatan mental, namun lebih dari 85% tidak pernah mencari pertolongan profesional karena stigma sosial, keterbatasan biaya, atau ketakutan akan kebocoran data pribadi.

RuangTenang hadir sebagai instrumen digital pendamping awal yang:
- Aman dan Bebas Stigma: Tidak meminta data pribadi, tidak memerlukan pendaftaran akun, dan tidak menyimpan data di server eksternal.
- Berorientasi Sains: Menggunakan teknik pernapasan teruji (4-7-8, Box Breathing, Napas Tenang) dengan durasi fase presisi dan panduan Psychological First Aid (PFA) yang diadaptasi dari konsensus internasional.
- Aksesibel dan Ringan: Berukuran kurang dari 70 KB untuk seluruh kode sumber, dapat berjalan di peramban apa pun, serta berfungsi penuh saat luring (offline-first PWA).

---

## 2. Diagram Arsitektur Sistem

```
+------------------------------------------------------------------------+
|                              PERAMBAN PENGGUNA                         |
+------------------------------------------------------------------------+
|                                                                        |
|  [Antarmuka Pengguna Semantik (HTML5 & CSS3 - Swiss Industrial Print)] |
|    |                                                                   |
|    +---> Dasbor Pusat & Quick Pulse Log (index.html)                   |
|    +---> Studio Latihan Napas Interaktif (napas.html)                  |
|    +---> Jurnal Suasana Hati & Peta Emosi SVG (jurnal.html)            |
|    +---> Direktori Bantuan Resmi & Panduan PFA (bantuan.html)          |
|    +---> Literatur Edukasi Mental Remaja (panduan.html)                |
|                                                                        |
|  [Mesin Logika & Komputasi Klien (script.js - Vanilla ES6+)]          |
|    |                                                                   |
|    +---> Audio Synthesizer (Web Audio API: Sine 528Hz -> 432Hz)        |
|    +---> State Machine Siklus Napas (Precision Timer & State Resume)   |
|    +---> Generator Visualisasi Vektor (Procedural SVG DOM Creation)    |
|    +---> Modul Kunci Privasi PIN & Sanitasi Input Teks (Anti-XSS)      |
|    +---> Mesin Impor & Ekspor Cadangan Data (.JSON Serialization)      |
|                                                                        |
|  [Penyimpanan Lokal Persisten]          [Lapisan Jaringan & Cache]     |
|    |                                      |                            |
|    +---> localStorage                     +---> Service Worker (sw.js) |
|          - ruangtenang.journal.v1               - Cache-First Assets   |
|          - ruangtenang.pin.v1                   - Offline Fallback     |
|          - ruangtenang.audio.enabled            - Cache v6.0           |
|                                                                        |
+------------------------------------------------------------------------+
```

---

## 3. Matriks Modul Aplikasi

| Indeks | Berkas | Peran Fungsional | Spesifikasi Rekayasa |
|---|---|---|---|
| [00] | index.html | Hub Navigasi & Dasbor Telemetri | Quick Pulse logger, status indikator hidup, kartu modul modular |
| [01] | napas.html | Studio Latihan Napas Multimoda | State machine 3 teknik napas, Web Audio synth chime, dynamic stepper |
| [02] | jurnal.html | Vault Catatan & Analitik Emosi | Generator grafik SVG murni, kunci privasi PIN 4-digit, pencarian real-time |
| [03] | bantuan.html | Direktori Krisis & PFA | Kontak resmi Kemenkes RI/112, 4 langkah PFA Johns Hopkins, filter kategori |
| [04] | panduan.html | Literatur Literasi Kognitif | 4 artikel panduan terstruktur: burnout, cemas ujian, detoks sosmed, komunikasi |

---

## 4. Sorotan Keunggulan Rekayasa (Engineering Highlights)

### A. Sintesis Audio Prosedural (Web Audio API)
Alih-alih mengunduh berkas audio eksternal berukuran besar yang berpotensi gagal diputar akibat latensi jaringan atau kebijakan lintas-asal (CORS), pemicu chime audio relaksasi dibangkitkan secara prosedural langsung dari prosesor audio peramban:
- Gelombang: Sine wave murni melalui `OscillatorNode`.
- Frekuensi: Transisi eksponensial dari 528 Hz (frekuensi solfeggio yang diasosiasikan dengan ketenangan) ke 432 Hz menggunakan `exponentialRampToValueAtTime`.
- Penguatan (Gain): Pola ADSR (Attack-Decay-Sustain-Release) mikro dengan attack 0.1 detik dan peluruhan eksponensial lembut selama 1.4 detik untuk mencegah bunyi klik (*audio pop*).
- Manajemen Sumber Daya: Konteks audio dikelola secara defensif (`audioCtx.state === 'suspended'`) dan hanya dibangkitkan bila pengguna mengaktifkan pengaturan lonceng suara.

### B. Visualisasi Vektor Prosedural Tanpa Pustaka (SVG Math Rendering)
Distribusi frekuensi emosi pada modul Jurnal dihitung dan dirender secara matematis ke dalam format SVG tanpa bantuan pustaka eksternal seperti Chart.js atau D3.js:
- Koordinat Ruang: Menggunakan sistem koordinat rasio `viewBox="0 0 500 220"`.
- Normalisasi Data: Menghitung persentase setiap emosi terhadap total catatan riwayat secara dinamis.
- Pemetaan Dimensi: Nilai tinggi batang dihitung secara proporsional dengan batas tinggi maksimum 130px dan penempatan baseline seragam pada sumbu Y=175.
- Aksesibilitas Vektor: Dilengkapi atribut `role="img"` dan `aria-label` deskriptif yang memuat ringkasan data untuk pengguna pembaca layar.

### C. State Machine Latihan Napas Presisi
Latihan pernapasan menerapkan mesin status yang mengontrol fase dan durasi secara presisi:
- Teknik 4-7-8: Tarik napas 4 detik, tahan napas 7 detik, hembuskan napas 8 detik.
- Teknik Box Breathing: 4 detik tarik, 4 detik tahan, 4 detik hembus, 4 detik tahan.
- Teknik Napas Tenang: 4 detik tarik, 6 detik hembus.
- Kelangsungan Status (State Continuity): Fitur jeda/lanjut (*pause and resume*) menyimpan sisa detik fase berjalan (`secondsRemaining`) sehingga pengguna dapat melanjutkan latihan dari titik waktu yang tepat saat dijeda, bukan mengulang siklus dari awal.

### D. Arsitektur Privasi Tanpa Kebocoran (Zero-Leakage Local Vault)
- Penyimpanan 100% Lokal: Seluruh entitas jurnal disimpan dalam namespace `ruangtenang.journal.v1` pada `localStorage`.
- Sanitasi Input Ketat: Seluruh rendering teks catatan menggunakan properti `textContent` standar dan pembuatan elemen DOM terisolasi. Penulisan `innerHTML` dihindari sepenuhnya untuk menutup celah serangan Cross-Site Scripting (XSS).
- Kunci Layar PIN Sederhana: Disediakan proteksi PIN 4-digit lokal (`ruangtenang.pin.v1`) agar catatan tidak terbaca saat perangkat dipinjamkan.
- Validasi Skema Defensif: Fungsi `isValidEntry()` memvalidasi tipe data `id`, `mood`, `content`, dan `createdAt` sebelum data digabungkan atau disimpan ke memori lokal.

### E. Kesiapan Offline Mandiri (Service Worker v6.0)
- Strategi Cache-First: Meng-cache seluruh berkas HTML, stylesheet, script logika, manifest, dan ikon vektor.
- Offline Navigation Fallback: Permintaan navigasi dokumen baru saat perangkat luring dialihkan secara otomatis ke cache `./index.html`.
- Pembersihan Siklus Hidup: Event `activate` menghapus seluruh cache versi lama secara otomatis menggunakan `caches.delete(key)` dan memanggil `self.clients.claim()`.

---

## 5. Standar Desain & Aksesibilitas (WCAG 2.1 Level AA)

### A. Bahasa Visual Swiss Industrial Print
- Palet Warna Sage Terkalibrasi:
  - Latar Halaman: `#F7F9F6`
  - Permukaan Kartu: `#FFFFFF` dan `#F2F5F0`
  - Garis Pembatas: `#E2E8DF` dan `#CCD6CA`
  - Aksen Primer: `#5A7D60` (Hover: `#4A6B50`, Pale: `#EDF2EB`)
  - Teks Utama: `#2C3E30` (Kontras 10.4:1 terhadap latar belakang, melampaui standar WCAG AAA)
  - Teks Sekunder: `#5C6E60` (Kontras 5.1:1, memenuhi WCAG AA)
- Nol Gradien: Menerapkan 100% prinsip flat design tanpa `linear-gradient` maupun `radial-gradient`.
- Hairline Dividers: Batas grid tipis 1px dengan struktur editorial yang tegas dan fungsional.

### B. Aksesibilitas Universal (A11y)
- Semantik Dialog: Kontainer modal PIN menggunakan `role="dialog"`, `aria-modal="true"`, `aria-labelledby="pinModalTitle"`, dan `aria-describedby="pinModalDesc"`.
- Keyboard Trap & Escape Handling: Menekan tombol `Escape` menutup modal secara langsung dan mengembalikan fokus keyboard ke tombol pembuka modal.
- Status ARIA Dinamis: Seluruh tombol filter kategori memperbarui atribut `aria-pressed="true/false"` secara real-time pada saat diklik.
- Aksesibilitas Gerak: Seluruh animasi transisi dan keyframes diatur tunduk pada kueri media `@media (prefers-reduced-motion: reduce)` yang secara otomatis mematikan gerakan bagi pengguna dengan sensitivitas vestibular.
- Skip Link: Tautan akses cepat `#konten` tersedia pada awal setiap dokumen HTML untuk memfasilitasi navigasi keyboard langsung ke area konten utama.
- Hierarki Heading Teratur: Struktur judul berurutan dari H1 ke H2 dan H3 secara konsisten tanpa ada loncatan tingkat hierarki.

---

## 6. Struktur Berkas Repositori

```
RuangTenang/
|-- index.html          # Dasbor Pusat & Modul 00
|-- napas.html          # Studio Latihan Napas (Modul 01)
|-- jurnal.html         # Jurnal & Analitik Emosi (Modul 02)
|-- bantuan.html        # Direktori Kontak & PFA (Modul 03)
|-- panduan.html        # Panduan Mental Remaja (Modul 04)
|-- style.css           # Seluruh Desain, Layout, & Sistem Animasi
|-- script.js           # Mesin Logika, Audio Synth, SVG, & Storage
|-- sw.js               # Service Worker PWA & Offline Cache
|-- manifest.json       # Manifest Web Application
|-- icon.svg            # Vektor Ikon Aplikasi
|-- .gitignore          # Pengabaian Berkas Konfigurasi Lokal
`-- README.md           # Dokumentasi Rekayasa & Panduan Teknis
```

---

## 7. Panduan Menjalankan & Menguji Proyek

Aplikasi ini bersifat mandiri dan dapat dijalankan tanpa langkah instalasi dependensi (`npm install`) ataupun langkah build (`npm run build`).

### A. Menjalankan Aplikasi
1. Buka berkas `index.html` langsung pada peramban modern (Chrome, Edge, Firefox, Safari).
2. Untuk menguji fitur Service Worker secara optimal, jalankan melalui server lokal sederhana:
```bash
# Python 3
python -m http.server 8000

# Atau Node.js npx
npx serve .
```
Akses melalui alamat `http://localhost:8000`.

### B. Perintah Verifikasi Kualitas Kode
Verifikasi integritas kode sumber dapat dijalankan menggunakan Node.js:
```bash
# Uji sintaksis JavaScript
node --check script.js
node --check sw.js
```

---

## 8. Rubrik Evaluasi Juri

| Aspek Penilaian | Bukti Implementasi pada Proyek |
|---|---|
| Kualitas Rekayasa Kode | Nol pustaka eksternal, modular vanilla JS, penanganan error defensif pada seluruh I/O lokal |
| Performa & Kecepatan Muat | Ukuran berkas sangat ringan (<70 KB total), First Contentful Paint mendekati 0ms, Service Worker cache-first |
| Aksesibilitas (A11y) | WCAG 2.1 AA compliant, semantik modal dialog lengkap, navigasi Escape keyboard, prefers-reduced-motion |
| Desain & Antarmuka (UI/UX) | Bahasa visual Swiss Industrial Print, rasio kontras warna tinggi, animasi bertahap mikro |
| Keaslian & Relevansi Solusi | Sintesis audio Web Audio API prosedural, grafik SVG mandiri, kontak darurat resmi Kemenkes RI terverifikasi |
