"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Check, Database } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function DataKukarPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    asal: "",
    tanggal_lahir: "",
    universitas: "",
    fakultas: "",
    jurusan: "",
    strata: "",
    tahun_masuk_kuliah: "",
    whatsapp: "",
  })

  const benefits = [
    "Data terstruktur untuk keperluan Pemerintah Kabupaten Kukar",
    "Memudahkan koordinasi program pemberdayaan mahasiswa",
    "Database terpusat mahasiswa Kukar di Yogyakarta",
    "Informasi beasiswa dan bantuan dari Pemkab Kukar",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Form Belum Aktif",
      description: "Maaf, form pendataan saat ini belum dapat diproses. Silakan hubungi developer atau admin untuk informasi lebih lanjut. Terima kasih!",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-surface via-white to-surface">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 flex-grow">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-emerald hover:text-emerald-dark transition-colors mb-8 hover:gap-3 duration-300">
          <ArrowLeft size={20} />
          <span className="font-semibold text-sm sm:text-base">Kembali ke Beranda</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left: Info & Purpose */}
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text-primary leading-tight">
                  Pendataan Mahasiswa Kukar
                </h1>
                <p className="text-emerald font-bold text-lg mt-2">di Yogyakarta</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-lg text-text-secondary leading-relaxed">
                Pendataan ini untuk keperluan <span className="font-bold text-emerald">Pemerintah Kabupaten Kutai Kartanegara</span> dalam rangka pendataan mahasiswa Kukar yang kuliah di Yogyakarta.
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                Data Anda akan digunakan untuk koordinasi program pemberdayaan, beasiswa, dan bantuan lainnya dari Pemkab Kukar.
              </p>
            </div>

            {/* Purpose */}
            <div className="bg-white p-6 rounded-xl border-2 border-emerald/20 shadow-lg">
              <h3 className="text-xl font-bold text-text-primary mb-4">Tujuan Pendataan:</h3>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-text-secondary leading-relaxed flex-1">
                      {benefit}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Kerahasiaan Data Terjamin
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Data yang Anda berikan akan dijaga kerahasiaannya dan hanya digunakan untuk keperluan koordinasi dengan Pemerintah Kabupaten Kutai Kartanegara.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 bg-white shadow-2xl border-2 border-border-custom">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Form Pendataan</h2>
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
                  <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                    Email (Opsional)
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
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
                  <label htmlFor="tanggal_lahir" className="block text-sm font-semibold text-text-primary mb-2">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="tanggal_lahir"
                    name="tanggal_lahir"
                    type="date"
                    value={formData.tanggal_lahir}
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
                  <label htmlFor="fakultas" className="block text-sm font-semibold text-text-primary mb-2">
                    Fakultas <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="fakultas"
                    name="fakultas"
                    type="text"
                    placeholder="Contoh: Teknik, MIPA, Ekonomi, dll"
                    value={formData.fakultas}
                    onChange={handleChange}
                    required
                    className="text-base py-6 border-2 focus:border-emerald"
                  />
                </div>

                <div>
                  <label htmlFor="jurusan" className="block text-sm font-semibold text-text-primary mb-2">
                    Jurusan/Program Studi <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="jurusan"
                    name="jurusan"
                    type="text"
                    placeholder="Contoh: Teknik Informatika, Akuntansi, dll"
                    value={formData.jurusan}
                    onChange={handleChange}
                    required
                    className="text-base py-6 border-2 focus:border-emerald"
                  />
                </div>

                <div>
                  <label htmlFor="strata" className="block text-sm font-semibold text-text-primary mb-2">
                    Strata/Jenjang Pendidikan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="strata"
                    name="strata"
                    value={formData.strata}
                    onChange={(e) => setFormData({ ...formData, strata: e.target.value })}
                    required
                    className="w-full text-base py-3 px-4 border-2 border-border-custom rounded-md focus:border-emerald focus:outline-none"
                  >
                    <option value="">Pilih Strata</option>
                    <option value="D1">D1</option>
                    <option value="D2">D2</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tahun_masuk_kuliah" className="block text-sm font-semibold text-text-primary mb-2">
                    Tahun Masuk Kuliah <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="tahun_masuk_kuliah"
                    name="tahun_masuk_kuliah"
                    value={formData.tahun_masuk_kuliah}
                    onChange={(e) => setFormData({ ...formData, tahun_masuk_kuliah: e.target.value })}
                    required
                    className="w-full text-base py-3 px-4 border-2 border-border-custom rounded-md focus:border-emerald focus:outline-none"
                  >
                    <option value="">Pilih Tahun</option>
                    {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
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
                  Submit Data →
                </Button>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    <span className="font-semibold text-blue-700">📝 Catatan:</span> Data yang Anda berikan akan digunakan untuk keperluan koordinasi dengan Pemerintah Kabupaten Kutai Kartanegara. Kerahasiaan data Anda terjamin.
                  </p>
                </div>
              </form>
            </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
