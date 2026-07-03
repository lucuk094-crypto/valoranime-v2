/**
 * Script untuk membuat admin dengan cepat (tanpa input interaktif)
 * Edit email, password, dan displayName di bawah ini, lalu jalankan:
 * npx tsx scripts/quick-create-admin.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// ============================================
// 📝 EDIT DATA ADMIN DI SINI:
// ============================================
const ADMIN_DATA = {
  email: 'alwismith76@gmail.com',       // ✏️ Ganti dengan email yang diinginkan
  password: 'Admin313',             // ✏️ Ganti dengan password baru (min 6 karakter)
  displayName: 'Alwiy313',           // ✏️ Ganti dengan nama tampilan
  role: 'Superadmin',                       // Role: Superadmin, Admin, atau User
};
// ============================================

async function main() {
  console.log('\n🚀 === QUICK CREATE ADMIN - VALORANIME ===\n');

  // Get Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diset di .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('✅ Koneksi ke Supabase berhasil!\n');

  // Validasi
  if (!ADMIN_DATA.email || !ADMIN_DATA.password) {
    console.error('❌ Error: Email dan password harus diisi di script ini!');
    console.error('   Edit file: scripts/quick-create-admin.ts\n');
    process.exit(1);
  }

  if (ADMIN_DATA.password.length < 6) {
    console.error('❌ Error: Password minimal 6 karakter!');
    process.exit(1);
  }

  console.log('📋 Data Admin yang akan dibuat:');
  console.log(`   Email: ${ADMIN_DATA.email}`);
  console.log(`   Password: ${ADMIN_DATA.password}`);
  console.log(`   Display Name: ${ADMIN_DATA.displayName}`);
  console.log(`   Role: ${ADMIN_DATA.role}\n`);

  console.log('⏳ Membuat admin...');

  try {
    // Create user dengan Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_DATA.email,
      password: ADMIN_DATA.password,
      email_confirm: true, // Auto confirm email
      user_metadata: {
        display_name: ADMIN_DATA.displayName || ADMIN_DATA.email.split('@')[0],
        role: ADMIN_DATA.role,
        level: 99,
        exp: 0,
        is_banned: false,
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.error('\n❌ Error: Email sudah terdaftar!');
        console.error('   Gunakan email lain atau hapus user lama di Supabase Dashboard\n');
        
        console.log('💡 ATAU gunakan script reset password:');
        console.log('   npm run reset-password\n');
      } else {
        console.error('\n❌ Error:', error.message);
      }
      process.exit(1);
    }

    // Create profile entry
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      display_name: ADMIN_DATA.displayName || ADMIN_DATA.email.split('@')[0],
      level: 99,
      exp: 0,
    });

    if (profileError) {
      console.log('\n⚠️ Warning: Gagal membuat profile (mungkin sudah ada):', profileError.message);
    }

    console.log('\n✅ Superadmin berhasil dibuat!');
    console.log('\n📋 Detail Admin:');
    console.log(`   ID: ${data.user.id}`);
    console.log(`   Email: ${ADMIN_DATA.email}`);
    console.log(`   Password: ${ADMIN_DATA.password}`);
    console.log(`   Display Name: ${ADMIN_DATA.displayName}`);
    console.log(`   Role: ${ADMIN_DATA.role}`);
    console.log(`   Level: 99`);
    console.log('\n🎉 Sekarang Anda bisa login di /admin/login dengan email dan password tersebut!\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
