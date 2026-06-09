"use client"

import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { motion } from "framer-motion"

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 bg-white">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-wider text-gray-900 mb-6">
            Apa Kata{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">ALUMNI & ANGGOTA</span>{" "}
            Kami
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Testimoni nyata dari alumni dan anggota IPM Kukar Yogyakarta yang telah merasakan pengalaman berkesan bersama kami.
          </p>
        </motion.div>

        <StaggerTestimonials />
      </div>
    </section>
  )
}
