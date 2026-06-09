import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { clearAuthCookie, getCurrentUser } from '@/lib/auth'

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(request: NextRequest) {
  try {
    // Get current user from token
    const { user } = await getCurrentUser(request)

    // Log activity if user was authenticated
    if (user) {
      const clientIp = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown'

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'logout',
        entity_type: 'user',
        entity_id: user.id,
        details: {
          email: user.email,
        },
        ip_address: clientIp,
      })
    }

    // Clear auth cookie
    await clearAuthCookie()

    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    
    // Even if logging fails, clear the cookie
    await clearAuthCookie()
    
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    )
  }
}
