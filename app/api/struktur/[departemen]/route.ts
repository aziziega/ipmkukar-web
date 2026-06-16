import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
  kepala: DepartmentMember | null
  anggota: DepartmentMember[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: { departemen: string } }
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

    // Separate Kepala and Anggota
    const kepala = members?.find(m => m.position === 'Kepala Departemen') || null
    const anggota = members?.filter(m => m.position === 'Anggota') || []

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
