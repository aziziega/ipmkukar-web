"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<Array<{ image_url: string; title: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch hero slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/hero-slides')
        const data = await response.json()

        if (data.success && data.slides.length > 0) {
          setSlides(data.slides.map((slide: any) => ({
            image_url: slide.image_url,
            title: slide.title,
          })))
        } else {
          // Fallback to placeholder if no slides
          setSlides([
            {
              image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop",
              title: "IPM Kukar Members - Slide 1",
            },
          ])
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error)
        // Fallback to placeholder on error
        setSlides([
          {
            image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop",
            title: "IPM Kukar Members - Slide 1",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlides()
  }, [])

  // Auto-play: change slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // 5 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [slides]) // Re-run when slides change

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

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

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const navVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 1,
      },
    },
  }


  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={slide.image_url}
              alt={slide.title}
              fill
              className="object-cover animate-hero-zoom"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-deeper/80 via-emerald-deeper/70 to-black/90" />

        {/* Kutai Kartanegara Ornament Overlay */}
        <div className="absolute inset-0 ornament-pattern opacity-30" />
      </div>

      {/* Hero Content */}
      <motion.div className="relative z-10 container mx-auto px-6 py-8 md:py-12 text-center flex flex-col items-center justify-center min-h-[80vh]" variants={containerVariants} initial="hidden" animate="visible">
        {/* IPM Kukar Logo */}
        {/* <div className="mb-8 animate-fadeIn">
          <Image 
            src="/logo/logo-IPM.webp" 
            alt="IPM Kukar Logo" 
            width={120} 
            height={120}
            className="object-contain"
          />
        </div> */}

        {/* Animated Badge */}
        {/* <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold/20 border border-gold/30 backdrop-blur-sm mb-8 animate-pulse">
          <span className="text-gold text-sm md:text-base font-medium tracking-wide">
            Ikatan Pelajar Mahasiswa · Kutai Kartanegara · Yogyakarta
          </span>
        </div> */}

        {/* Main Headline */}
        <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight mt-16 md:mt-20" variants={textVariants}>
          Dari{" "}
          <span className="text-gold">Kukar</span>{" "}
          untuk{" "}
          <span className="text-gold">Kukar</span>
          <br />
          Bergerak Bersama di Jogja
        </motion.h1>

        {/* Subheadline */}
        <motion.p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed" variants={textVariants}>
          Wadah berhimpun mahasiswa Kutai Kartanegara di Yogyakarta — berkembang bersama dan memberi dampak nyata untuk daerah.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16" variants={buttonVariants}>
          <Link href="/bergabung">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold-light text-emerald-deeper font-bold px-8 py-6 text-lg rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Bergabung Sekarang →
            </Button>
          </Link>
          <Link href="/datakukar">
            <Button
              size="lg"
              variant="outline"
              className="bg-blue-600 text-white border-none hover:bg-blue-700 font-bold px-8 py-6 text-lg rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Data Mahasiswa Kukar
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="bg-emerald text-white border-none hover:bg-white hover:text-emerald-deeper font-bold px-8 py-6 text-lg rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            onClick={() => scrollToSection("#tentang")}
          >
            Kenali Kami
          </Button>
        </motion.div>

        {/* Scroll Down Indicator */}
        {/* <button
          onClick={() => scrollToSection("#tentang")}
          className="inline-flex flex-col items-center gap-2 text-gold hover:text-gold-light transition-colors duration-300 animate-bounce"
          aria-label="Scroll down"
        >
          <span className="text-sm font-medium tracking-wide">Scroll untuk lebih lanjut</span>
          <ChevronDown className="w-6 h-6" />
        </button> */}
      </motion.div>

      {/* Slider Navigation - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <motion.div className="flex items-center space-x-4" variants={navVariants} initial="hidden" animate="visible">
          {/* Previous Arrow */}
          <button
            onClick={prevSlide}
            className="text-white hover:text-gold transition-colors p-2 bg-black/30 rounded-full backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-gold w-8" : "bg-white/40 hover:bg-white/60"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={nextSlide}
            className="text-white hover:text-gold transition-colors p-2 bg-black/30 rounded-full backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
