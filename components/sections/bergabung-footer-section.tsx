"use client"

import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Instagram, Youtube, MapPin, Mail, Phone, Users, TrendingUp, Calendar, Award } from "lucide-react"
import { FaTiktok, FaWhatsapp } from "react-icons/fa"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

export default function BergabungFooterSection() {
  const [formData, setFormData] = useState({
    nama: "",
    asal: "",
    universitas: "",
    whatsapp: "",
  })

  // Statistics with counter animation
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Smooth scroll animations (matching smooth-scroll-hero pattern)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Clip path animation - image reveals from small to full (0-70%)
  const clipStart = useTransform(scrollYProgress, [0, 0.7], [25, 0])
  const clipEnd = useTransform(scrollYProgress, [0, 0.7], [75, 100])
  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`

  // Background scale animation - completes by 70%
  const backgroundScale = useTransform(scrollYProgress, [0, 0.7], [1.2, 1])

  // Background size animation - image expands to fullpage (0-70%)
  const backgroundSize = useTransform(scrollYProgress, [0, 0.7], ["170%", "100%"])

  // Content animations - appears EARLIER (30-50% like smooth-scroll-hero)
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
  const contentY = useTransform(scrollYProgress, [0.3, 0.5], [50, 0])

  // Statistics appear slightly after (35-55%)
  const statsOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1])
  const statsY = useTransform(scrollYProgress, [0.35, 0.55], [30, 0])

  // CTA Button (40-60%)
  const buttonOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1])
  const buttonY = useTransform(scrollYProgress, [0.4, 0.6], [30, 0])

  // Footer section (45-60% - ALL VISIBLE BY 60%!)
  const footerOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1])

  const stats = [
    { icon: Users, value: 30, label: "Anggota Aktif", suffix: "+" },
    { icon: Calendar, value: 10, label: "Kegiatan/Tahun", suffix: "+" },
    { icon: Award, value: 1000, label: "Alumni Sejak 2002", suffix: "+" },
    { icon: TrendingUp, value: 6, label: "Departemen Aktif", suffix: "" },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isVisible) return

      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }, [isVisible, value])

    return (
      <span className="text-4xl md:text-5xl font-black text-white">
        {count.toLocaleString()}
        {suffix}
      </span>
    )
  }

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
    <section
      ref={sectionRef}
      id="gabung"
      style={{
        height: "1875px",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
      }}
      className="relative"
    >
      <motion.div
        className="sticky top-0 h-screen w-full bg-emerald-deeper overflow-hidden"
        style={{
          clipPath,
          willChange: "transform",
        }}
      >
        {/* Background Image */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&h=1080&fit=crop)`,
            backgroundSize,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            scale: backgroundScale,
          }}
        />

        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-deeper/95 via-emerald-dark/90 to-black/95" />

        {/* CTA Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20 pt-20"
          style={{
            opacity: contentOpacity,
            y: contentY,
          }}
        >
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            {/* Main CTA Heading */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-wider mb-6 leading-none">
              SIAP BERGABUNG
              <br />
              <span className="text-gold">BERSAMA KAMI?</span>
            </h2>

            {/* Supporting Text */}
            <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-8 leading-relaxed font-medium">
              Ribuan mahasiswa Kukar telah menemukan keluarga mereka di Jogja.
              <br className="hidden md:block" />
              Bergabunglah dan rasakan kekuatan persaudaraan yang sejati.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gold" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-white mb-1">
                      {isVisible && <Counter value={stat.value} suffix={stat.suffix} />}
                    </div>
                    <div className="text-xs md:text-sm text-white/70 font-medium uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA Button */}
            <a href="/bergabung">
              <Button
                size="lg"
                className="font-bold text-xl tracking-wide px-12 py-4 bg-emerald hover:bg-emerald-dark text-white border-2 border-emerald hover:scale-105 transition-all duration-300"
              >
                JOIN IPM NOW →
              </Button>
            </a>

            {/* Footer Links */}
            <div className="mt-12 pt-6 border-t border-white/20">
              {/* Navigation */}
              <div className="flex flex-wrap justify-center gap-6 text-sm mb-4">
                <Link href="/#tentang" className="text-white/70 hover:text-gold transition-colors">
                  Tentang
                </Link>
                <Link href="/#struktur" className="text-white/70 hover:text-gold transition-colors">
                  Struktur
                </Link>
                <Link href="/#program-kerja" className="text-white/70 hover:text-gold transition-colors">
                  Program Kerja
                </Link>
                <Link href="/#kegiatan" className="text-white/70 hover:text-gold transition-colors">
                  Kegiatan
                </Link>
              </div>

              {/* Social Media */}
              <div className="flex justify-center gap-4 mb-4">
                <a href="https://www.instagram.com/ipm_kukarjogja/" className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all">
                  <Instagram size={16} className="text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all">
                  <FaTiktok size={14} className="text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all">
                  <Youtube size={16} className="text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all">
                  <FaWhatsapp size={16} className="text-white" />
                </a>
              </div>

              {/* Design Credit */}
              <p className="text-xs text-white/50">
                Design by{" "}
                <a href="https://aziziem.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors font-semibold">
                  Azizi
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
