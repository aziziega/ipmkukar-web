"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TimelineEntry {
  id: number
  images: string[]
  alt: string
  department: string
  badge: string
  badgeColor: string
  programs: string[]
  description: string
  layout: "left" | "right"
}

interface TimelineItemProps {
  entry: TimelineEntry
  index: number
}

function TimelineItem({ entry, index }: TimelineItemProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: itemProgress } = useScroll({
    target: itemRef,
    offset: ["start center", "end center"],
  })

  const opacity = useTransform(itemProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])
  const scale = useTransform(itemProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8])

  const isLeft = entry.layout === "left"

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % entry.images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + entry.images.length) % entry.images.length)
  }

  // Touch handlers for swipe gesture
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  return (
    <motion.div ref={itemRef} style={{ opacity, scale }} className="relative mb-20 md:mb-32">
      {/* Timeline Dot */}
      <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-emerald rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block shadow-lg" />

      <div className="container mx-auto px-6">
        <div
          className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center", {
            "md:text-right": isLeft,
          })}
        >
          {/* Image Carousel */}
          <div
            className={cn("relative", {
              "md:order-2": isLeft,
              "md:order-1": !isLeft,
            })}
          >
            <div className="sticky top-20">
              <div 
                className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100 border-2 border-gray-200 shadow-xl group touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Images */}
                {entry.images.map((image, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      idx === currentSlide ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${entry.alt} - Photo ${idx + 1}`}
                      className="w-full h-full object-cover select-none"
                      draggable={false}
                    />
                  </div>
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deeper/60 via-transparent to-transparent" />

                {/* Badge Overlay */}
                <div className="absolute top-6 left-6 z-20">
                  <Badge className={`${entry.badgeColor} text-sm px-4 py-1`}>
                    {entry.badge}
                  </Badge>
                </div>

                {/* Navigation Arrows - Always visible on mobile, hover on desktop */}
                {entry.images.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                    </button>
                  </>
                )}

                {/* Slide Indicators - Flexible layout for any number of images */}
                {entry.images.length > 1 && (
                  <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 md:gap-2.5 max-w-[90%] md:max-w-md">
                    {entry.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={cn(
                          "rounded-full transition-all duration-300 flex-shrink-0",
                          entry.images.length >= 5 ? "w-1.5 h-1.5 md:w-2 md:h-2" : "w-2 h-2 md:w-2.5 md:h-2.5",
                          idx === currentSlide
                            ? entry.images.length >= 5 
                              ? "bg-white w-4 md:w-5" 
                              : "bg-white w-5 md:w-6"
                            : "bg-white/50 hover:bg-white/75 active:bg-white"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={cn("relative", {
              "md:order-1": isLeft,
              "md:order-2": !isLeft,
            })}
          >
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-text-primary">
                  {entry.department}
                </h3>
                <p className="text-lg md:text-xl leading-relaxed text-text-secondary">
                  {entry.description}
                </p>

                {/* Programs List */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-sm font-bold text-emerald uppercase tracking-wider">
                    Program Utama:
                  </h4>
                  <ul className="space-y-2">
                    {entry.programs.map((program, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald mt-2" />
                        <span className="text-base text-text-secondary leading-relaxed">
                          {program}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProgramSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const departments: TimelineEntry[] = [
    {
      id: 1,
      images: [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop",
      ],
      alt: "Seni dan Budaya Kukar",
      department: "Seni dan Budaya",
      badge: "Seni & Budaya",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      programs: [
        "Pagelaran Seni Kukar - Pentas seni dan pameran budaya tahunan",
        "Festival Budaya Kukar - Showcase kuliner, tari, dan musik khas",
        "Lomba Seni Tradisional - Kompetisi seni untuk melestarikan budaya",
      ],
      description: "Mengembangkan dan melestarikan seni serta budaya Kutai Kartanegara melalui berbagai kegiatan kreatif dan pertunjukan yang membanggakan.",
      layout: "left",
    },
    {
      id: 2,
      images: [
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop",
      ],
      alt: "Sosial dan Keagamaan",
      department: "Sosial dan Keagamaan",
      badge: "Sosial",
      badgeColor: "bg-green-100 text-green-700 border-green-200",
      programs: [
        "Bakti Sosial - Pengabdian masyarakat di Yogyakarta dan Kukar",
        "Kajian & Silaturahmi - Forum diskusi dan pertemuan rutin bulanan",
        "Santunan Anak Yatim - Program kepedulian sosial berkelanjutan",
      ],
      description: "Membangun kepedulian sosial dan memperkuat nilai-nilai keagamaan melalui kegiatan yang bermanfaat bagi masyarakat dan sesama anggota.",
      layout: "right",
    },
    {
      id: 3,
      images: [
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
      ],
      alt: "Informasi dan Komunikasi",
      department: "Informasi dan Komunikasi",
      badge: "Infokom",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
      programs: [
        "Konten Kreatif - Produksi konten media sosial dan publikasi digital",
        "Dokumentasi Kegiatan - Foto dan video dokumentasi profesional",
        "Media Relations - Pengelolaan komunikasi eksternal dan branding",
      ],
      description: "Mengelola komunikasi, publikasi, dan dokumentasi organisasi untuk meningkatkan visibilitas dan engagement IPM Kukar Yogyakarta.",
      layout: "left",
    },
    {
      id: 4,
      images: [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&h=600&fit=crop",
      ],
      alt: "Pengembangan Organisasi",
      department: "Pengembangan Organisasi",
      badge: "Pengembangan",
      badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
      programs: [
        "Pelatihan Kepemimpinan - Workshop dan training soft skills",
        "Kaderisasi Anggota - Orientasi dan pembinaan anggota baru",
        "Leadership Camp - Program pengembangan karakter dan leadership",
      ],
      description: "Merancang program kaderisasi dan pengembangan kapasitas anggota untuk mempersiapkan pemimpin masa depan yang berkualitas.",
      layout: "right",
    },
    {
      id: 5,
      images: [
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop",
      ],
      alt: "Departemen Olahraga",
      department: "Departemen Olahraga",
      badge: "Olahraga",
      badgeColor: "bg-red-100 text-red-700 border-red-200",
      programs: [
        "Lembuswana Cup - Turnamen olahraga tahunan antar mahasiswa Kukar",
        "Futsal & Badminton - Kompetisi olahraga rutin dan friendly match",
        "Senam Sehat Bersama - Kegiatan olahraga dan kesehatan mingguan",
        "Sports Day - Event olahraga massal dan team building",
      ],
      description: "Membangun semangat sportivitas dan kesehatan melalui berbagai kegiatan olahraga yang menyenangkan dan kompetitif untuk seluruh anggota.",
      layout: "left",
    },
    {
      id: 6,
      images: [
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      ],
      alt: "Departemen Kajian Strategi dan Pendidikan",
      department: "Kajian Strategi dan Pendidikan",
      badge: "Kajian & Pendidikan",
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
      programs: [
        "Seminar & Diskusi - Forum kajian isu terkini dan strategis daerah",
        "Riset Kutai Kartanegara - Penelitian dan publikasi tentang Kukar",
        "Workshop Akademik - Pelatihan metodologi penelitian dan penulisan",
        "Bedah Buku - Diskusi literatur dan pengembangan intelektual",
      ],
      description: "Mengembangkan kapasitas intelektual dan pemikiran strategis anggota melalui kajian, riset, dan diskusi yang berkontribusi pada pembangunan daerah.",
      layout: "right",
    },
  ]

  return (
    <section id="proker" className="relative py-20 bg-white">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

      {/* Section Header */}
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-emerald text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
            Program Kerja
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6">
            Program <span className="text-emerald">6 Departemen</span>
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Setiap departemen memiliki program unggulan yang dirancang untuk mengembangkan potensi anggota dan memberi dampak positif.
          </p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div ref={containerRef} className="relative">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald/30 transform -translate-x-1/2 hidden md:block" />

        {departments.map((entry, index) => (
          <TimelineItem key={entry.id} entry={entry} index={index} />
        ))}
      </div>
    </section>
  )
}
