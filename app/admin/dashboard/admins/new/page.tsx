"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import UserForm from "@/components/admin/user-form"

interface UserFormData {
  name: string
  email: string
  password?: string
  confirmPassword?: string
  role: 'super_admin' | 'admin'
  is_active: boolean
}

export default function NewAdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: UserFormData) => {
    try {
      setIsSubmitting(true)

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          role: formData.role,
          is_active: formData.is_active,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Admin user created successfully",
        })
        router.push('/admin/dashboard/admins')
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create admin user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Admin</h1>
          <p className="text-gray-600 mt-1">Add a new administrator to the system</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Details</CardTitle>
          <CardDescription>
            Fill in the information below to create a new admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}
