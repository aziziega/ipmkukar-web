"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Key } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import UserForm from "@/components/admin/user-form"
import ResetPasswordModal from "@/components/admin/reset-password-modal"

interface UserFormData {
  name: string
  email: string
  password?: string
  confirmPassword?: string
  role: 'super_admin' | 'admin'
  is_active: boolean
}

interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin'
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export default function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/users/${id}`)
      const data = await response.json()

      if (data.success) {
        setUser(data.user)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch user",
          variant: "destructive",
        })
        router.push('/admin/dashboard/admins')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      toast({
        title: "Error",
        description: "Failed to fetch user",
        variant: "destructive",
      })
      router.push('/admin/dashboard/admins')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (formData: UserFormData) => {
    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          is_active: formData.is_active,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Admin user updated successfully",
        })
        router.push('/admin/dashboard/admins')
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update admin user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating admin:', error)
      toast({
        title: "Error",
        description: "Failed to update admin user",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (password: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Password reset successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to reset password",
          variant: "destructive",
        })
        throw new Error(data.error)
      }
    } catch (error) {
      throw error
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Edit Admin User</h1>
          <p className="text-gray-600 mt-1">Update administrator information</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowResetPassword(true)}
          className="gap-2"
        >
          <Key className="w-4 h-4" />
          Reset Password
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Details</CardTitle>
          <CardDescription>
            Update the information below to modify the admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            mode="edit"
            initialData={{
              name: user.name,
              email: user.email,
              role: user.role,
              is_active: user.is_active,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>

      <ResetPasswordModal
        open={showResetPassword}
        onClose={() => setShowResetPassword(false)}
        onConfirm={handleResetPassword}
        userName={user.name}
      />
    </div>
  )
}
