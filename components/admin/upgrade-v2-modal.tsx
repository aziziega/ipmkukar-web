"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Phone, X } from "lucide-react"

interface UpgradeV2ModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradeV2Modal({ isOpen, onClose }: UpgradeV2ModalProps) {
  // Top 8 Priority Features from V2 Backlog
  const benefits = [
    {
      title: "Form & Database Terpusat",
      description: "Gantikan Google Forms & spreadsheet dengan sistem terintegrasi"
    },
    {
      title: "Presensi Digital (QR Code)",
      description: "Absensi kegiatan otomatis dengan scanning QR code"
    },
    {
      title: "Open Recruitment System",
      description: "Sistem pendaftaran anggota baru yang profesional & terstruktur"
    },
    {
      title: "Public Program Calendar",
      description: "Kalender interaktif untuk showcase kegiatan ke publik"
    },
    {
      title: "Financial Management",
      description: "Sistem keuangan lengkap dengan approval workflow & reporting"
    },
    {
      title: "Real-time Analytics",
      description: "Dashboard analytics untuk monitoring performa organisasi"
    },
    {
      title: "Pendataan Anak Kukar",
      description: "Database mahasiswa Kukar untuk keperluan pemerintah"
    },
    {
      title: "Document Auto-Generation",
      description: "Generate SK, sertifikat, dan dokumen lain secara otomatis"
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto md:max-h-none md:overflow-visible bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 text-white p-0 my-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
        >
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-white mb-2">
              Upgrade ke Dashboard V2
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-base">
              Tingkatkan performa organisasi Anda dengan fitur eksklusif di versi terbaru.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Benefits Section */}
        <div className="px-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white mb-1">{benefit.title}</p>
                  <p className="text-xs text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 border-t border-white/10">
          <div className="text-center mb-4">
            <p className="text-sm font-semibold text-gray-300 mb-1">
              Dapatkan Penawaran Spesial & Konsultasi Gratis
            </p>
            <p className="text-xs text-gray-400">
              Hubungi admin untuk detail biaya dan fitur eksklusif
            </p>
          </div>

          <Button
            onClick={() => {
              // Placeholder - contact info to be provided
              window.open("https://wa.me/6282153608914", "_blank")
            }}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-6 text-base shadow-lg"
          >
            <Phone className="w-5 h-5 mr-2" />
            Hubungi Admin (0821-5360-8914)
          </Button>

          <p className="text-xs text-center text-gray-500 mt-3">
            * Fitur dan harga dapat berubah sewaktu-waktu
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
