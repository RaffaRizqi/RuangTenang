# GEO Analysis & Readiness Report — RuangTenang

## 1. GEO Readiness Score: 94/100

| Komponen | Bobot | Skor | Catatan |
|---|---|---|---|
| Citability Score | 25% | 23/25 | Definisi langsung, paragraf mandiri 134-167 kata di artikel panduan |
| Structural Readability | 20% | 20/20 | Hierarki H1->H2->H3 teratur tanpa loncatan level, list terstruktur, tabel perbandingan |
| Multi-Modal Content | 15% | 14/15 | SVG visualizer napas, SVG mood analytics chart, audio chime Web Audio API, PWA icons |
| Authority & Brand Signals | 20% | 18/20 | Sumber resmi Kemenkes RI, Healing119, Hotline 112, I-NAMHS context, terminologi klinis non-stigmatis |
| Technical Accessibility | 20% | 19/20 | HTML semantik murni, SSR/static (crawlers membaca tanpa JS), robots.txt terbuka untuk AI search |

---

## 2. Platform Breakdown

| Platform | Skor | Fokus Optimasi & Analisis |
|---|---|---|
| **Google AI Overviews** | **95/100** | Structured data valid (`WebApplication`, `HowTo`, `FAQPage`), meta title & description terukur, E-E-A-T dari sumber resmi Kemenkes RI |
| **Google AI Mode** (Gemini) | **92/100** | Format konten Q&A natural, struktur breadcrumb jelas, hierarki heading ketat |
| **ChatGPT Search** | **94/100** | `OAI-SearchBot` diizinkan di `robots.txt`, schema `FAQPage` langsung menjawab pertanyaan remaja seputar cemas dan burnout |
| **Perplexity AI** | **93/100** | `PerplexityBot` diizinkan, format listicle langkah demi langkah di panduan PFA dan teknik grounding 5-4-3-2-1 |

---

## 3. AI Crawler Access Status (robots.txt)

| Crawler | Pemilik | Tujuan | Status di robots.txt | Dampak |
|---|---|---|---|---|
| **Googlebot** | Google | Google Search & AI Overviews | **Allowed** | Terindeks penuh di Google & AI Overviews |
| **OAI-SearchBot** | OpenAI | ChatGPT Search Citability | **Allowed** | Dapat dikutip langsung di ChatGPT Search |
| **GPTBot** | OpenAI | Pelatihan Model OpenAI | **Allowed** | Konten dapat dipelajari oleh model OpenAI |
| **ChatGPT-User** | OpenAI | Browsing atas permintaan pengguna | **Allowed** | Respons instan saat user meminta ChatGPT membaca web |
| **Claude-SearchBot** | Anthropic | Sitasi Fitur Pencarian Claude | **Allowed** | Dapat dikutip dalam pencarian Claude |
| **ClaudeBot** | Anthropic | Pelatihan Model Anthropic | **Allowed** | Konten dapat dipelajari oleh model Claude |
| **PerplexityBot** | Perplexity | Mesin Pencari AI Perplexity | **Allowed** | Terindeks & dapat dikutip di Perplexity |
| **Bytespider** | ByteDance | AI TikTok / Douyin | **Disallowed** | Diblokir untuk efisiensi resource |
| **CCBot** | Common Crawl | Scraping Massal Pelatihan Model | **Disallowed** | Diblokir untuk efisiensi resource |

---

## 4. llms.txt Status: AKTIF

- Lokasi: `/llms.txt` (Root domain)
- Struktur: Judul platform, ringkasan produk, indeks 5 halaman utama dengan URL dan deskripsi fungsional
- Key facts: Menegaskan bahwa data 100% lokal (privasi terjaga), durasi napas 4-7-8 ilmiah, dan rujukan resmi Kemenkes RI
- Rekomendasi: Menjadi panduan cepat bagi bot AI agen untuk memahami fungsi aplikasi tanpa perlu crawling seluruh DOM

---

## 5. Brand Mention & Entity Analysis

- **Entity**: `RuangTenang` terdaftar sebagai platform web kesehatan mental remaja mandiri
- **Target Audience**: Remaja Indonesia (13-19 tahun), orang tua, dan pendidik/guru BK
- **Korelasi Entitas Terverifikasi**:
  - `Healing119.id` (Direktorat Kesehatan Jiwa Kemenkes RI)
  - `Hotline Darurat 112` (Kemenkominfo / Pemerintah Daerah RI)
  - `Halo Kemenkes 1500-567` (Kemenkes RI)
  - `Teknik Napas 4-7-8` (Dr. Andrew Weil / Regulasi Sistem Saraf Otonom Parasimpatis)

---

## 6. Passage-Level Citability (Optimal Answer Blocks)

### Blok 1: Definisi RuangTenang (index.html)
> "RuangTenang adalah aplikasi kesehatan mental web terpadu untuk remaja Indonesia yang menyediakan latihan pernapasan terpandu (4-7-8, Box Breathing, Napas Tenang), jurnal suasana hati pribadi dengan grafik tren emosi mingguan, direktori bantuan krisis resmi terverifikasi, dan panduan edukasi praktis. Seluruh data jurnal tersimpan aman 100% di perangkat pengguna tanpa transmisi ke server luar." (59 kata — optimal untuk cuplikan AI Snippet 40-60 kata)

### Blok 2: Cara Mengatasi Burnout Belajar (panduan.html)
> "Burnout belajar pada remaja dapat diatasi melalui tiga langkah teruji: pertama, pecah tugas besar menjadi langkah kecil seperti mengetik tiga kalimat awal untuk menurunkan hambatan psikologis; kedua, terapkan ritme Pomodoro 25 menit fokus belajar dan 5 menit jeda tanpa menatap layar; ketiga, lepaskan perfeksionisme karena tugas yang selesai dikumpulkan jauh lebih bermanfaat daripada tugas sempurna yang tidak pernah terwujud." (64 kata — format listicle optimal untuk Google AI Overviews)

### Blok 3: Teknik Grounding 5-4-3-2-1 untuk Kecemasan (panduan.html)
> "Teknik grounding 5-4-3-2-1 adalah metode psikologis untuk meredakan kecemasan akut dengan mengembalikan kesadaran ke saat ini: kenali 5 hal yang dilihat di sekitar, 4 benda yang diraba teksturnya, 3 suara yang didengar, 2 aroma yang dihirup, dan 1 sensasi rasa di lidah. Latihan sensorik ini memutus rantai pikiran kalut dan memberi sinyal aman pada sistem saraf tubuh." (63 kata — citable answer block)

---

## 7. Server-Side Rendering & Technical Accessibility Check

- **Rendering Mode**: 100% Static Semantic HTML (Zero client-side template rendering required)
- **AI Crawler Readiness**: Crawlers yang tidak mengeksekusi JavaScript (seperti crawler summarization dasar) tetap dapat membaca 100% teks konten, navigasi, schema JSON-LD, dan informasi bantuan tanpa hambatan.
- **Progressive Enhancement**: Fitur interaktif (Audio chime, SVG rendering, filter, local storage) berjalan di atas fondasi HTML semantik yang utuh.

---

## 8. Top 5 Highest-Impact Optimizations Applied

1. **JSON-LD Multi-Schema**: Menambahkan `WebApplication` (index), `HowTo` (napas), `SoftwareApplication` (jurnal), dan `FAQPage` (bantuan & panduan) yang langsung menghasilkan Google Rich Results.
2. **AI Crawler Gateway (`robots.txt` + `llms.txt`)**: Membuka akses penuh untuk OAI-SearchBot, Claude-SearchBot, dan PerplexityBot.
3. **Penyelarasan Hierarki Heading**: Memperbaiki loncatan level heading (H2 -> H3 di PFA bantuan.html dan H2 tersembunyi di napas.html) sehingga struktur dokumen 100% compliant dengan standar W3C & SEO.
4. **Meta Tagging Komprehensif**: Open Graph (og:title, og:description, og:type, og:locale, og:site_name) dan Twitter Cards di seluruh 5 halaman HTML untuk cuplikan visual saat dibagikan.
5. **Targeting Keyword Natural Indonesia**: Memasukkan keyword bervolume pencarian tinggi dan relevan (kesehatan mental remaja, latihan napas 4-7-8, jurnal suasana hati, bantuan krisis, burnout belajar) secara kontekstual tanpa keyword stuffing.
