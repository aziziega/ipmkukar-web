# Prompt untuk v0.dev — IPM Kukar Yogyakarta Website

---

## PROMPT UTAMA (paste ini ke v0.dev)

```
Redesign this Next.js website from a run club template into a professional company profile / landing page for **IPM Kukar Yogyakarta** (Ikatan Pelajar Mahasiswa Kutai Kartanegara — organisasi daerah yang menghimpun mahasiswa asal Kabupaten Kutai Kartanegara yang berkuliah di Yogyakarta).

Keep the existing tech stack: Next.js, Tailwind CSS, shadcn/ui components.

---

## Color Palette (WAJIB diikuti di seluruh halaman)
- Primary / Emerald:     #1a9e6e  — hijau emerald utama, untuk tombol, highlight, navbar aktif
- Primary Dark:          #0f7a52  — hover state, section dark background
- Primary Deeper:        #0a5c3d  — footer background, hero overlay
- Accent / Gold:         #f0b429  — CTA sekunder, badge, angka statistik, garis dekoratif
- Accent Light:          #fde68a  — highlight teks, latar badge muted
- Background:            #ffffff  — halaman utama
- Surface:               #f4faf7  — section alt background (sedikit kehijauan)
- Text Primary:          #0f1f18  — judul dan teks utama
- Text Secondary:        #4a5e56  — deskripsi dan subtext
- Border:                #d1e8df  — garis pembatas halaman

Gunakan HANYA warna-warna di atas. Jangan gunakan biru, merah, atau warna lain yang tidak ada dalam palette ini.

---

## Design Direction
- Dominasi hijau emerald yang segar dan modern
- Gold/kuning sebagai aksen yang menonjol (tombol, angka, garis)
- Putih dan surface hijau muda sebagai background bersih
- Typography: clean, modern, tapi tetap hangat — nuansa organisasi pemuda daerah
- Style: professional, youthful — mirip landing page komunitas modern dengan sentuhan budaya Kalimantan
- Smooth scroll one-page layout dengan sticky navbar

---

## Sections (berurutan dari atas ke bawah):

### 1. NAVBAR
- Logo placeholder: lingkaran emerald berisi teks "IPM" berwarna gold, diikuti teks "IPM Kukar Jogja"
- Menu: Tentang | Struktur | Program Kerja | Kegiatan | Kontak
- Tombol CTA: "Gabung Sekarang" — background gold (#f0b429), teks gelap
- Sticky, background transparan di atas → beralih ke putih + shadow saat di-scroll
- Mobile: hamburger menu, drawer dari kanan

### 2. HERO SECTION
- Background: gradient dari emerald deep (#0a5c3d) ke hitam (#0a0f0d)
- Overlay: pattern geometris/ornamen Kalimantan sangat halus, opacity 6%, warna putih
- Badge animasi: "Ikatan Pelajar Mahasiswa · Kutai Kartanegara · Yogyakarta"  (background gold transparan, teks gold)
- Headline besar (teks putih): "Satu Tanah, Satu Semangat, Satu Gerak"
  — kata "Kukar" diberi warna gold (#f0b429)
- Subheadline (teks putih 70% opacity): "Wadah berhimpun mahasiswa Kutai Kartanegara di Yogyakarta — berkembang bersama dan memberi dampak nyata untuk daerah."
- Dua tombol:
  - "Kenali Kami" → background emerald (#1a9e6e), teks putih
  - "Lihat Kegiatan" → outline putih, teks putih

### 3. TENTANG KAMI
- Background: putih (#ffffff)
- Split layout: teks di kiri, 3 kartu nilai di kanan
- Label kecil di atas judul: "TENTANG KAMI" (warna emerald, huruf kapital, spasi lebar)
- Judul: "Rumah Kedua untuk Mahasiswa Kukar"
- Paragraf: IPM Kukar Yogyakarta adalah organisasi daerah yang menghimpun mahasiswa asal Kabupaten Kutai Kartanegara yang sedang menempuh pendidikan di Yogyakarta. Kami hadir sebagai rumah kedua — tempat bertemu, berkembang bersama, dan mempersiapkan diri untuk kembali berkontribusi bagi Kutai Kartanegara.
- 3 kartu nilai (background surface #f4faf7, border #d1e8df, border-left 3px emerald):
  1. 🤝 Kekeluargaan — Membangun rasa persaudaraan sesama perantau dari Kukar
  2. 🎓 Pengembangan Diri — Mendorong prestasi akademik dan non-akademik
  3. 🌟 Kontribusi Nyata — Memberi dampak positif bagi Kukar dan Yogyakarta

### 4. VISI & MISI
- Background: emerald deep (#0f7a52), teks putih
- Visi ditampilkan besar di tengah dengan garis dekoratif gold di atas dan bawah teks:
  "Terwujudnya mahasiswa Kutai Kartanegara yang berprestasi, berkarakter, dan siap berkontribusi bagi pembangunan daerah."
- 4 kartu misi (background putih 10% transparan, border putih 20%):
  1. Menghimpun dan mempererat silaturahmi mahasiswa asal Kutai Kartanegara di Yogyakarta
  2. Mengembangkan potensi akademik, kepemimpinan, dan kewirausahaan anggota
  3. Menjadi jembatan antara mahasiswa Kukar dengan pemerintah daerah dan stakeholder
  4. Mendorong anggota untuk aktif berkontribusi bagi pembangunan Kutai Kartanegara

### 5. STRUKTUR ORGANISASI
- Background: surface (#f4faf7)
- Judul: "Kepengurusan IPM Kukar Yogyakarta"
- Hierarki dari atas ke bawah, dihubungkan garis tipis emerald:

**Baris 1 — Dewan Pengawas dan Konsultasi:**
- 2 kartu kecil horizontal, badge "Dewan Pengawas" warna gold
- Nama: "Anggota 1 Placeholder" | "Anggota 2 Placeholder"

**Baris 2 — Ketua Umum:**
- 1 kartu besar centered, foto avatar bulat placeholder (border emerald 3px)
- Label: "Ketua Umum", nama: "[Nama Placeholder]"

**Baris 3 — Pengurus Harian (3 kartu sejajar):**
- Wakil Ketua | Sekretaris | Bendahara
- Avatar placeholder kecil, jabatan, nama placeholder

**Baris 4 — Departemen (grid 2x2):**
Setiap kartu punya: ikon, nama departemen, deskripsi 1 kalimat, "Ketua: [Placeholder]"
  1. **Seni dan Budaya** — badge ungu muted — ikon palet — "Mengembangkan kreativitas dan melestarikan budaya Kutai"
  2. **Sosial dan Keagamaan** — badge hijau muted — ikon hati — "Mendorong kepedulian sosial dan pembinaan spiritual anggota"
  3. **Informasi dan Komunikasi** — badge biru muted — ikon megaphone — "Mengelola media sosial, publikasi, dan dokumentasi"
  4. **Pengembangan Organisasi** — badge gold muted — ikon rocket — "Merancang kaderisasi dan pengembangan kapasitas anggota"

### 6. PROGRAM KERJA
- Background: putih
- Judul: "Program Unggulan"
- Grid 3 kolom, 6 kartu (hover: border emerald, shadow hijau muted):
  1. **Pagelaran Seni Kukar** — badge "Seni & Budaya" — Pentas seni dan pameran budaya Kutai Kartanegara di Yogyakarta
  2. **Festival Budaya Kukar** — badge "Seni & Budaya" — Showcase kuliner, tari, dan musik khas Kukar
  3. **Bakti Sosial** — badge "Sosial" — Kegiatan sosial dan pengabdian masyarakat di Yogyakarta dan Kukar
  4. **Kajian & Silaturahmi** — badge "Sosial" — Forum diskusi dan pertemuan rutin bulanan seluruh anggota
  5. **Konten & Publikasi** — badge "Infokom" — Pengelolaan konten kreatif dan dokumentasi kegiatan
  6. **Pelatihan & Kaderisasi** — badge "Pengembangan" — Orientasi anggota baru dan pelatihan kepemimpinan

### 7. STATISTIK
- Background: gold muted (#fde68a) dengan teks gelap (#0f1f18)
- 4 kolom angka besar dengan counter animation saat scroll:
  - **150+** — Anggota Aktif
  - **4** — Departemen Aktif
  - **30+** — Kegiatan Per Tahun
  - **10+** — Universitas Terwakili
- Angka berwarna emerald (#1a9e6e), label teks gelap

### 8. KEGIATAN & GALERI
- Background: surface (#f4faf7)
- Judul: "Jejak Kegiatan Kami"
- Grid 3 kolom, 6 item galeri
- Setiap item: placeholder image (placeholder.co, aspek 4:3), overlay gradient emerald ke transparan dari bawah, label nama kegiatan di bawah overlay
  Labels: "Pagelaran Seni Kukar" | "Bakti Sosial Jogja" | "Pelatihan Kepemimpinan" | "Festival Budaya Kukar" | "Penerimaan Anggota Baru" | "Malam Keakraban"
- Tombol centered: "Lihat Semua Kegiatan" — outline emerald

### 9. BERGABUNG
- Background: gradient emerald (#0f7a52) ke emerald deep (#0a5c3d)
- Split layout: teks + benefit kiri, form kanan
- Judul (teks putih): "Bergabunglah Bersama Kami"
- Deskripsi (teks putih 80%): Kamu mahasiswa asal Kutai Kartanegara yang kuliah di Yogyakarta? Ayo bergabung dan jadilah bagian dari keluarga besar IPM Kukar Yogyakarta.
- 3 benefit (ikon centang gold):
  ✓ Jaringan luas sesama mahasiswa Kukar se-Yogyakarta
  ✓ Akses program beasiswa, pelatihan, dan pengembangan diri
  ✓ Ruang berorganisasi dan berkontribusi untuk Kutai Kartanegara
- Form card (background putih, rounded-xl, shadow):
  - Input: Nama Lengkap | Asal Kecamatan/Kota di Kukar | Universitas | No. WhatsApp
  - Tombol submit: background gold (#f0b429), teks gelap, full width — "Daftar Sekarang →"

### 10. KONTAK & FOOTER
- Section kontak (background putih): email placeholder, WhatsApp placeholder, kota Yogyakarta
- 4 ikon sosial: Instagram | TikTok | YouTube | WhatsApp — warna emerald
- Footer (background #0a5c3d, teks putih):
  - Logo + tagline: "Dari Kukar, untuk Kukar"
  - Navigasi cepat
  - Garis dekoratif tipis gold di bagian paling atas footer
  - Copyright: "© 2025 IPM Kukar Yogyakarta"

---

## Technical Requirements
- Smooth scroll dengan id anchor: #tentang #struktur #proker #kegiatan #gabung #kontak
- Responsive mobile-first
- shadcn/ui: Card, Button, Badge, Input
- Fade-in on scroll via Intersection Observer
- Semua konten mudah diganti (placeholder teks dan gambar)
- TypeScript
```

---

## PROMPT FOLLOW-UP

### Update warna saja (jika palette belum terpakai benar):
```
Update the entire color theme to strictly follow this palette:
- Primary emerald: #1a9e6e
- Primary dark: #0f7a52
- Primary deep: #0a5c3d
- Accent gold: #f0b429
- Accent light: #fde68a
- Background: #ffffff
- Surface: #f4faf7
- Text primary: #0f1f18
- Text secondary: #4a5e56
- Border: #d1e8df
Remove ALL blue, red, purple, or gray colors that are not in this palette.
Apply emerald to: navbar, buttons, section accents, borders, icons.
Apply gold to: CTA buttons, badges, stat numbers, decorative lines.
```

### Perbaiki Hero saja:
```
Redesign the hero section:
- Full viewport height
- Background gradient: #0a5c3d → #0a0f0d (dark emerald to near black)
- Subtle geometric Kalimantan/Dayak ornament overlay, white, 6% opacity
- Animated pill badge in gold: "Ikatan Pelajar Mahasiswa · Kutai Kartanegara · Yogyakarta"
- Large white headline: "Satu Tanah, Satu Semangat, Satu Gerak" — the word "Kukar" in gold #f0b429
- White subtext at 70% opacity
- Two buttons: filled emerald "Kenali Kami" + white outline "Lihat Kegiatan"
- Subtle scroll-down arrow at bottom center in gold
```

### Perbaiki Struktur Organisasi saja:
```
Redesign only the organizational structure section with this exact hierarchy:
Row 1: "Dewan Pengawas dan Konsultasi" — 2 small horizontal cards, gold badge
Row 2: Ketua Umum — 1 large centered card, circular avatar with emerald border
Row 3: 3 cards side by side — Wakil Ketua | Sekretaris | Bendahara
Row 4: 2x2 grid of department cards:
  (1) Seni dan Budaya — palette icon
  (2) Sosial dan Keagamaan — heart icon
  (3) Informasi dan Komunikasi — megaphone icon
  (4) Pengembangan Organisasi — rocket icon
Connect hierarchy levels with thin vertical lines in emerald color.
All cards: white background, emerald border on hover, rounded-xl.
```
