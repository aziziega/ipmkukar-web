import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getDepartmentHeadData, DepartmentHeadData } from '@/lib/department-mapping'

interface Department {
  id: string
  slug: string
  name: string
  full_name: string
  description: string | null
  color: string
  icon: string
  period: string
}

interface DepartmentMember {
  id: string
  name: string
  position: string
  photo: string | null
  nim: string | null
  bio: string | null
  email: string | null
  phone: string | null
  order_index: number
}

interface DepartmentDetail {
  department: Department
  kepala: DepartmentHeadData | null
  anggota: DepartmentMember[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ departemen: string }> }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { departemen } = await params

    // Validate slug format
    if (!departemen || typeof departemen !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid department slug' },
        { status: 400 }
      )
    }

    // Fetch department info
    const { data: department, error: deptError } = await supabase
      .from('departments')
      .select('*')
      .eq('slug', departemen)
      .eq('is_active', true)
      .single()

    if (deptError || !department) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Department not found',
          message: `Department '${departemen}' does not exist or is not active`
        },
        { status: 404 }
      )
    }

    // Fetch organizational structure to get kepala
    const { data: structure, error: structureError } = await supabase
      .from('organizational_structure')
      .select('*')
      .eq('is_active', true)
      .single()

    if (structureError) {
      console.error('Error fetching organizational structure:', structureError)
      // Continue without kepala if structure not found
    }

    // Get kepala from organizational structure (not from department_members)
    const kepala = structure ? getDepartmentHeadData(structure, departemen) : null

    // Fetch all members for this department
    const { data: members, error: membersError } = await supabase
      .from('department_members')
      .select('*')
      .eq('department_id', department.id)
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (membersError) {
      console.error('Error fetching department members:', membersError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch department members' },
        { status: 500 }
      )
    }

    // Filter out any remaining Kepala entries (should not exist after migration)
    // Only return Anggota members
    const anggota = members?.filter(m => m.position !== 'Kepala Departemen') || []

    const response: DepartmentDetail = {
      department: {
        id: department.id,
        slug: department.slug,
        name: department.name,
        full_name: department.full_name,
        description: department.description,
        color: department.color,
        icon: department.icon,
        period: department.period,
      },
      kepala,
      anggota,
    }

    return NextResponse.json(
      { success: true, data: response },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('Error in department API:', error)
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
