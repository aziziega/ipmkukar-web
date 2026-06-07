"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Instagram, Youtube, MapPin, Mail, Phone, Users, TrendingUp, Calendar, Award } from "lucide-react"
import { FaTiktok, FaWhatsapp } from "react-icons/fa"
import Image from "next/image"
import { motion } from "framer-motion"
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
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    { icon: Users, value: 150, label: "Anggota Aktif", suffix: "+" },
    { icon: Calendar, value: 30, label: "Kegiatan/Tahun", suffix: "+" },
    { icon: Award, value: 1000, label: "Alumni Sejak 2002", suffix: "+" },
    { icon: TrendingUp, value: 4, label: "Departemen Aktif", suffix: "" },
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

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section ref={sectionRef} id="gabung" className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&h=1080&fit=crop"
          alt="IPM Kukar Community"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-deeper/95 via-emerald-dark/90 to-black/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-6xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            SIAP BERGABUNG <span className="text-gold">BERSAMA</span> KAMI?
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Ribuan mahasiswa Kukar telah menemukan keluarga mereka di Jogja. Bergabunglah dan rasakan kekuatan persaudaraan yang sejati.
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 max-w-6xl mx-auto"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12 text-gold" />
                </div>
                <div className="mb-2">
                  {isVisible && <Counter value={stat.value} suffix={stat.suffix} />}
                </div>
                <p className="text-sm md:text-base text-white/70 uppercase tracking-wide font-semibold">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-20 max-w-6xl mx-auto"
        >
          <a href="/bergabung">
            <Button
              size="lg"
              className="bg-emerald hover:bg-emerald-dark text-white font-black text-xl px-12 py-8 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 uppercase tracking-wide"
            >
              JOIN IPM NOW →
            </Button>
          </a>
        </motion.div>

        {/* Footer Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 pt-12 border-t border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 max-w-6xl mx-auto">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo/logo-IPM.webp" alt="IPM Kukar" width={40} height={40} className="object-contain" />
                <h3 className="text-xl font-black text-white">IPM KUKAR - Yogyakarta</h3>
              </div>
              <p className="text-gold font-semibold mb-2">Dari Kukar, untuk Kukar</p>
              <p className="text-white/70 text-sm">Organisasi mahasiswa Kukar di Yogyakarta sejak 2002.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wide text-sm">Navigasi</h4>
              <div className="space-y-2">
                {["Tentang", "Struktur", "Program Kerja", "Kegiatan"].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToSection(`#${item.toLowerCase().replace(" ", "-")}`)}
                    className="block text-white/70 hover:text-gold transition-colors text-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wide text-sm">Kontak</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <MapPin size={16} className="text-gold" />
                  <span>Yogyakarta, Indonesia</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Mail size={16} className="text-gold" />
                  <a href="mailto:ipmkukar.jogja@email.com" className="hover:text-gold transition-colors">
                    ipmkukar.jogja@email.com
                  </a>
                </div>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-emerald flex items-center justify-center transition-colors">
                    <Instagram size={16} className="text-white" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-emerald flex items-center justify-center transition-colors">
                    <FaTiktok size={14} className="text-white" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-emerald flex items-center justify-center transition-colors">
                    <Youtube size={16} className="text-white" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-emerald flex items-center justify-center transition-colors">
                    <FaWhatsapp size={16} className="text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm mb-2">
              © 2026 IPM Kukar Yogyakarta. All rights reserved.
            </p>
            <p className="text-white/40 text-xs">
              Web Design by{" "}
              <a href="https://aziziem.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors font-semibold">
                Azizi
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
