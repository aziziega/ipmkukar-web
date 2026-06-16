import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Department {
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
}

interface DepartmentMember {
  id: string
  department_id: string
  name: string
  position: string
  photo: string | null
  nim: string | null
  bio: string | null
  email: string | null
  phone: string | null
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface DepartmentDetail {
  department: Department
  kepala: DepartmentMember | null
  anggota: DepartmentMember[]
}

/**
 * GET /api/admin/departemen/[slug]
 * Fetch department detail with all members (kepala + anggota)
 * Requires authentication
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params

    // Validate slug
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid department slug' },
        { status: 400 }
      )
    }

    // Fetch department info
    const { data: department, error: deptError } = await supabase
      .from('departments')
      .select('*')
      .eq('slug', slug)
      .single()

    if (deptError || !department) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Department not found',
          message: `Department '${slug}' does not exist`
        },
        { status: 404 }
      )
    }

    // Fetch all members for this department
    const { data: members, error: membersError } = await supabase
      .from('department_members')
      .select('*')
      .eq('department_id', department.id)
      .order('order_index', { ascending: true })

    if (membersError) {
      console.error('Error fetching members:', membersError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch department members' },
        { status: 500 }
      )
    }

    // Separate kepala and anggota
    const kepala = members?.find(m => m.position === 'Kepala Departemen' && m.is_active) || null
    const anggota = members?.filter(m => m.position === 'Anggota' && m.is_active) || []

    const response: DepartmentDetail = {
      department,
      kepala,
      anggota,
    }

    return NextResponse.json(
      { success: true, data: response },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in department detail API:', error)
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

/**
 * PUT /api/admin/departemen/[slug]
 * Update department information (currently supports period update)
 * Requires authentication
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { period } = body

    // Validate slug
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid department slug' },
        { status: 400 }
      )
    }

    // Validate period
    if (!period || typeof period !== 'string' || !period.trim()) {
      return NextResponse.json(
        { success: false, error: 'Period is required' },
        { status: 400 }
      )
    }

    // Fetch department to ensure it exists
    const { data: department, error: deptError } = await supabase
      .from('departments')
      .select('id')
      .eq('slug', slug)
      .single()

    if (deptError || !department) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      )
    }

    // Update period
    const { error: updateError } = await supabase
      .from('departments')
      .update({ 
        period: period.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)

    if (updateError) {
      console.error('Error updating department:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update period' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Period updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in PUT department API:', error)
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
