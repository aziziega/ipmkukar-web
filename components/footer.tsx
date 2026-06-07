"use client"

import { motion } from "framer-motion"
import { Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react"
import { FaTiktok, FaWhatsapp } from "react-icons/fa"
import Image from "next/image"

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer id="kontak" className="relative bg-emerald-deeper text-white">
      {/* Gold Decorative Line at Top */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent"></div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo/logo-IPM.webp"
                alt="IPM Kukar Logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <h3 className="text-2xl font-black text-white">IPM KUKAR - Yogyakarta</h3>
            </div>

            {/* Tagline */}
            <p className="text-xl font-semibold text-gold mb-4">
              Dari Kukar, untuk Kukar
            </p>

            <p className="text-base text-white/80 leading-relaxed mb-6 max-w-md">
              Organisasi daerah yang menghimpun mahasiswa Kutai Kartanegara di Yogyakarta sejak 2002.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-emerald hover:bg-emerald-dark text-white rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-emerald hover:bg-emerald-dark text-white rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="TikTok"
              >
                <FaTiktok size={16} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-emerald hover:bg-emerald-dark text-white rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-emerald hover:bg-emerald-dark text-white rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold text-white mb-6 tracking-wide">NAVIGASI</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("#tentang")}
                  className="text-white/80 hover:text-gold transition-colors duration-300 font-medium"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#struktur")}
                  className="text-white/80 hover:text-gold transition-colors duration-300 font-medium"
                >
                  Struktur Organisasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#proker")}
                  className="text-white/80 hover:text-gold transition-colors duration-300 font-medium"
                >
                  Program Kerja
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#kegiatan")}
                  className="text-white/80 hover:text-gold transition-colors duration-300 font-medium"
                >
                  Kegiatan
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#gabung")}
                  className="text-white/80 hover:text-gold transition-colors duration-300 font-medium"
                >
                  Bergabung
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold text-white mb-6 tracking-wide">KONTAK</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-gold flex-shrink-0" />
                <span className="text-white/80 font-medium">Yogyakarta, Indonesia</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-gold flex-shrink-0" />
                <a
                  href="mailto:ipmkukar.jogja@email.com"
                  className="text-white/80 hover:text-gold transition-colors duration-300 font-medium"
                >
                  ipmkukar.jogja@email.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-gold flex-shrink-0" />
                <a
                  href="tel:+6281234567890"
                  className="text-white/80 hover:text-gold transition-colors duration-300 font-medium"
                >
                  +62 812-3456-7890
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-white/20 pt-8 text-center"
        >
          <p className="text-white/70 font-medium mb-2">
            © 2026 IPM Kukar Yogyakarta. All rights reserved.
          </p>
          <p className="text-white/50 text-sm">
            Web Design by{" "}
            <a
              href="https://aziziem.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors duration-300 font-semibold"
            >
              Azizi
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
