"use client"

import Navbar from "@/components/Navbar"
import HeroSection from "@/components/sections/hero-section"
import TentangSection from "@/components/sections/tentang-section"
import ProgramSection from "@/components/sections/program-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import KegiatanSection from "@/components/sections/kegiatan-section"
// import StrukturSection from "@/components/sections/struktur-section"
import BergabungFooterSection from "@/components/sections/bergabung-footer-section"
import "@/app/globals.css"

export default function Home() {
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

            {/* Struktur Organisasi Section */}
            {/* <StrukturSection /> */}

            <TestimonialsSection />


            {/* Bergabung + Footer Combined Section */}
            <BergabungFooterSection />
        </div>
    )
}
