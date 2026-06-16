"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Heart, Megaphone, Rocket, User, Trophy, BookOpen, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface OrganizationalStructure {
  period: string
  dewan_pengawas_1: string | null
  dewan_pengawas_2: string | null
  ketua_umum: string
  wakil_ketua: string
  sekretaris: string
  bendahara: string
  kepala_seni_budaya: string
  kepala_sosial_keagamaan: string
  kepala_infokom: string
  kepala_pengembangan_org: string
  kepala_olahraga: string
  kepala_kajian_pendidikan: string
  dewan_pengawas_1_photo: string | null
  dewan_pengawas_2_photo: string | null
  ketua_umum_photo: string | null
  wakil_ketua_photo: string | null
  sekretaris_photo: string | null
  bendahara_photo: string | null
  kepala_seni_budaya_photo: string | null
  kepala_sosial_keagamaan_photo: string | null
  kepala_infokom_photo: string | null
  kepala_pengembangan_org_photo: string | null
  kepala_olahraga_photo: string | null
  kepala_kajian_pendidikan_photo: string | null
}

export default function StrukturSection() {
  const [structure, setStructure] = useState<OrganizationalStructure | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const response = await fetch('/api/struktur')
        const data = await response.json()
        if (data.success && data.structure) {
          setStructure(data.structure)
        }
      } catch (error) {
        console.error('Failed to fetch organizational structure:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStructure()
  }, [])

  if (isLoading) {
    return (
      <section id="struktur" className="relative pt-32 pb-20 bg-surface">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-emerald" />
          </div>
        </div>
      </section>
    )
  }

  if (!structure) {
    return (
      <section id="struktur" className="relative pt-32 pb-20 bg-surface">
        <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-emerald text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
              Struktur Organisasi
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-text-primary mt-4">
              Kepengurusan IPM Kukar Yogyakarta
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald/10 flex items-center justify-center">
              <User className="w-10 h-10 text-emerald" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Struktur Organisasi Sedang Diperbarui
            </h3>
            <p className="text-lg text-text-secondary">
              Informasi kepengurusan akan segera ditampilkan. Silakan kembali lagi nanti.
            </p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section id="struktur" className="relative pt-32 pb-20 bg-surface">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
            Struktur Organisasi
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary mt-4">
            Kepengurusan IPM Kukar Yogyakarta {structure.period}
          </h2>
        </motion.div>

        {/* Organizational Chart */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Row 1: Dewan Pengawas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
              {structure.dewan_pengawas_1 && (
                <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card className="p-4 bg-white border border-border-custom hover:shadow-md transition-all">
                    <Badge className="bg-gold/20 text-gold border-gold/30 mb-2">
                      Dewan Pengawas
                    </Badge>
                    <div className="flex items-center gap-3">
                      {structure.dewan_pengawas_1_photo ? (
                        <Image
                          src={structure.dewan_pengawas_1_photo}
                          alt={structure.dewan_pengawas_1}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald" />
                        </div>
                      )}
                      <p className="font-semibold text-text-primary">{structure.dewan_pengawas_1}</p>
                    </div>
                  </Card>
                </motion.div>
              )}
              {structure.dewan_pengawas_2 && (
                <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Card className="p-4 bg-white border border-border-custom hover:shadow-md transition-all">
                    <Badge className="bg-gold/20 text-gold border-gold/30 mb-2">
                      Dewan Pengawas
                    </Badge>
                    <div className="flex items-center gap-3">
                      {structure.dewan_pengawas_2_photo ? (
                        <Image
                          src={structure.dewan_pengawas_2_photo}
                          alt={structure.dewan_pengawas_2}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald" />
                        </div>
                      )}
                      <p className="font-semibold text-text-primary">{structure.dewan_pengawas_2}</p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Connecting Line */}
          <div className="flex justify-center">
            <div className="w-0.5 h-8 bg-emerald/30"></div>
          </div>

          {/* Row 2: Ketua Umum */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Card className="p-6 bg-white border-2 border-emerald hover:shadow-lg transition-all max-w-md">
                <div className="text-center">
                  {structure.ketua_umum_photo ? (
                    <Image
                      src={structure.ketua_umum_photo}
                      alt={structure.ketua_umum}
                      width={96}
                      height={96}
                      className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-emerald object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-emerald bg-emerald/10 flex items-center justify-center">
                      <User className="w-12 h-12 text-emerald" />
                    </div>
                  )}
                  <Badge className="bg-emerald/20 text-emerald border-emerald/30 mb-2">
                    Ketua Umum
                  </Badge>
                  <h3 className="text-xl font-bold text-text-primary">
                    {structure.ketua_umum}
                  </h3>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Connecting Line */}
          <div className="flex justify-center">
            <div className="w-0.5 h-8 bg-emerald/30"></div>
          </div>

          {/* Row 3: Pengurus Harian */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
              {[
                { position: "Wakil Ketua", name: structure.wakil_ketua, photo: structure.wakil_ketua_photo },
                { position: "Sekretaris", name: structure.sekretaris, photo: structure.sekretaris_photo },
                { position: "Bendahara", name: structure.bendahara, photo: structure.bendahara_photo }
              ].map((item, idx) => (
                <motion.div
                  key={item.position}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                >
                  <Card className="p-5 bg-white border border-border-custom hover:border-emerald hover:shadow-md transition-all">
                    <div className="text-center">
                      {item.photo ? (
                        <Image
                          src={item.photo}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald/10 flex items-center justify-center">
                          <User className="w-8 h-8 text-emerald" />
                        </div>
                      )}
                      <Badge className="bg-emerald/10 text-emerald mb-2">{item.position}</Badge>
                      <p className="font-semibold text-text-primary">{item.name}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Connecting Line */}
          <div className="flex justify-center">
            <div className="w-0.5 h-8 bg-emerald/30"></div>
          </div>

          {/* Row 4: Departemen */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <Badge className="bg-emerald/10 text-emerald">Departemen</Badge>
            </div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {/* Seni dan Budaya */}
              <Link href="/struktur/seni-budaya">
                <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    {structure.kepala_seni_budaya_photo ? (
                      <Image
                        src={structure.kepala_seni_budaya_photo}
                        alt="Tim Seni dan Budaya"
                        width={48}
                        height={48}
                        className="flex-shrink-0 w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Palette className="w-6 h-6 text-purple-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        Seni dan Budaya
                      </h3>
                      <p className="text-sm text-text-secondary mb-3">
                        Mengembangkan kreativitas dan melestarikan budaya Kutai
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-600 text-xs">Ketua</Badge>
                        <p className="text-sm font-semibold text-text-primary">{structure.kepala_seni_budaya}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Sosial dan Keagamaan */}
              <Link href="/struktur/sosial-keagamaan">
                <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    {structure.kepala_sosial_keagamaan_photo ? (
                      <Image
                        src={structure.kepala_sosial_keagamaan_photo}
                        alt="Tim Sosial dan Keagamaan"
                        width={48}
                        height={48}
                        className="flex-shrink-0 w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-green-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        Sosial dan Keagamaan
                      </h3>
                      <p className="text-sm text-text-secondary mb-3">
                        Mendorong kepedulian sosial dan pembinaan spiritual anggota
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-600 text-xs">Ketua</Badge>
                        <p className="text-sm font-semibold text-text-primary">{structure.kepala_sosial_keagamaan}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Informasi dan Komunikasi */}
              <Link href="/struktur/infokom">
                <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    {structure.kepala_infokom_photo ? (
                      <Image
                        src={structure.kepala_infokom_photo}
                        alt="Tim Informasi dan Komunikasi"
                        width={48}
                        height={48}
                        className="flex-shrink-0 w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Megaphone className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        Informasi dan Komunikasi
                      </h3>
                      <p className="text-sm text-text-secondary mb-3">
                        Mengelola media sosial, publikasi, dan dokumentasi
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-600 text-xs">Ketua</Badge>
                        <p className="text-sm font-semibold text-text-primary">{structure.kepala_infokom}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Pengembangan Organisasi */}
              <Link href="/struktur/pengembangan-organisasi">
                <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    {structure.kepala_pengembangan_org_photo ? (
                      <Image
                        src={structure.kepala_pengembangan_org_photo}
                        alt="Tim Pengembangan Organisasi"
                        width={48}
                        height={48}
                        className="flex-shrink-0 w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-amber-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        Pengembangan Organisasi
                      </h3>
                      <p className="text-sm text-text-secondary mb-3">
                        Merancang kaderisasi dan pengembangan kapasitas anggota
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-100 text-amber-600 text-xs">Ketua</Badge>
                        <p className="text-sm font-semibold text-text-primary">{structure.kepala_pengembangan_org}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Departemen Olahraga */}
              <Link href="/struktur/olahraga">
                <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    {structure.kepala_olahraga_photo ? (
                      <Image
                        src={structure.kepala_olahraga_photo}
                        alt="Tim Olahraga"
                        width={48}
                        height={48}
                        className="flex-shrink-0 w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-red-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        Departemen Olahraga
                      </h3>
                      <p className="text-sm text-text-secondary mb-3">
                        Membangun semangat sportivitas dan kesehatan melalui kegiatan olahraga
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-600 text-xs">Ketua</Badge>
                        <p className="text-sm font-semibold text-text-primary">{structure.kepala_olahraga}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Kajian Strategi dan Pendidikan */}
              <Link href="/struktur/kajian-pendidikan">
                <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    {structure.kepala_kajian_pendidikan_photo ? (
                      <Image
                        src={structure.kepala_kajian_pendidikan_photo}
                        alt="Tim Kajian dan Pendidikan"
                        width={48}
                        height={48}
                        className="flex-shrink-0 w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-1">
                        Kajian Strategi dan Pendidikan
                      </h3>
                      <p className="text-sm text-text-secondary mb-3">
                        Mengembangkan kapasitas intelektual melalui kajian dan riset
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-100 text-indigo-600 text-xs">Ketua</Badge>
                        <p className="text-sm font-semibold text-text-primary">{structure.kepala_kajian_pendidikan}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
