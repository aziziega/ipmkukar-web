import Navbar from "@/components/Navbar"
import StrukturSection from "@/components/sections/struktur-section"
import Footer from "@/components/footer"

export const metadata = {
  title: "Struktur Kepengurusan | IPM Kukar Yogyakarta",
  description: "Struktur Kepengurusan Ikatan Pelajar Mahasiswa Kutai Kartanegara Yogyakarta",
}

export default function StrukturPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <StrukturSection />
      <Footer />
    </main>
  )
}
