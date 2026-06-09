"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Heart, Megaphone, Rocket, User, Trophy, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

export default function StrukturSection() {
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
          <span className="text-emerald text-sm font-bold tracking-[0.2em] uppercase">
            Struktur Organisasi
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary mt-4">
            Kepengurusan IPM Kukar Yogyakarta
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="p-4 bg-white border border-border-custom hover:shadow-md transition-all">
                  <Badge className="bg-gold/20 text-gold border-gold/30 mb-2">
                    Dewan Pengawas
                  </Badge>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald" />
                    </div>
                    <p className="font-semibold text-text-primary">Anggota 1 Placeholder</p>
                  </div>
                </Card>
              </motion.div>
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="p-4 bg-white border border-border-custom hover:shadow-md transition-all">
                  <Badge className="bg-gold/20 text-gold border-gold/30 mb-2">
                    Dewan Pengawas
                  </Badge>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald" />
                    </div>
                    <p className="font-semibold text-text-primary">Anggota 2 Placeholder</p>
                  </div>
                </Card>
              </motion.div>
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
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-emerald bg-emerald/10 flex items-center justify-center">
                    <User className="w-12 h-12 text-emerald" />
                  </div>
                  <Badge className="bg-emerald/20 text-emerald border-emerald/30 mb-2">
                    Ketua Umum
                  </Badge>
                  <h3 className="text-xl font-bold text-text-primary">
                    [Nama Placeholder]
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
              {["Wakil Ketua", "Sekretaris", "Bendahara"].map((position, idx) => (
                <motion.div
                  key={position}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                >
                  <Card className="p-5 bg-white border border-border-custom hover:border-emerald hover:shadow-md transition-all">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald/10 flex items-center justify-center">
                        <User className="w-8 h-8 text-emerald" />
                      </div>
                      <Badge className="bg-emerald/10 text-emerald mb-2">{position}</Badge>
                      <p className="font-semibold text-text-primary">[Nama Placeholder]</p>
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
              <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      Seni dan Budaya
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      Mengembangkan kreativitas dan melestarikan budaya Kutai
                    </p>
                    <p className="text-xs text-text-secondary">
                      <span className="font-semibold">Ketua:</span> [Placeholder]
                    </p>
                  </div>
                </div>
              </Card>

              {/* Sosial dan Keagamaan */}
              <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      Sosial dan Keagamaan
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      Mendorong kepedulian sosial dan pembinaan spiritual anggota
                    </p>
                    <p className="text-xs text-text-secondary">
                      <span className="font-semibold">Ketua:</span> [Placeholder]
                    </p>
                  </div>
                </div>
              </Card>

              {/* Informasi dan Komunikasi */}
              <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      Informasi dan Komunikasi
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      Mengelola media sosial, publikasi, dan dokumentasi
                    </p>
                    <p className="text-xs text-text-secondary">
                      <span className="font-semibold">Ketua:</span> [Placeholder]
                    </p>
                  </div>
                </div>
              </Card>

              {/* Pengembangan Organisasi */}
              <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      Pengembangan Organisasi
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      Merancang kaderisasi dan pengembangan kapasitas anggota
                    </p>
                    <p className="text-xs text-text-secondary">
                      <span className="font-semibold">Ketua:</span> [Placeholder]
                    </p>
                  </div>
                </div>
              </Card>

              {/* Departemen Olahraga */}
              <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      Departemen Olahraga
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      Membangun semangat sportivitas dan kesehatan melalui kegiatan olahraga
                    </p>
                    <p className="text-xs text-text-secondary">
                      <span className="font-semibold">Ketua:</span> [Placeholder]
                    </p>
                  </div>
                </div>
              </Card>

              {/* Kajian Strategi dan Pendidikan */}
              <Card className="p-6 bg-white border border-border-custom hover:border-emerald hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      Kajian Strategi dan Pendidikan
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      Mengembangkan kapasitas intelektual melalui kajian dan riset
                    </p>
                    <p className="text-xs text-text-secondary">
                      <span className="font-semibold">Ketua:</span> [Placeholder]
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
