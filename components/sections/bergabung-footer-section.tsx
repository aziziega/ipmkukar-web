"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, cubicBezier } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Instagram, Youtube, Users, TrendingUp, Calendar, Award, Mail, MapPin } from "lucide-react"
import { FaTiktok as FaTiktokRaw, FaWhatsapp as FaWhatsappRaw } from "react-icons/fa"
const FaTiktok = FaTiktokRaw as any
const FaWhatsapp = FaWhatsappRaw as any
import Link from "next/link"
import Image from "next/image"

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      if (start === end) return

      let totalDuration = 1200 // ms
      let incrementTime = Math.max(Math.floor(totalDuration / end), 12)

      const timer = setInterval(() => {
        const step = Math.ceil((end - start) / 10)
        start += step
        if (start >= end) {
          clearInterval(timer)
          setCount(end)
        } else {
          setCount(start)
        }
      }, incrementTime)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(\?!\d))/g, ",")
  }

  return <span ref={ref}>{formatNumber(count)}{suffix}</span>
}

export default function BergabungFooterSection() {
  // State for statistics with fallback values
  const [stats, setStats] = useState([
    { icon: Users, value: 30, suffix: "+", label: "Anggota Aktif" },
    { icon: TrendingUp, value: 10, suffix: "+", label: "Kegiatan/Tahun" },
    { icon: Calendar, value: 1000, suffix: "+", label: "Alumni Sejak 2002" },
    { icon: Award, value: 6, suffix: "", label: "Departemen Aktif" },
  ])

  // Fetch statistics from API on mount
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/site-statistics')
        const data = await response.json()

        if (data.success && data.data) {
          setStats([
            { icon: Users, value: data.data.active_members, suffix: "+", label: "Anggota Aktif" },
            { icon: TrendingUp, value: data.data.activities_per_year, suffix: "+", label: "Kegiatan/Tahun" },
            { icon: Calendar, value: data.data.total_alumni, suffix: "+", label: "Alumni Sejak 2002" },
            { icon: Award, value: data.data.active_departments, suffix: "", label: "Departemen Aktif" },
          ])
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
        // Keep fallback values on error
      }
    }

    fetchStatistics()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
  }

  return (
    <section
      id="gabung"
      className="relative bg-emerald-deeper py-20 overflow-hidden"
    >
      {/* Background Image with slow zoom motion */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12, opacity: 0.15 }}
        whileInView={{ scale: 1.02, opacity: 0.35 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: cubicBezier(0.16, 1, 0.3, 1) }}
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&h=1080&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-deeper/90 via-emerald-dark/85 to-black/95" />

      {/* Content */}
      <motion.div
        className="relative container mx-auto px-6 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* Main CTA */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            SIAP BERGABUNG <span className="text-gold">BERSAMA</span> KAMI?
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Ribuan mahasiswa Kukar telah menemukan keluarga mereka di Jogja. Bergabunglah dan rasakan kekuatan persaudaraan yang sejati.
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors hover:bg-gold/20 cursor-default"
                  >
                    <Icon className="w-6 h-6 text-gold" />
                  </motion.div>
                </div>
                <div className="text-3xl md:text-4xl font-black text-white mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm md:text-base text-white/70 uppercase tracking-wide font-semibold">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Button */}
        <motion.div className="text-center mb-20" variants={itemVariants}>
          <Link href="/bergabung">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button
                size="lg"
                className="bg-emerald hover:bg-emerald-dark text-white font-bold text-xl px-12 py-6 rounded-lg transition-all duration-300 uppercase tracking-wide shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                JOIN IPM NOW →
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Three-Column Wide Footer */}
        <div className="pt-16 border-t border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            {/* Column 1: Brand/About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo/logo-IPM.webp"
                  alt="IPM Kukar Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
                <div>
                  <div className="text-white font-black text-xl tracking-wide leading-tight">
                    IPM KUKAR
                  </div>
                  <div className="text-gold text-xs font-semibold">Yogyakarta</div>
                </div>
              </div>
              <p className="text-gold font-semibold mb-2">"Dari Kukar, untuk Kukar"</p>
              <p className="text-white/60 text-sm leading-relaxed">
                Ikatan Pelajar Mahasiswa Kutai Kartanegara di Yogyakarta. Keluarga besar mahasiswa Kukar sejak 2002.
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wide text-sm">Navigasi</h4>
              <div className="space-y-3">
                <Link
                  href="/home"
                  className="block text-white/70 hover:text-gold transition-colors text-sm"
                >
                  Home
                </Link>
                <Link
                  href="/visi-misi"
                  className="block text-white/70 hover:text-gold transition-colors text-sm"
                >
                  Visi & Misi
                </Link>
                <Link
                  href="/struktur"
                  className="block text-white/70 hover:text-gold transition-colors text-sm"
                >
                  Struktur Organisasi
                </Link>
                <Link
                  href="/home#proker"
                  className="block text-white/70 hover:text-gold transition-colors text-sm"
                >
                  Program Kerja
                </Link>
                <Link
                  href="/home#kegiatan"
                  className="block text-white/70 hover:text-gold transition-colors text-sm"
                >
                  Kegiatan
                </Link>
              </div>
            </div>

            {/* Column 3: Contact & Social */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wide text-sm">Kontak</h4>
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3 text-white/70 text-sm">
                  <MapPin size={16} className="text-gold mt-1 flex-shrink-0" />
                  <span>Yogyakarta, Indonesia</span>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 text-white/70 text-sm">
                  <Mail size={16} className="text-gold mt-1 flex-shrink-0" />
                  <a
                    href="mailto:ipmkukaryogyakarta@gmail.com"
                    className="hover:text-gold transition-colors break-all"
                  >
                    ipmkukaryogyakarta@gmail.com
                  </a>
                </div>

                {/* Social Media */}
                <div>
                  <p className="text-xs text-white/50 mb-3 uppercase tracking-wide">Follow Us</p>
                  <div className="flex gap-3">
                    <a
                      href="https://www.instagram.com/ipm_kukarjogja/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all group"
                    >
                      <Instagram size={16} className="text-white group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@ipmkukar.yogyakarta"
                      target="_blank"
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all group"
                    >
                      <FaTiktok size={14} className="text-white group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href="#"
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all group"
                    >
                      <Youtube size={16} className="text-white group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href="https://wa.me/+6285159277007"
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all group"
                      target="_blank"

                    >
                      <FaWhatsapp size={16} className="text-white group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Copyright */}
          <div className="pt-8 border-t border-white/10 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
              <p>© 2026 IPM Kukar Yogyakarta. All rights reserved.</p>
              <p>
                Design by{" "}
                <a
                  href="https://aziziem.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light transition-colors font-semibold"
                >
                  Azizi
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
