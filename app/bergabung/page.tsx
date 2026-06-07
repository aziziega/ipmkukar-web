"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/Navbar"
import { ArrowLeft, Check } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function BergabungPage() {
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
    "Kegiatan budaya, sosial, dan pengembangan kapasitas reguler",
    "Dukungan adaptasi kehidupan di perantauan",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const message = `Halo! Saya ingin mendaftar sebagai anggota IPM Kukar Yogyakarta\n\nNama: ${formData.nama}\nAsal: ${formData.asal}\nUniversitas: ${formData.universitas}\nNo. WhatsApp: ${formData.whatsapp}`
    
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
    <div className="min-h-screen bg-gradient-to-b from-surface via-white to-surface">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24 md:py-32">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-emerald hover:text-emerald-dark transition-colors mb-8">
          <ArrowLeft size={20} />
          <span className="font-semibold">Kembali ke Beranda</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left: Info & Benefits */}
          <div className="space-y-8">
            {/* Logo & Header */}
            <div className="flex items-center gap-4 mb-6">
              <Image 
                src="/logo/logo-IPM.webp" 
                alt="IPM Kukar Logo" 
                width={80} 
                height={80}
                className="object-contain"
              />
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-text-primary leading-tight">
                  Bergabung Bersama Kami
                </h1>
                <p className="text-emerald font-bold text-lg mt-2">IPM Kukar Yogyakarta</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-lg text-text-secondary leading-relaxed">
                Kamu mahasiswa asal <span className="font-bold text-emerald">Kutai Kartanegara</span> yang kuliah di Yogyakarta?
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                Ayo bergabung dan jadilah bagian dari <span className="font-bold">keluarga besar IPM Kukar Yogyakarta</span> yang telah dipercaya oleh <span className="font-bold text-emerald">1000+ alumni sejak 2002</span>.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white p-6 rounded-xl border-2 border-emerald/20 shadow-lg">
              <h3 className="text-xl font-bold text-text-primary mb-4">Yang Kamu Dapatkan:</h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-text-secondary leading-relaxed flex-1">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-3xl font-black text-emerald">150+</div>
                <div className="text-xs text-text-secondary font-semibold">Anggota Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-emerald">30+</div>
                <div className="text-xs text-text-secondary font-semibold">Kegiatan/Tahun</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-emerald">1000+</div>
                <div className="text-xs text-text-secondary font-semibold">Alumni</div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:sticky lg:top-24">
            <Card className="p-8 bg-white shadow-2xl border-2 border-border-custom">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Form Pendaftaran</h2>
              <p className="text-sm text-text-secondary mb-6">
                Isi data diri kamu dengan lengkap dan benar
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="nama" className="block text-sm font-semibold text-text-primary mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="nama"
                    name="nama"
                    type="text"
                    placeholder="Contoh: Ahmad Rizki Pratama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    className="text-base py-6 border-2 focus:border-emerald"
                  />
                </div>

                <div>
                  <label htmlFor="asal" className="block text-sm font-semibold text-text-primary mb-2">
                    Asal Kecamatan/Kota di Kukar <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="asal"
                    name="asal"
                    type="text"
                    placeholder="Contoh: Tenggarong, Loa Janan, dll"
                    value={formData.asal}
                    onChange={handleChange}
                    required
                    className="text-base py-6 border-2 focus:border-emerald"
                  />
                </div>

                <div>
                  <label htmlFor="universitas" className="block text-sm font-semibold text-text-primary mb-2">
                    Universitas <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="universitas"
                    name="universitas"
                    type="text"
                    placeholder="Contoh: UGM, UNY, UII, dll"
                    value={formData.universitas}
                    onChange={handleChange}
                    required
                    className="text-base py-6 border-2 focus:border-emerald"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-semibold text-text-primary mb-2">
                    No. WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    className="text-base py-6 border-2 focus:border-emerald"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-emerald hover:bg-emerald-dark text-white font-bold text-lg py-7 transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
                >
                  Daftar Sekarang →
                </Button>

                <div className="mt-4 p-4 bg-gold-light/30 rounded-lg border border-gold/30">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    <span className="font-semibold text-gold">📝 Catatan:</span> Form ini juga digunakan untuk pendataan mahasiswa Kutai Kartanegara di Jogja untuk keperluan Pemerintah Kabupaten Kutai Kartanegara. Tim kami akan menghubungi kamu melalui WhatsApp untuk proses screening dan interview.
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
