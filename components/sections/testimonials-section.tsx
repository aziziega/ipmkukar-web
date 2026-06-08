"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const SQRT_5000 = Math.sqrt(5000)

interface Testimonial {
  tempId: number
  name: string
  role: string
  asal: string
  quote: string
  initials: string
  color: string
}

interface TestimonialCardProps {
  position: number
  testimonial: Testimonial
  handleMove: (steps: number) => void
  cardSize: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0
  return (
    <div
      onClick={() => handleMove(position)}
      className="absolute left-1/2 top-1/2 cursor-pointer transition-all duration-500 ease-in-out"
      style={{
        width: cardSize,
        height: cardSize,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        zIndex: isCenter ? 10 : 0,
        filter: isCenter ? "drop-shadow(0 15px 20px rgba(0, 0, 0, 0.08))" : "none",
      }}
    >
      <div
        className={cn(
          "relative w-full h-full border-2 p-5 md:p-6 transition-colors duration-500 ease-in-out flex flex-col",
          isCenter
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-white text-gray-900 border-gray-200 hover:border-emerald",
        )}
        style={{
          clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        }}
      >
        <span
          className="absolute block origin-top-right rotate-45 bg-gray-300"
          style={{
            right: -2,
            top: 48,
            width: SQRT_5000,
            height: 2,
          }}
        />

        {/* Initial Badge */}
        <div className="mb-3 md:mb-4 flex-shrink-0">
          <div className={cn(
            "w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform duration-300",
            testimonial.color
          )}
            style={{
              boxShadow: "3px 3px 0px hsl(var(--background))",
            }}
          >
            <span className="text-white text-lg md:text-xl font-black">
              {testimonial.initials}
            </span>
          </div>
        </div>

        {/* Quote Text - Flexible Height */}
        <div className="flex-grow mb-3 md:mb-4 min-h-0">
          <h3 className={cn("text-xs sm:text-sm md:text-base font-normal leading-relaxed", isCenter ? "text-white" : "text-gray-900")}>
            "{testimonial.quote}"
          </h3>
        </div>

        {/* Author Info - At Bottom */}
        <div
          className={cn(
            "mt-auto flex-shrink-0",
            isCenter ? "text-gray-300" : "text-gray-600",
          )}
        >
          <p className="text-xs sm:text-sm font-bold mb-0.5 leading-tight">
            {testimonial.name}
          </p>
          <p className="text-[10px] sm:text-xs italic leading-tight">
            {testimonial.role}
          </p>
          <p className={cn("text-[10px] sm:text-xs mt-1 font-semibold leading-tight", isCenter ? "text-emerald-400" : "text-emerald")}>
            📍 {testimonial.asal}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const [cardSize, setCardSize] = useState(365)
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([
    {
      tempId: 0,
      name: "Ahmad Rizki Pratama",
      role: "Alumni 2020 | Teknik Sipil UGM",
      asal: "Tenggarong",
      quote: "IPM Kukar bukan cuma organisasi, tapi keluarga kedua di perantauan. Di sini aku belajar leadership, networking, dan yang paling penting: tetap connected dengan akar budaya Kukar.",
      initials: "AR",
      color: "from-orange-400 to-orange-600",
    },
    {
      tempId: 1,
      name: "Siti Nurhaliza",
      role: "Alumni 2019 | Ekonomi UII",
      asal: "Loa Janan",
      quote: "Dari IPM Kukar, aku dapat keluarga, mentor, bahkan partner bisnis. Pengalaman berorganisasi di sini jadi bekal penting untuk karir profesional aku sekarang.",
      initials: "SN",
      color: "from-green-400 to-green-600",
    },
    {
      tempId: 2,
      name: "Bayu Saputra",
      role: "Alumni 2021 | Kedokteran UGM",
      asal: "Samboja",
      quote: "Eroh Bebaya, Lembuswana Cup, bakti sosial... Semua kegiatan IPM Kukar ngajarin aku tentang teamwork dan dedikasi. Pengalaman yang nggak bisa dilupain!",
      initials: "BS",
      color: "from-slate-700 to-slate-900",
    },
    {
      tempId: 3,
      name: "Dewi Lestari",
      role: "Anggota Aktif | Psikologi UNY",
      asal: "Kota Bangun",
      quote: "Sebagai mahasiswa baru di Jogja, IPM Kukar bantu aku adaptasi dengan cepat. Dari yang nggak kenal siapa-siapa, sekarang punya network luas sesama anak Kukar.",
      initials: "DL",
      color: "from-cyan-400 to-cyan-600",
    },
    {
      tempId: 4,
      name: "Muhammad Fauzi",
      role: "Alumni 2018 | Teknik Elektro UGM",
      asal: "Muara Badak",
      quote: "IPM Kukar adalah wadah sempurna untuk berkontribusi ke daerah sambil mengembangkan diri. Bangga bisa jadi bagian dari gerakan mahasiswa Kukar di Jogja!",
      initials: "MF",
      color: "from-red-500 to-orange-600",
    },
    {
      tempId: 5,
      name: "Nur Aini Rahma",
      role: "Alumni 2020 | Komunikasi UPN",
      asal: "Tenggarong Seberang",
      quote: "Dari segi softskill, networking, sampai pelestarian budaya Kukar - semua ada di IPM. Organisasi yang bener-bener prepare kita untuk masa depan!",
      initials: "NA",
      color: "from-purple-400 to-purple-600",
    },
    // Duplicate testimonials for smoother infinite scroll
    {
      tempId: 6,
      name: "Ahmad Rizki Pratama",
      role: "Alumni 2020 | Teknik Sipil UGM",
      asal: "Tenggarong",
      quote: "IPM Kukar bukan cuma organisasi, tapi keluarga kedua di perantauan. Di sini aku belajar leadership, networking, dan yang paling penting: tetap connected dengan akar budaya Kukar.",
      initials: "AR",
      color: "from-orange-400 to-orange-600",
    },
    {
      tempId: 7,
      name: "Siti Nurhaliza",
      role: "Alumni 2019 | Ekonomi UII",
      asal: "Loa Janan",
      quote: "Dari IPM Kukar, aku dapat keluarga, mentor, bahkan partner bisnis. Pengalaman berorganisasi di sini jadi bekal penting untuk karir profesional aku sekarang.",
      initials: "SN",
      color: "from-green-400 to-green-600",
    },
    {
      tempId: 8,
      name: "Bayu Saputra",
      role: "Alumni 2021 | Kedokteran UGM",
      asal: "Samboja",
      quote: "Eroh Bebaya, Lembuswana Cup, bakti sosial... Semua kegiatan IPM Kukar ngajarin aku tentang teamwork dan dedikasi. Pengalaman yang nggak bisa dilupain!",
      initials: "BS",
      color: "from-slate-700 to-slate-900",
    },
    {
      tempId: 9,
      name: "Dewi Lestari",
      role: "Anggota Aktif | Psikologi UNY",
      asal: "Kota Bangun",
      quote: "Sebagai mahasiswa baru di Jogja, IPM Kukar bantu aku adaptasi dengan cepat. Dari yang nggak kenal siapa-siapa, sekarang punya network luas sesama anak Kukar.",
      initials: "DL",
      color: "from-cyan-400 to-cyan-600",
    },
    {
      tempId: 10,
      name: "Muhammad Fauzi",
      role: "Alumni 2018 | Teknik Elektro UGM",
      asal: "Muara Badak",
      quote: "IPM Kukar adalah wadah sempurna untuk berkontribusi ke daerah sambil mengembangkan diri. Bangga bisa jadi bagian dari gerakan mahasiswa Kukar di Jogja!",
      initials: "MF",
      color: "from-red-500 to-orange-600",
    },
    {
      tempId: 11,
      name: "Nur Aini Rahma",
      role: "Alumni 2020 | Komunikasi UPN",
      asal: "Tenggarong Seberang",
      quote: "Dari segi softskill, networking, sampai pelestarian budaya Kukar - semua ada di IPM. Organisasi yang bener-bener prepare kita untuk masa depan!",
      initials: "NA",
      color: "from-purple-400 to-purple-600",
    },
  ])

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList]
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift()
        if (!item) return
        newList.push({ ...item, tempId: Math.random() })
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop()
        if (!item) return
        newList.unshift({ ...item, tempId: Math.random() })
      }
    }
    setTestimonialsList(newList)
  }

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)")
      setCardSize(matches ? 365 : 290)
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <section id="testimonials" className="relative py-20 bg-gradient-to-b from-white to-gray-50">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
            Testimonial
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-text-primary mb-6">
            Lihat Apa Kata{" "}
            <span className="bg-gradient-to-r from-emerald to-emerald-dark bg-clip-text text-transparent">
              ALUMNI.
            </span>{" "}
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Cerita nyata dari mahasiswa dan alumni Kukar yang telah merasakan kehangatan keluarga besar IPM Kukar Yogyakarta.
          </p>
        </motion.div>

        {/* Staggered Testimonials Carousel */}
        <div className="relative w-full overflow-hidden bg-white rounded-xl shadow-lg" style={{ height: 600 }}>
          {testimonialsList.map((testimonial, index) => {
            const position =
              testimonialsList.length % 2 ? index - (testimonialsList.length + 1) / 2 : index - testimonialsList.length / 2
            return (
              <TestimonialCard
                key={testimonial.tempId}
                testimonial={testimonial}
                handleMove={handleMove}
                position={position}
                cardSize={cardSize}
              />
            )
          })}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-20">
            <button
              onClick={() => handleMove(-1)}
              className={cn(
                "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
                "bg-white border-2 border-emerald hover:bg-emerald hover:text-white text-emerald",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2",
              )}
              aria-label="Previous testimonial"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => handleMove(1)}
              className={cn(
                "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
                "bg-white border-2 border-emerald hover:bg-emerald hover:text-white text-emerald",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2",
              )}
              aria-label="Next testimonial"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-lg text-text-secondary">
            Mau jadi bagian dari cerita sukses berikutnya?{" "}
            <a href="/bergabung" className="text-emerald hover:text-emerald-dark font-bold underline">
              Bergabung sekarang
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
