"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"

export default function KegiatanSection() {
  const activities = [
    {
      title: "Eroh Bebaya",
      description: "Event budaya tahunan terbesar IPM Kukar menampilkan seni, musik, dan kuliner khas Kutai Kartanegara",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
    },
    {
      title: "Lembuswana Cup",
      description: "Turnamen olahraga antar mahasiswa Kukar untuk mempererat silaturahmi dan sportivitas",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
    },
    {
      title: "Bakti Sosial Jogja",
      description: "Kegiatan pengabdian masyarakat di Yogyakarta sebagai wujud kepedulian sosial IPM Kukar",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop",
    },
    {
      title: "Pelatihan Kepemimpinan",
      description: "Workshop dan training untuk mengembangkan soft skills dan leadership anggota",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    },
    {
      title: "Penerimaan Anggota Baru",
      description: "Open recruitment dan orientasi untuk mahasiswa Kukar yang baru kuliah di Yogyakarta",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop",
    },
    {
      title: "Malam Keakraban",
      description: "Gathering dan acara kekeluargaan untuk mempererat tali persaudaraan sesama anggota",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop",
    },
  ]

  return (
    <section id="kegiatan" className="relative py-20 bg-surface">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald text-sm font-bold tracking-[0.2em] uppercase">
            Kegiatan & Galeri
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary mt-4">
            Jejak Kegiatan Kami
          </h2>
        </motion.div>

        {/* Activities Grid with Staggered Animation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-xl border border-border-custom hover:border-emerald transition-all duration-300 bg-white"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deeper via-emerald-deeper/50 to-transparent opacity-70"></div>
                
                {/* Title on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {activity.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <div className="p-4">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-emerald text-emerald hover:bg-emerald hover:text-white font-semibold px-8 transition-all duration-300"
            >
              Lihat Semua Kegiatan
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
