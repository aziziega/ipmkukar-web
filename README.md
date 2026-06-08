# IPM Kukar Yogyakarta - Official Website

Website resmi Ikatan Pelajar Mahasiswa Kutai Kartanegara di Yogyakarta.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://ipmkukar-web.vercel.app)

## 📖 Tentang Project

Website ini merupakan platform digital untuk Ikatan Pelajar Mahasiswa (IPM) Kukar Yogyakarta, organisasi yang menghimpun mahasiswa asal Kutai Kartanegara yang kuliah di Yogyakarta sejak 2002.

### Fitur Utama

- 🏠 **Hero Section** - Carousel slider dengan background gambar yang stunning
- 📋 **Tentang IPM** - Informasi lengkap tentang organisasi
- 🎯 **Visi & Misi** - Dengan animasi fade-in yang smooth
- 👥 **Struktur Organisasi** - Daftar pengurus dan departemen
- 💼 **Program Kerja** - Program-program kerja IPM
- 📸 **Kegiatan** - Dokumentasi kegiatan dan event
- 📊 **Statistik** - Counter animation untuk menampilkan pencapaian
- 📝 **Form Pendaftaran** - Integrasi dengan WhatsApp untuk pendaftaran anggota baru
- 🌐 **Footer** - Informasi kontak dan social media links

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React, React Icons
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ atau yang lebih baru
- pnpm (recommended) atau npm

### Installation

1. Clone repository

```bash
git clone https://github.com/aziziega/ipmkukar-web.git
cd ipmkukar-web
```

2. Install dependencies

```bash
pnpm install
```

3. Run development server

```bash
pnpm dev
```

4. Open browser dan akses [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
ipmkukar-web/
├── app/                      # Next.js App Router
│   ├── bergabung/           # Halaman pendaftaran
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/
│   ├── sections/            # Section components
│   │   ├── hero-section.tsx
│   │   ├── tentang-section.tsx
│   │   ├── visi-misi-section.tsx
│   │   ├── struktur-section.tsx
│   │   ├── program-section.tsx
│   │   ├── kegiatan-section.tsx
│   │   └── bergabung-footer-section.tsx
│   ├── ui/                  # UI components (shadcn)
│   └── Navbar.tsx           # Navigation component
├── public/
│   └── logo/                # Logo dan assets
└── package.json
```

## 🎨 Design Features

- **Responsive Design** - Mobile-first approach, compatible dengan semua device
- **Smooth Animations** - Framer Motion untuk transisi dan scroll animations
- **Modern UI** - Glassmorphism, gradient backgrounds, dan micro-interactions
- **Premium Aesthetics** - Color palette yang curated (emerald, gold, dark)
- **Kutai Kartanegara Theme** - Ornament dan visual identity yang sesuai

## 🎨 Color Palette

```css
--emerald: #10b981        /* Primary brand color */
--emerald-dark: #059669   /* Hover states */
--emerald-deeper: #047857 /* Dark backgrounds */
--gold: #fbbf24          /* Accent color */
--gold-light: #fcd34d    /* Light accent */
```

## 🔧 Configuration

### WhatsApp Integration

Update WhatsApp number di file berikut:
- `app/bergabung/page.tsx` (line 33)
- `components/sections/bergabung-footer-section.tsx` (line 89)

```typescript
const whatsappNumber = "6281234567890" // Ganti dengan nomor WhatsApp IPM
```

### Social Media Links

Update social media links di:
- `components/sections/bergabung-footer-section.tsx` (lines 234-245)

## 📦 Dependencies

### Core
- `next`: ^14.2.29
- `react`: ^18.3.1
- `typescript`: ^5

### UI & Styling
- `tailwindcss`: ^3.4.1
- `framer-motion`: ^11.15.0
- `lucide-react`: ^0.468.0
- `react-icons`: ^5.4.0

### Components
- `@radix-ui/*`: Various UI primitives
- `class-variance-authority`: Component variants
- `clsx` & `tailwind-merge`: Utility class management

## 🚀 Deployment

Project ini di-deploy menggunakan [Vercel](https://vercel.com/).

Setiap push ke branch `main` akan otomatis trigger deployment baru.

## 👨‍💻 Developer

**Azizi Ega**
- Portfolio: [aziziem.vercel.app](https://aziziem.vercel.app)
- GitHub: [@aziziega](https://github.com/aziziega)

## 📄 License

© 2026 IPM Kukar Yogyakarta. All rights reserved.

---

**Dari Kukar, untuk Kukar - Bergerak Bersama di Jogja** 🌟