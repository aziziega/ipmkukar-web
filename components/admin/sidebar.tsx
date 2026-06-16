"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  BarChart3,
  Users,
  UserCog,
  FileText,
  Shield,
  X,
  FolderKanban,
  Zap,
  LogOut,
  Phone,
  ClipboardList,
  Database,
  DollarSign,
  CheckSquare,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { UpgradeV2Modal } from "@/components/admin/upgrade-v2-modal"
import { useState } from "react"

interface SidebarProps {
  userRole: "super_admin" | "admin"
  isOpen?: boolean
  onClose?: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  superAdminOnly?: boolean
  badge?: string
  onClick?: () => void
}

interface NavCategory {
  label: string
  items: NavItem[]
}

const navCategories: NavCategory[] = [
  {
    label: "UTAMA",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Hero Slides",
        href: "/admin/dashboard/hero-slides",
        icon: ImageIcon,
      },
      {
        title: "Programs",
        href: "/admin/dashboard/programs",
        icon: FolderKanban,
      },
      {
        title: "Activities",
        href: "/admin/dashboard/activities",
        icon: Calendar,
      },
      {
        title: "Testimonials",
        href: "/admin/dashboard/testimonials",
        icon: MessageSquare,
      },
      {
        title: "Statistics",
        href: "/admin/dashboard/statistics",
        icon: BarChart3,
      },
      {
        title: "Struktur Organisasi",
        href: "/admin/dashboard/struktur",
        icon: Users,
      },
      {
        title: "Departemen",
        href: "/admin/dashboard/departemen",
        icon: FolderKanban,
      },
    ],
  },
  {
    label: "MANAJEMEN",
    items: [
      {
        title: "Pendaftaran Anggota",
        href: "#",
        icon: ClipboardList,
        badge: "V2",
      },
      {
        title: "Data Kukar",
        href: "#",
        icon: Database,
        badge: "V2",
      },
      {
        title: "Keuangan",
        href: "#",
        icon: DollarSign,
        badge: "V2",
      },
      {
        title: "Absensi",
        href: "#",
        icon: CheckSquare,
        badge: "V2",
      },
    ],
  },
  {
    label: "PENGATURAN",
    items: [
      {
        title: "Import File",
        href: "#",
        icon: Upload,
        badge: "V2",
      },
      {
        title: "Admin Accounts",
        href: "/admin/dashboard/admins",
        icon: UserCog,
        superAdminOnly: true,
      },
      {
        title: "Activity Logs",
        href: "/admin/dashboard/activity-logs",
        icon: FileText,
        superAdminOnly: true,
      },
    ],
  },
]

export function Sidebar({ userRole, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if API fails
      window.location.href = '/admin/login'
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src="/logo/logo-IPM.webp" alt="IPM Kukar Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">
                Admin Dashboard
              </h2>
              <p className="text-xs text-gray-500">IPM Kukar</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Version Info */}
        <div className="px-6 py-1 border-b border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold text-gray-600">DASHBOARD V1</span>
            <Badge
              onClick={() => setShowUpgradeModal(true)}
              className="text-[9px] font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer px-2 py-0.5"
            >
              UPGRADE KE V2
            </Badge>
          </div>
          <p className="text-[9px] text-gray-400 mt-0.5">
            LAST UPDATE: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }).toUpperCase()} {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })} WIB
          </p>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="space-y-6">
            {navCategories.map((category, categoryIndex) => {
              // Filter items based on user role
              const filteredItems = category.items.filter(
                (item) => !item.superAdminOnly || userRole === "super_admin"
              )

              // Skip category if no items after filtering
              if (filteredItems.length === 0) return null

              return (
                <div key={category.label}>
                  {/* Category Label */}
                  <div className="px-3 mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {category.label}
                    </h3>
                  </div>

                  {/* Category Items */}
                  <div className="space-y-1">
                    {filteredItems.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      const isV2Item = item.badge === "V2"

                      // Render V2 items as buttons with modal
                      if (isV2Item) {
                        return (
                          <button
                            key={item.title}
                            onClick={() => setShowUpgradeModal(true)}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 flex-shrink-0" />
                              <span>{item.title}</span>
                            </div>
                            <Badge className="text-[9px] font-bold bg-red-600 hover:bg-red-700 text-white px-2 py-0.5">
                              V2
                            </Badge>
                          </button>
                        )
                      }

                      // Regular items as links
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span>{item.title}</span>
                        </Link>
                      )
                    })}

                    {/* Add Upgrade V2 Button after PENGATURAN items */}
                    {category.label === "PENGATURAN" && (
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all shadow-sm"
                      >
                        <Zap className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1 text-left">Upgrade ke V2</span>
                        <Badge className="bg-white text-red-600 text-xs px-2 py-0.5">NEW</Badge>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* Help Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
            <p className="text-xs font-medium text-emerald-900 mb-2">
              Butuh bantuan?
            </p>
            <p className="text-xs text-emerald-700 mb-3">
              Laporkan jika ada masalah langsung ke WhatsApp saya.
            </p>
            <a
              href="https://wa.me/6282153608914"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-medium text-emerald-900 hover:text-emerald-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>0821-5360-8914 (Azizi)</span>
            </a>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-gray-700 hover:text-red-600 hover:border-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Keluar</span>
          </Button>

          {/* Copyright */}
          <p className="text-center text-[10px] text-gray-400 mt-2">
            © 2026 IPM KUKAR Yogyakarta
          </p>
        </div>
      </aside>

      {/* Upgrade V2 Modal */}
      <UpgradeV2Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  )
}
