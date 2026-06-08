"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Users, GraduationCap, Star } from "lucide-react"

export default function TentangSection() {
  const values = [
    {
      icon: Users,
      title: "Kekeluargaan",
      description: "Membangun rasa persaudaraan sesama perantau dari Kukar yang sedang berjuang di tanah rantau.",
    },
    {
      icon: GraduationCap,
      title: "Pengembangan Diri",
      description: "Mendorong prestasi akademik dan non-akademik untuk menjadi mahasiswa berprestasi.",
    },
    {
      icon: Star,
      title: "Kontribusi Nyata",
      description: "Memberi dampak positif bagi Kutai Kartanegara dan Yogyakarta melalui berbagai kegiatan.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="tentang" className="relative py-20 bg-surface">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Text Content */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Label */}
            <motion.div className="inline-block" variants={itemVariants}>
              <span className="text-emerald text-sm font-bold tracking-[0.2em] uppercase">
                Tentang Kami
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              className="text-4xl md:text-5xl font-black text-text-primary leading-tight"
              variants={itemVariants}
            >
              Rumah Kedua untuk Mahasiswa Kukar
            </motion.h2>

            {/* Description */}
            <motion.div className="space-y-4 text-lg text-text-secondary leading-relaxed" variants={containerVariants}>
              <motion.p variants={itemVariants}>
                IPM Kukar Yogyakarta adalah organisasi daerah yang menghimpun mahasiswa asal Kabupaten Kutai Kartanegara yang sedang menempuh pendidikan di Yogyakarta.
              </motion.p>
              <motion.p variants={itemVariants}>
                Kami hadir sebagai rumah kedua — tempat bertemu, berkembang bersama, dan mempersiapkan diri untuk kembali berkontribusi bagi Kutai Kartanegara.
              </motion.p>
              <motion.p className="font-semibold text-emerald" variants={itemVariants}>
                Sejak 2002, lebih dari 1000+ alumni telah merasakan kehangatan keluarga besar IPM Kukar Yogyakarta.
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Right: Value Cards */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div key={index} variants={cardVariants}>
                  <Card className="p-6 bg-white border-l-4 border-l-emerald border-border-custom hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-emerald" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-text-primary mb-2">
                          {value.title}
                        </h3>
                        <p className="text-text-secondary leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
