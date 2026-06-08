import Navbar from "@/components/Navbar"
import StrukturSection from "@/components/sections/struktur-section"
import BergabungFooterSection from "@/components/sections/bergabung-footer-section"

export const metadata = {
  title: "Struktur Kepengurusan | IPM Kukar Yogyakarta",
  description: "Struktur Kepengurusan Ikatan Pelajar Mahasiswa Kutai Kartanegara Yogyakarta",
}

export default function StrukturPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <StrukturSection />
      <BergabungFooterSection />
    </main>
  )
}
