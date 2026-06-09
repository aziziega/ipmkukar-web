"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Save, Users, TrendingUp, Calendar, Award } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Statistics {
  id: string
  active_members: number
  activities_per_year: number
  total_alumni: number
  active_departments: number
  updated_at: string
  updated_by?: {
    name: string
    email: string
  }
}

export default function StatisticsPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [activeMembers, setActiveMembers] = useState("")
  const [activitiesPerYear, setActivitiesPerYear] = useState("")
  const [totalAlumni, setTotalAlumni] = useState("")
  const [activeDepartments, setActiveDepartments] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch current statistics
  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/site-statistics")
      const data = await response.json()

      if (data.success) {
        setStatistics(data.data)
        setActiveMembers(data.data.active_members.toString())
        setActivitiesPerYear(data.data.activities_per_year.toString())
        setTotalAlumni(data.data.total_alumni.toString())
        setActiveDepartments(data.data.active_departments.toString())
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to load statistics",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Validate numeric input
  const validateInput = (value: string): boolean => {
    const num = parseInt(value)
    return !isNaN(num) && num >= 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all inputs
    if (!validateInput(activeMembers)) {
      toast({
        title: "Invalid Input",
        description: "Active members must be a positive number",
        variant: "destructive",
      })
      return
    }

    if (!validateInput(activitiesPerYear)) {
      toast({
        title: "Invalid Input",
        description: "Activities per year must be a positive number",
        variant: "destructive",
      })
      return
    }

    if (!validateInput(totalAlumni)) {
      toast({
        title: "Invalid Input",
        description: "Total alumni must be a positive number",
        variant: "destructive",
      })
      return
    }

    if (!validateInput(activeDepartments)) {
      toast({
        title: "Invalid Input",
        description: "Active departments must be a positive number",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/admin/site-statistics", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active_members: parseInt(activeMembers),
          activities_per_year: parseInt(activitiesPerYear),
          total_alumni: parseInt(totalAlumni),
          active_departments: parseInt(activeDepartments),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Statistics updated successfully",
        })
        fetchStatistics() // Refresh data
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update statistics",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating statistics:", error)
      toast({
        title: "Error",
        description: "Failed to update statistics",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Statistics</h1>
          <p className="text-gray-600 mt-1">
            Update organizational statistics displayed on the homepage
          </p>
        </div>
      </div>

      {statistics && statistics.updated_at && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-semibold">Last updated:</span>{" "}
                {new Date(statistics.updated_at).toLocaleString("id-ID")}
              </p>
              {statistics.updated_by && (
                <p>
                  <span className="font-semibold">Updated by:</span>{" "}
                  {statistics.updated_by.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Statistics</CardTitle>
          <CardDescription>
            These statistics are displayed in the footer section of the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Active Members */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <Label htmlFor="activeMembers">
                  Active Members (Anggota Aktif) *
                </Label>
              </div>
              <Input
                id="activeMembers"
                type="number"
                min="0"
                value={activeMembers}
                onChange={(e) => setActiveMembers(e.target.value)}
                required
                placeholder="30"
              />
              <p className="text-sm text-gray-500">
                Currently displayed as: <strong>{activeMembers}+</strong>
              </p>
            </div>

            {/* Activities Per Year */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <Label htmlFor="activitiesPerYear">
                  Activities Per Year (Kegiatan/Tahun) *
                </Label>
              </div>
              <Input
                id="activitiesPerYear"
                type="number"
                min="0"
                value={activitiesPerYear}
                onChange={(e) => setActivitiesPerYear(e.target.value)}
                required
                placeholder="10"
              />
              <p className="text-sm text-gray-500">
                Currently displayed as: <strong>{activitiesPerYear}+</strong>
              </p>
            </div>

            {/* Total Alumni */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <Label htmlFor="totalAlumni">
                  Total Alumni Since 2002 (Alumni Sejak 2002) *
                </Label>
              </div>
              <Input
                id="totalAlumni"
                type="number"
                min="0"
                value={totalAlumni}
                onChange={(e) => setTotalAlumni(e.target.value)}
                required
                placeholder="1000"
              />
              <p className="text-sm text-gray-500">
                Currently displayed as: <strong>{totalAlumni}+</strong>
              </p>
            </div>

            {/* Active Departments */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <Label htmlFor="activeDepartments">
                  Active Departments (Departemen Aktif) *
                </Label>
              </div>
              <Input
                id="activeDepartments"
                type="number"
                min="0"
                value={activeDepartments}
                onChange={(e) => setActiveDepartments(e.target.value)}
                required
                placeholder="6"
              />
              <p className="text-sm text-gray-500">
                Currently displayed as: <strong>{activeDepartments}</strong>
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Statistics
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
