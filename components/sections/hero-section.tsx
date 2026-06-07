"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Placeholder images - user will replace with real IPM member photos
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop",
      alt: "IPM Kukar Members - Slide 1",
    },
    {
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&h=1080&fit=crop",
      alt: "IPM Kukar Members - Slide 2",
    },
    {
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1920&h=1080&fit=crop",
      alt: "IPM Kukar Members - Slide 3",
    },
  ]

  // Auto-play: change slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // 5 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
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
              src={slide.image}
              alt={slide.alt}
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
      <div className="relative z-10 container mx-auto px-6 py-8 md:py-12 text-center flex flex-col items-center justify-center min-h-[80vh]">
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
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight mt-16 md:mt-20">
          Dari{" "}
          <span className="text-gold">Kukar</span>{" "}
          untuk{" "}
          <span className="text-gold">Kukar</span>
          <br />
          Bergerak Bersama di Jogja
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed">
          Wadah berhimpun mahasiswa Kutai Kartanegara di Yogyakarta — berkembang bersama dan memberi dampak nyata untuk daerah.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            size="lg"
            className="bg-emerald hover:bg-emerald-dark text-white font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => scrollToSection("#tentang")}
          >
            Kenali Kami
          </Button>
          {/* <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-emerald-deeper font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-300"
            onClick={() => scrollToSection("#kegiatan")}
          >
            Lihat Kegiatan
          </Button> */}
        </div>

        {/* Scroll Down Indicator */}
        {/* <button
          onClick={() => scrollToSection("#tentang")}
          className="inline-flex flex-col items-center gap-2 text-gold hover:text-gold-light transition-colors duration-300 animate-bounce"
          aria-label="Scroll down"
        >
          <span className="text-sm font-medium tracking-wide">Scroll untuk lebih lanjut</span>
          <ChevronDown className="w-6 h-6" />
        </button> */}
      </div>

      {/* Slider Navigation - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </section>
  )
}
