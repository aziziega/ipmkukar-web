"use client"

import { Card } from "@/components/ui/card"
import { Users, GraduationCap, Star } from "lucide-react"

export default function TentangSection() {
  const values = [
    {
      icon: Users,
      title: "Kekeluargaan",
      description: "Membangun rasa persaudaraan sesama perantau dari Kukar yang sedang berjuang di tanah rantau.",
    },
    {
      icon: GraduationCap,
      title: "Pengembangan Diri",
      description: "Mendorong prestasi akademik dan non-akademik untuk menjadi mahasiswa berprestasi.",
    },
    {
      icon: Star,
      title: "Kontribusi Nyata",
      description: "Memberi dampak positif bagi Kutai Kartanegara dan Yogyakarta melalui berbagai kegiatan.",
    },
  ]

  return (
    <section id="tentang" className="relative py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Text Content */}
          <div className="space-y-6">
            {/* Label */}
            <div className="inline-block">
              <span className="text-emerald text-sm font-bold tracking-[0.2em] uppercase">
                Tentang Kami
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-black text-text-primary leading-tight">
              Rumah Kedua untuk Mahasiswa Kukar
            </h2>

            {/* Description */}
            <div className="space-y-4 text-lg text-text-secondary leading-relaxed">
              <p>
                IPM Kukar Yogyakarta adalah organisasi daerah yang menghimpun mahasiswa asal Kabupaten Kutai Kartanegara yang sedang menempuh pendidikan di Yogyakarta.
              </p>
              <p>
                Kami hadir sebagai rumah kedua — tempat bertemu, berkembang bersama, dan mempersiapkan diri untuk kembali berkontribusi bagi Kutai Kartanegara.
              </p>
              <p className="font-semibold text-emerald">
                Sejak 2002, lebih dari 1000+ alumni telah merasakan kehangatan keluarga besar IPM Kukar Yogyakarta.
              </p>
            </div>
          </div>

          {/* Right: Value Cards */}
          <div className="space-y-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card
                  key={index}
                  className="p-6 bg-surface border-l-4 border-l-emerald border-border-custom hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-emerald" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary mb-2">
                        {value.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
