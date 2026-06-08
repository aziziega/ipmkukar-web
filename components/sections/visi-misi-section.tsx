"use client"

import { motion } from "framer-motion"
import { Users2, Link, Rocket, Target } from "lucide-react"

export default function VisiMisiSection() {
  const misi = [
    {
      icon: Users2,
      number: "01",
      title: "Silaturahmi",
      text: "Menghimpun dan mempererat silaturahmi mahasiswa asal Kutai Kartanegara di Yogyakarta",
    },
    {
      icon: Rocket,
      number: "02",
      title: "Pengembangan",
      text: "Mengembangkan potensi akademik, kepemimpinan, dan kewirausahaan anggota",
    },
    {
      icon: Link,
      number: "03",
      title: "Jembatan",
      text: "Menjadi jembatan antara mahasiswa Kukar dengan pemerintah daerah dan stakeholder",
    },
    {
      icon: Target,
      number: "04",
      title: "Kontribusi",
      text: "Mendorong anggota untuk aktif berkontribusi bagi pembangunan Kutai Kartanegara",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  return (
    <section
      id="visi-misi"
      className="relative pt-32 pb-20 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a5c3d 0%, #0f7a52 30%, #0f7a52 70%, #0a5c3d 100%)",
      }}
    >
      {/* Subtle background image overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&h=1080&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(240, 180, 41, 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* ===== VISI SECTION ===== */}
        <motion.div
          className="text-center mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="inline-block mb-6" variants={itemVariants}>
            <span className="text-gold text-sm font-bold tracking-[0.3em] uppercase">
              Visi Kami
            </span>
          </motion.div>

          {/* Visi Card — big standout glassmorphism card */}
          <motion.div
            className="relative max-w-4xl mx-auto"
            variants={itemVariants}
          >
            {/* Gold corner accents */}
            <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-gold/60 rounded-tl-lg" />
            <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-gold/60 rounded-tr-lg" />
            <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-gold/60 rounded-bl-lg" />
            <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-gold/60 rounded-br-lg" />

            <div className="bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-2xl px-8 py-12 md:px-16 md:py-16">
              {/* Decorative Gold Line Top */}
              <div className="flex items-center justify-center mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/80" />
                <div className="w-2 h-2 bg-gold rounded-full mx-3 shadow-[0_0_10px_rgba(240,180,41,0.5)]" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/80" />
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-relaxed lg:leading-[1.4]">
                &ldquo;Terwujudnya mahasiswa Kutai Kartanegara yang{" "}
                <span className="text-gold">berprestasi</span>,{" "}
                <span className="text-gold">berkarakter</span>, dan siap{" "}
                <span className="text-gold">berkontribusi</span> bagi pembangunan daerah.&rdquo;
              </h2>

              {/* Decorative Gold Line Bottom */}
              <div className="flex items-center justify-center mt-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/80" />
                <div className="w-2 h-2 bg-gold rounded-full mx-3 shadow-[0_0_10px_rgba(240,180,41,0.5)]" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/80" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ===== MISI SECTION ===== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="text-center mb-14" variants={itemVariants}>
            <span className="text-gold text-sm font-bold tracking-[0.3em] uppercase">
              Misi Kami
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-white mt-4">
              4 Pilar Pergerakan
            </h3>
          </motion.div>

          {/* Misi items — numbered steps */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {misi.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="group relative"
                >
                  <div className="relative bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 h-full hover:bg-white/[0.1] hover:border-gold/30 transition-all duration-300 overflow-hidden">
                    {/* Big faded number in background */}
                    <span className="absolute -top-2 -right-1 text-[7rem] font-black text-white/[0.04] leading-none select-none pointer-events-none">
                      {item.number}
                    </span>

                    {/* Top row: number badge + icon */}
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/15 border border-gold/20 flex items-center justify-center group-hover:bg-gold/25 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <span className="text-gold/70 text-xs font-bold tracking-widest uppercase">
                          Misi {item.number}
                        </span>
                        <h4 className="text-white text-lg font-bold -mt-0.5">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/75 text-base leading-relaxed relative z-10">
                      {item.text}
                    </p>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
