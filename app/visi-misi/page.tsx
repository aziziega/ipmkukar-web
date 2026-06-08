import Navbar from "@/components/Navbar"
import VisiMisiSection from "@/components/sections/visi-misi-section"
import Footer from "@/components/footer"

export const metadata = {
  title: "Visi & Misi | IPM Kukar Yogyakarta",
  description: "Visi dan Misi Ikatan Pelajar Mahasiswa Kutai Kartanegara Yogyakarta",
}

export default function VisiMisiPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <VisiMisiSection />
      <Footer />
    </main>
  )
}
