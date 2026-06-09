import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env' })

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

async function seedSuperAdmin() {
  console.log('🌱 Seeding Super Admin account...\n')

  // Super Admin credentials from .env
  const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@ipmkukar.com'
  const password = process.env.SUPER_ADMIN_PASSWORD || 'superadmin1'
  const name = 'Super Admin'

  try {
    // Check if super admin already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      console.log('⚠️  Super Admin already exists!')
      console.log(`📧 Email: ${email}`)
      console.log('\n✅ You can login with existing credentials.\n')
      return
    }

    // Hash password with bcrypt
    console.log('🔐 Hashing password...')
    const password_hash = await bcrypt.hash(password, 10)
    console.log('✅ Password hashed successfully\n')

    // Insert super admin user
    console.log('📝 Creating Super Admin user...')
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash,
        name,
        role: 'super_admin',
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating super admin:', error)
      throw error
    }

    console.log('✅ Super Admin created successfully!\n')
    console.log('═══════════════════════════════════════')
    console.log('📋 Login Credentials:')
    console.log('═══════════════════════════════════════')
    console.log(`📧 Email:    ${email}`)
    console.log(`🔑 Password: ${password}`)
    console.log(`🔗 Login at: http://localhost:3000/admin/login`)
    console.log('═══════════════════════════════════════\n')
    console.log('✨ You can now login to the admin dashboard!\n')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

// Run seed
seedSuperAdmin()
  .then(() => {
    console.log('🎉 Seed completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seed failed:', error)
    process.exit(1)
  })
