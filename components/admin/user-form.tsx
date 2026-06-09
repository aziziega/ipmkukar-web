"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface UserFormData {
  name: string
  email: string
  password?: string
  confirmPassword?: string
  role: 'super_admin' | 'admin'
  is_active: boolean
}

interface UserFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<UserFormData>
  onSubmit: (data: UserFormData) => void
  onCancel: () => void
  isSubmitting: boolean
}

export default function UserForm({
  mode,
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting,
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData.name || '',
    email: initialData.email || '',
    password: '',
    confirmPassword: '',
    role: initialData.role || 'admin',
    is_active: initialData.is_active !== undefined ? initialData.is_active : true,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' }
    
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { score, label: 'Weak', color: 'text-red-600' }
    if (score <= 4) return { score, label: 'Medium', color: 'text-yellow-600' }
    return { score, label: 'Strong', color: 'text-green-600' }
  }

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation (only for create mode, email is not editable in edit mode)
    if (mode === 'create') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format'
      }
    }

    // Password validation (only for create mode)
    if (mode === 'create') {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else {
        if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters'
        } else if (!/[A-Z]/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one uppercase letter'
        } else if (!/[0-9]/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one number'
        }
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSubmit(formData)
  }

  const handleChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="John Doe"
          disabled={isSubmitting}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field (read-only in edit mode) */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email {mode === 'create' && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john@example.com"
          disabled={isSubmitting || mode === 'edit'}
          readOnly={mode === 'edit'}
          className={errors.email ? 'border-red-500' : mode === 'edit' ? 'bg-gray-50' : ''}
        />
        {mode === 'edit' && (
          <p className="text-sm text-gray-500">Email cannot be changed</p>
        )}
        {errors.email && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Fields (only in create mode) */}
      {mode === 'create' && (
        <>
          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordStrength && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.score <= 2
                        ? 'bg-red-500'
                        : passwordStrength.score <= 4
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Min 8 characters, 1 uppercase, 1 number
            </p>
            {errors.password && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Passwords match
              </p>
            )}
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </>
      )}

      {/* Role Select */}
      <div className="space-y-2">
        <Label htmlFor="role">
          Role <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleChange('role', value as 'super_admin' | 'admin')}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">
          Super admins can manage other admin users
        </p>
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <Label htmlFor="is_active">Active Status</Label>
          <p className="text-sm text-gray-500">
            Inactive users cannot log in
          </p>
        </div>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleChange('is_active', checked)}
          disabled={isSubmitting}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">Saving...</span>
            </>
          ) : mode === 'create' ? (
            'Create Admin'
          ) : (
            'Save Changes'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
