import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface DepartmentWithStats {
  id: string
  slug: string
  name: string
  full_name: string
  description: string | null
  color: string
  icon: string
  period: string
  order_index: number
  is_active: boolean
  kepala_count: number
  anggota_count: number
  total_members: number
}

/**
 * GET /api/admin/departemen
 * Fetch all departments with member statistics
 * Requires authentication
 */
export async function GET() {
  try {
    // Fetch all departments
    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .select('*')
      .order('order_index', { ascending: true })

    if (deptError) {
      console.error('Error fetching departments:', deptError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch departments' },
        { status: 500 }
      )
    }

    if (!departments || departments.length === 0) {
      return NextResponse.json(
        { success: true, departments: [] },
        { status: 200 }
      )
    }

    // Fetch member counts for each department
    const { data: memberCounts, error: countError } = await supabase
      .from('department_members')
      .select('department_id, position')
      .eq('is_active', true)

    if (countError) {
      console.error('Error fetching member counts:', countError)
      // Continue without counts if error
    }

    // Calculate stats for each department
    const departmentsWithStats: DepartmentWithStats[] = departments.map(dept => {
      const deptMembers = memberCounts?.filter(m => m.department_id === dept.id) || []
      const kepalaCount = deptMembers.filter(m => m.position === 'Kepala Departemen').length
      const anggotaCount = deptMembers.filter(m => m.position === 'Anggota').length

      return {
        ...dept,
        kepala_count: kepalaCount,
        anggota_count: anggotaCount,
        total_members: kepalaCount + anggotaCount,
      }
    })

    return NextResponse.json(
      { success: true, departments: departmentsWithStats },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in departments API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
