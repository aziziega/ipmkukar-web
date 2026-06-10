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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

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
}

const navItems: NavItem[] = [
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
]

export function Sidebar({ userRole, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    (item) => !item.superAdminOnly || userRole === "super_admin"
  )

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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6 text-white" />
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

        {/* Role Badge */}
        <div className="px-6 py-4">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
              userRole === "super_admin"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-blue-100 text-blue-700"
            )}
          >
            <Shield className="w-3.5 h-3.5" />
            {userRole === "super_admin" ? "Super Admin" : "Admin"}
          </div>
        </div>

        <Separator className="mx-6" />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

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
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
            <p className="text-xs font-medium text-emerald-900 mb-1">
              Need Help?
            </p>
            <p className="text-xs text-emerald-700">
              Contact super admin for assistance
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
