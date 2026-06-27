"use client"

import { Instagram, Youtube, Mail, MapPin } from "lucide-react"
import { FaTiktok as FaTiktokRaw, FaWhatsapp as FaWhatsappRaw } from "react-icons/fa"
const FaTiktok = FaTiktokRaw as any
const FaWhatsapp = FaWhatsappRaw as any
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-emerald-dark to-emerald-deeper text-white py-16 border-t border-white/10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Column 1: Brand/About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo/logo-IPM.webp"
                alt="IPM Kukar Logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <div className="text-white font-black text-xl tracking-wide leading-tight">
                  IPM KUKAR
                </div>
                <div className="text-gold text-xs font-semibold">Yogyakarta</div>
              </div>
            </div>
            <p className="text-gold font-semibold mb-2">"Dari Kukar, untuk Kukar"</p>
            <p className="text-white/60 text-sm leading-relaxed">
              Ikatan Pelajar Mahasiswa Kutai Kartanegara di Yogyakarta. Keluarga besar mahasiswa Kukar sejak 2002.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wide text-sm">Navigasi</h4>
            <div className="space-y-3">
              <Link
                href="/home"
                className="block text-white/70 hover:text-gold transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                href="/visi-misi"
                className="block text-white/70 hover:text-gold transition-colors text-sm"
              >
                Visi & Misi
              </Link>
              <Link
                href="/struktur"
                className="block text-white/70 hover:text-gold transition-colors text-sm"
              >
                Struktur Organisasi
              </Link>
              <Link
                href="/home#proker"
                className="block text-white/70 hover:text-gold transition-colors text-sm"
              >
                Program Kerja
              </Link>
              <Link
                href="/home#kegiatan"
                className="block text-white/70 hover:text-gold transition-colors text-sm"
              >
                Kegiatan
              </Link>
            </div>
          </div>

          {/* Column 3: Contact & Social */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wide text-sm">Kontak</h4>
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin size={16} className="text-gold mt-1 flex-shrink-0" />
                <span>Yogyakarta, Indonesia</span>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <Mail size={16} className="text-gold mt-1 flex-shrink-0" />
                <a
                  href="mailto:ipmkukaryogyakarta@gmail.com"
                  className="hover:text-gold transition-colors break-all"
                >
                  ipmkukaryogyakarta@gmail.com
                </a>
              </div>

              {/* Social Media */}
              <div>
                <p className="text-xs text-white/50 mb-3 uppercase tracking-wide">Follow Us</p>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/ipm_kukarjogja/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all group"
                  >
                    <Instagram size={16} className="text-white group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all group"
                  >
                    <FaTiktok size={14} className="text-white group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all group"
                  >
                    <Youtube size={16} className="text-white group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center transition-all group"
                  >
                    <FaWhatsapp size={16} className="text-white group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="pt-8 border-t border-white/10 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
            <p>© 2026 IPM Kukar Yogyakarta. All rights reserved.</p>
            <p>
              Developed by{" "}
              <a
                href="https://aziziem.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light transition-colors font-semibold"
              >
                Azizi
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
