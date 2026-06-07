"use client"

import Navbar from "@/components/Navbar"
import HeroSection from "@/components/sections/hero-section"
import TentangSection from "@/components/sections/tentang-section"
import VisiMisiSection from "@/components/sections/visi-misi-section"
import StrukturSection from "@/components/sections/struktur-section"
import ProgramSection from "@/components/sections/program-section"
import StatistikSection from "@/components/sections/statistik-section"
import KegiatanSection from "@/components/sections/kegiatan-section"
import BergabungFooterSection from "@/components/sections/bergabung-footer-section"
import "@/app/globals.css"

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Tentang Kami Section */}
      <TentangSection />

      {/* Program Kerja Section */}
      <ProgramSection />

      {/* Kegiatan & Galeri Section */}
      <KegiatanSection />


      {/* Visi & Misi Section */}
      <VisiMisiSection />

      {/* Struktur Organisasi Section */}
      <StrukturSection />


      {/* Bergabung + Footer Combined Section */}
      <BergabungFooterSection />
    </div>
  )
}
