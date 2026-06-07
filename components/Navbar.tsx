"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Track scroll position to update navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Tentang", href: "#tentang" },
    { name: "Struktur", href: "#struktur" },
    { name: "Program Kerja", href: "#proker" },
    { name: "Kegiatan", href: "#kegiatan" },
    { name: "Kontak", href: "#kontak" },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      const offset = 80 // offset for navbar height
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
    setIsMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-1/2 z-50 w-[95%] max-w-5xl transition-all duration-300 ${isScrolled
          ? "top-4 py-2 bg-white/90 border-white/50 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)]"
          : "top-6 py-4 bg-white/95 border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
          } rounded-full border backdrop-blur-md px-6 md:px-8 flex items-center justify-between`}
      >
        {/* Brand / Logo */}
        <button
          onClick={() => scrollToSection("#hero")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo/logo-IPM.webp"
            alt="IPM Kukar Logo"
            width={60}
            height={60}
            className="object-contain"
          />
          <div className="flex flex-col items-start text-emerald font-extrabold text-base md:text-lg leading-tight tracking-wide">
            <span>IPM</span>
            <span>KUKAR</span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-medium text-sm tracking-wide"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Right CTA Button */}
        <div className="hidden md:block">
          <button
            onClick={() => scrollToSection("#gabung")}
            className="bg-gold text-emerald-deeper hover:bg-gold/90 transition-all duration-300 rounded-full py-2.5 px-6 font-semibold text-xs tracking-wider uppercase"
          >
            Gabung Sekarang
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-800 hover:text-gray-600 transition-colors p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </motion.header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-md z-40 rounded-3xl border border-gray-100 p-6 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-4 text-center">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-600 hover:text-gray-900 font-medium py-2 text-base transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <hr className="my-2 border-gray-100" />
              <button
                onClick={() => scrollToSection("#gabung")}
                className="bg-gold text-emerald-deeper hover:bg-gold/90 py-3 rounded-full font-semibold text-sm tracking-wider uppercase transition-colors"
              >
                Gabung Sekarang
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
