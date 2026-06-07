"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"
import { useState } from "react"

export default function BergabungSection() {
  const [formData, setFormData] = useState({
    nama: "",
    asal: "",
    universitas: "",
    whatsapp: "",
  })

  const benefits = [
    "Jaringan luas sesama mahasiswa Kukar se-Yogyakarta",
    "Akses program beasiswa, pelatihan, dan pengembangan diri",
    "Ruang berorganisasi dan berkontribusi untuk Kutai Kartanegara",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Format WhatsApp message
    const message = `Halo! Saya ingin mendaftar sebagai anggota IPM Kukar Yogyakarta\n\nNama: ${formData.nama}\nAsal: ${formData.asal}\nUniversitas: ${formData.universitas}\nNo. WhatsApp: ${formData.whatsapp}`
    
    // Dummy WhatsApp number - replace with real number later
    const whatsappNumber = "6281234567890"
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, "_blank")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="gabung" className="relative py-20 bg-gradient-to-br from-emerald-dark to-emerald-deeper">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Content & Benefits */}
          <div className="text-white space-y-8">
            <div>
              <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">
                Bergabung
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6">
                Bergabunglah Bersama Kami
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Kamu mahasiswa asal Kutai Kartanegara yang kuliah di Yogyakarta? Ayo bergabung dan jadilah bagian dari keluarga besar IPM Kukar Yogyakarta.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-emerald-deeper" />
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed flex-1">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="p-4 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
              <p className="text-sm text-white/80">
                <span className="font-semibold text-gold">Catatan:</span> Formulir ini juga digunakan untuk pendataan mahasiswa Kutai Kartanegara yang berkuliah di Jogja untuk keperluan pendataan Pemerintah Kabupaten Kutai Kartanegara.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <Card className="p-8 bg-white rounded-2xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nama" className="block text-sm font-semibold text-text-primary mb-2">
                  Nama Lengkap
                </label>
                <Input
                  id="nama"
                  name="nama"
                  type="text"
                  placeholder="Masukkan nama lengkap kamu"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="border-border-custom focus:border-emerald"
                />
              </div>

              <div>
                <label htmlFor="asal" className="block text-sm font-semibold text-text-primary mb-2">
                  Asal Kecamatan/Kota di Kukar
                </label>
                <Input
                  id="asal"
                  name="asal"
                  type="text"
                  placeholder="Contoh: Tenggarong, Loa Janan, dll"
                  value={formData.asal}
                  onChange={handleChange}
                  required
                  className="border-border-custom focus:border-emerald"
                />
              </div>

              <div>
                <label htmlFor="universitas" className="block text-sm font-semibold text-text-primary mb-2">
                  Universitas
                </label>
                <Input
                  id="universitas"
                  name="universitas"
                  type="text"
                  placeholder="Contoh: UGM, UNY, UII, dll"
                  value={formData.universitas}
                  onChange={handleChange}
                  required
                  className="border-border-custom focus:border-emerald"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-semibold text-text-primary mb-2">
                  No. WhatsApp
                </label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  className="border-border-custom focus:border-emerald"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gold hover:bg-gold/90 text-emerald-deeper font-bold text-lg py-6 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Daftar Sekarang →
              </Button>

              <p className="text-xs text-text-secondary text-center">
                Dengan mendaftar, kamu akan dihubungi oleh tim kami melalui WhatsApp untuk proses screening dan interview.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}
