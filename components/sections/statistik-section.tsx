"use client"

import { useEffect, useRef, useState } from "react"

export default function StatistikSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    { value: 30, label: "Anggota Aktif", suffix: "+" },
    { value: 4, label: "Departemen Aktif", suffix: "" },
    { value: 30, label: "Kegiatan Per Tahun", suffix: "+" },
    { value: 1000, label: "Alumni Sejak 2002", suffix: "+" },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isVisible) return

      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }, [isVisible, value])

    return (
      <span className="text-5xl md:text-6xl lg:text-7xl font-black text-emerald">
        {count.toLocaleString()}
        {suffix}
      </span>
    )
  }

  return (
    <section ref={sectionRef} id="statistik" className="relative py-20 bg-gold-light">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-4">
                {isVisible && <Counter value={stat.value} suffix={stat.suffix} />}
              </div>
              <p className="text-base md:text-lg font-semibold text-text-primary uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
