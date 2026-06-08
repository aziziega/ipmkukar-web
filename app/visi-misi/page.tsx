import Navbar from "@/components/Navbar"
import VisiMisiSection from "@/components/sections/visi-misi-section"
import BergabungFooterSection from "@/components/sections/bergabung-footer-section"

export const metadata = {
  title: "Visi & Misi | IPM Kukar Yogyakarta",
  description: "Visi dan Misi Ikatan Pelajar Mahasiswa Kutai Kartanegara Yogyakarta",
}

export default function VisiMisiPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <VisiMisiSection />
      <BergabungFooterSection />
    </main>
  )
}
