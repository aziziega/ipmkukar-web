"use client"

import { Card } from "@/components/ui/card"
import { Target, Users2, Link, Rocket } from "lucide-react"

export default function VisiMisiSection() {
  const misi = [
    {
      icon: Users2,
      text: "Menghimpun dan mempererat silaturahmi mahasiswa asal Kutai Kartanegara di Yogyakarta",
    },
    {
      icon: Rocket,
      text: "Mengembangkan potensi akademik, kepemimpinan, dan kewirausahaan anggota",
    },
    {
      icon: Link,
      text: "Menjadi jembatan antara mahasiswa Kukar dengan pemerintah daerah dan stakeholder",
    },
    {
      icon: Target,
      text: "Mendorong anggota untuk aktif berkontribusi bagi pembangunan Kutai Kartanegara",
    },
  ]

  return (
    <section id="visi-misi" className="relative py-20 bg-emerald-dark">
      <div className="container mx-auto px-6">
        {/* Visi Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">
              Visi Kami
            </span>
          </div>

          {/* Decorative Gold Line Top */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-0.5 w-20 bg-gold"></div>
            <div className="h-1 w-1 bg-gold rounded-full mx-2"></div>
            <div className="h-0.5 w-20 bg-gold"></div>
          </div>

          {/* Visi Statement */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-5xl mx-auto leading-relaxed">
            Terwujudnya mahasiswa Kutai Kartanegara yang berprestasi, berkarakter, dan siap berkontribusi bagi pembangunan daerah.
          </h2>

          {/* Decorative Gold Line Bottom */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-0.5 w-20 bg-gold"></div>
            <div className="h-1 w-1 bg-gold rounded-full mx-2"></div>
            <div className="h-0.5 w-20 bg-gold"></div>
          </div>
        </div>

        {/* Misi Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <span className="text-gold text-sm font-bold tracking-[0.2em] uppercase">
              Misi Kami
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {misi.map((item, index) => {
              const Icon = item.icon
              return (
                <Card
                  key={index}
                  className="p-6 bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <p className="text-white text-base leading-relaxed flex-1">
                      {item.text}
                    </p>
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
