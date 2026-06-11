"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Check, ArrowRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function BergabungPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    nama: "",
    asal: "",
    universitas: "",
    whatsapp: "",
    email: "",
    tahun_masuk: "",
    pengalaman_organisasi: "",
    motivasi: "",
    departemen_1: "",
    departemen_2: "",
    ktp_sim: null as File | null,
    pesan_saran: "",
    jenjang_pendidikan: "",
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

    toast({
      title: "Pendaftaran Online Belum Tersedia",
      description: "Halo! Saat ini pendaftaran langsung melalui website belum dapat diproses karena sistem kami sedang dalam pemeliharaan. Silakan hubungi pengurus kami secara langsung atau gunakan informasi kontak di bagian bawah halaman ya. Terima kasih banyak atas pengertiannya! 😊",
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text-primary leading-tight">
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

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-3xl font-black text-emerald">30+</div>
                <div className="text-xs text-text-secondary font-semibold">Anggota Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-emerald">10+</div>
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

                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
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

                <div>
                  <label htmlFor="tahun_masuk" className="block text-sm font-semibold text-text-primary mb-2">
                    Tahun Masuk Universitas <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="tahun_masuk"
                    name="tahun_masuk"
                    value={formData.tahun_masuk}
                    onChange={(e) => setFormData({ ...formData, tahun_masuk: e.target.value })}
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
                  <label htmlFor="pengalaman_organisasi" className="block text-sm font-semibold text-text-primary mb-2">
                    Memiliki Pengalaman dalam Organisasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="pengalaman_organisasi"
                    name="pengalaman_organisasi"
                    value={formData.pengalaman_organisasi}
                    onChange={(e) => setFormData({ ...formData, pengalaman_organisasi: e.target.value })}
                    required
                    className="w-full text-base py-3 px-4 border-2 border-border-custom rounded-md focus:border-emerald focus:outline-none"
                  >
                    <option value="">Pilih</option>
                    <option value="Iya">Iya</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </div>

                  </motion.div>
                )}

                {/* Next Button */}
                {currentStep === 1 && (
                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      size="lg"
                      className="bg-emerald hover:bg-emerald-dark text-white font-bold px-8 py-6 text-lg"
                    >
                      Berikutnya <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Additional Information */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                <div>
                  <label htmlFor="motivasi" className="block text-sm font-semibold text-text-primary mb-2">
                    Motivasi Bergabung IPM <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="motivasi"
                    name="motivasi"
                    placeholder="Ceritakan motivasi kamu bergabung dengan IPM Kukar..."
                    value={formData.motivasi}
                    onChange={(e) => setFormData({ ...formData, motivasi: e.target.value })}
                    required
                    rows={4}
                    maxLength={500}
                    className="w-full text-base py-3 px-4 border-2 border-border-custom rounded-md focus:border-emerald focus:outline-none resize-none"
                  />
                  <p className="text-xs text-text-secondary mt-1">{formData.motivasi.length}/500 karakter</p>
                </div>

                <div>
                  <label htmlFor="departemen_1" className="block text-sm font-semibold text-text-primary mb-2">
                    Pilihan Departemen 1 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="departemen_1"
                    name="departemen_1"
                    value={formData.departemen_1}
                    onChange={(e) => setFormData({ ...formData, departemen_1: e.target.value })}
                    required
                    className="w-full text-base py-3 px-4 border-2 border-border-custom rounded-md focus:border-emerald focus:outline-none"
                  >
                    <option value="">Pilih Departemen</option>
                    <option value="Seni dan Budaya">Seni dan Budaya</option>
                    <option value="Sosial dan Keagamaan">Sosial dan Keagamaan</option>
                    <option value="Informasi dan Komunikasi">Informasi dan Komunikasi</option>
                    <option value="Pengembangan Organisasi">Pengembangan Organisasi</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Kajian Strategi dan Pendidikan">Kajian Strategi dan Pendidikan</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="departemen_2" className="block text-sm font-semibold text-text-primary mb-2">
                    Pilihan Departemen 2 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="departemen_2"
                    name="departemen_2"
                    value={formData.departemen_2}
                    onChange={(e) => setFormData({ ...formData, departemen_2: e.target.value })}
                    required
                    className="w-full text-base py-3 px-4 border-2 border-border-custom rounded-md focus:border-emerald focus:outline-none"
                  >
                    <option value="">Pilih Departemen</option>
                    <option value="Seni dan Budaya" disabled={formData.departemen_1 === "Seni dan Budaya"}>Seni dan Budaya</option>
                    <option value="Sosial dan Keagamaan" disabled={formData.departemen_1 === "Sosial dan Keagamaan"}>Sosial dan Keagamaan</option>
                    <option value="Informasi dan Komunikasi" disabled={formData.departemen_1 === "Informasi dan Komunikasi"}>Informasi dan Komunikasi</option>
                    <option value="Pengembangan Organisasi" disabled={formData.departemen_1 === "Pengembangan Organisasi"}>Pengembangan Organisasi</option>
                    <option value="Olahraga" disabled={formData.departemen_1 === "Olahraga"}>Olahraga</option>
                    <option value="Kajian Strategi dan Pendidikan" disabled={formData.departemen_1 === "Kajian Strategi dan Pendidikan"}>Kajian Strategi dan Pendidikan</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="ktp_sim" className="block text-sm font-semibold text-text-primary mb-2">
                    Upload KTP/SIM <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="ktp_sim"
                    name="ktp_sim"
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => setFormData({ ...formData, ktp_sim: e.target.files?.[0] || null })}
                    required
                    className="w-full text-base py-2 px-4 border-2 border-border-custom rounded-md focus:border-emerald focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald-dark"
                  />
                  <p className="text-xs text-text-secondary mt-1">Format: JPG, PNG, atau PDF (Maks. 5MB)</p>
                </div>

                <div>
                  <label htmlFor="jenjang_pendidikan" className="block text-sm font-semibold text-text-primary mb-2">
                    Jenjang Pendidikan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="jenjang_pendidikan"
                    name="jenjang_pendidikan"
                    value={formData.jenjang_pendidikan}
                    onChange={(e) => setFormData({ ...formData, jenjang_pendidikan: e.target.value })}
                    required
                    className="w-full text-base py-3 px-4 border-2 border-border-custom rounded-md focus:border-emerald focus:outline-none"
                  >
                    <option value="">Pilih Jenjang</option>
                    <option value="D1">D1</option>
                    <option value="D2">D2</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="pesan_saran" className="block text-sm font-semibold text-text-primary mb-2">
                    Pesan dan Saran (Opsional)
                  </label>
                  <textarea
                    id="pesan_saran"
                    name="pesan_saran"
                    placeholder="Ada pesan atau saran untuk kegiatan IPM?"
                    value={formData.pesan_saran}
                    onChange={(e) => setFormData({ ...formData, pesan_saran: e.target.value })}
                    rows={3}
                    maxLength={300}
                    className="w-full text-base py-3 px-4 border-2 border-border-custom rounded-md focus:border-emerald focus:outline-none resize-none"
                  />
                  <p className="text-xs text-text-secondary mt-1">{formData.pesan_saran.length}/300 karakter</p>
                </div>

                  </motion.div>
                )}

                {/* Navigation Buttons */}
                {currentStep === 2 && (
                  <div className="flex gap-4 mt-6">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      size="lg"
                      variant="outline"
                      className="bg-white text-emerald border-2 border-emerald hover:bg-emerald hover:text-white font-semibold px-8 py-6 text-lg transition-all"
                    >
                      <ArrowLeft className="mr-2 w-5 h-5" /> Kembali
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 bg-emerald hover:bg-emerald-dark text-white font-bold text-lg py-7 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Daftar Sekarang →
                    </Button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="mt-4 p-4 bg-gold-light/30 rounded-lg border border-gold/30">
                    <p className="text-xs text-text-secondary leading-relaxed">
                      <span className="font-semibold text-gold">📝 Catatan:</span> Form ini juga digunakan untuk pendataan mahasiswa Kutai Kartanegara di Jogja untuk keperluan Pemerintah Kabupaten Kutai Kartanegara. Tim kami akan menghubungi kamu melalui WhatsApp untuk proses screening dan interview.
                    </p>
                  </div>
                )}
              </form>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
