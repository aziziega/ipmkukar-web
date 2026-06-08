"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Target, Users2, Link, Rocket } from "lucide-react"

export default function VisiMisiSection() {
  const misi = [
    {
      icon: Users2,
      text: "Menghimpun dan mempererat silaturahmi mahasiswa asal Kutai Kartanegara di Yogyakarta",
    },
    {
      icon: Rocket,
      text: "Mengembangkan potensi akademik, kepemimpinan, dan kewirausahaan anggota",
    },
    {
      icon: Link,
      text: "Menjadi jembatan antara mahasiswa Kukar dengan pemerintah daerah dan stakeholder",
    },
    {
      icon: Target,
      text: "Mendorong anggota untuk aktif berkontribusi bagi pembangunan Kutai Kartanegara",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section id="visi-misi" className="relative py-20 bg-emerald-dark">
      <div className="container mx-auto px-6">
        {/* Visi Section */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="inline-block mb-6" variants={itemVariants}>
            <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">
              Visi Kami
            </span>
          </motion.div>

          {/* Decorative Gold Line Top */}
          <motion.div className="flex items-center justify-center mb-8" variants={itemVariants}>
            <div className="h-0.5 w-20 bg-gold"></div>
            <div className="h-1 w-1 bg-gold rounded-full mx-2"></div>
            <div className="h-0.5 w-20 bg-gold"></div>
          </motion.div>

          {/* Visi Statement */}
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-5xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Terwujudnya mahasiswa Kutai Kartanegara yang berprestasi, berkarakter, dan siap berkontribusi bagi pembangunan daerah.
          </motion.h2>

          {/* Decorative Gold Line Bottom */}
          <motion.div className="flex items-center justify-center mt-8" variants={itemVariants}>
            <div className="h-0.5 w-20 bg-gold"></div>
            <div className="h-1 w-1 bg-gold rounded-full mx-2"></div>
            <div className="h-0.5 w-20 bg-gold"></div>
          </motion.div>
        </motion.div>

        {/* Misi Section */}
        <motion.div
          className="mt-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">
              Misi Kami
            </span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {misi.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="p-6 bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 h-full">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gold" />
                      </div>
                      <p className="text-white text-base leading-relaxed flex-1">
                        {item.text}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
