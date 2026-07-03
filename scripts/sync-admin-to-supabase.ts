/**
 * Script untuk sync data admin dari quick-create-admin.ts ke Supabase
 * Jika email sudah ada, akan update data. Jika belum ada, akan create baru.
 * 
 * Jalankan: npx tsx scripts/sync-admin-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Data admin dari quick-create-admin.ts
const ADMIN_DATA = {
  email: 'alwismith76@gmail.com',
  password: 'Admin313',
  displayName: 'Alwiy313',
  role: 'Superadmin',
  level: 99,
  exp: 0,
};

async function main() {
  console.log('\n🔄 === SYNC ADMIN DATA KE SUPABASE ===\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Environment variables tidak ditemukan!');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('✅ Koneksi ke Supabase berhasil!\n');

  console.log('📋 Data Admin yang akan di-sync:');
  console.log(`   Email: ${ADMIN_DATA.email}`);
  console.log(`   Password: ${ADMIN_DATA.password}`);
  console.log(`   Display Name: ${ADMIN_DATA.displayName}`);
  console.log(`   Role: ${ADMIN_DATA.role}`);
  console.log(`   Level: ${ADMIN_DATA.level}\n`);

  try {
    // Step 1: Cek apakah email sudah terdaftar
    console.log('🔍 Mengecek apakah email sudah terdaftar...');
    
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Gagal mengecek users: ${listError.message}`);
    }

    const existingUser = existingUsers.users.find(u => u.email === ADMIN_DATA.email);

    if (existingUser) {
      // USER SUDAH ADA - UPDATE DATA
      console.log(`✅ User dengan email ${ADMIN_DATA.email} sudah ada!`);
      console.log(`   User ID: ${existingUser.id}\n`);
      
      console.log('🔄 Mengupdate data user...');

      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
        password: ADMIN_DATA.password,
        user_metadata: {
          display_name: ADMIN_DATA.displayName,
          role: ADMIN_DATA.role,
          level: ADMIN_DATA.level,
          exp: ADMIN_DATA.exp,
          is_banned: false,
        },
      });

      if (updateError) {
        throw new Error(`Gagal update user: ${updateError.message}`);
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: existingUser.id,
          username: ADMIN_DATA.displayName,
          level: ADMIN_DATA.level,
          exp: ADMIN_DATA.exp,
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.log(`⚠️ Warning profile: ${profileError.message}`);
      } else {
        console.log('✅ Profile table berhasil di-update!');
      }

      console.log('\n✅ USER BERHASIL DI-UPDATE!\n');
      console.log('📋 Detail Admin:');
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Email: ${ADMIN_DATA.email}`);
      console.log(`   Password BARU: ${ADMIN_DATA.password}`);
      console.log(`   Display Name: ${ADMIN_DATA.displayName}`);
      console.log(`   Role: ${ADMIN_DATA.role}`);
      console.log(`   Level: ${ADMIN_DATA.level}`);
      console.log(`   EXP: ${ADMIN_DATA.exp}`);

    } else {
      // USER BELUM ADA - CREATE BARU
      console.log(`ℹ️ Email ${ADMIN_DATA.email} belum terdaftar.\n`);
      console.log('➕ Membuat admin baru...');

      const { data, error: createError } = await supabase.auth.admin.createUser({
        email: ADMIN_DATA.email,
        password: ADMIN_DATA.password,
        email_confirm: true,
        user_metadata: {
          display_name: ADMIN_DATA.displayName,
          role: ADMIN_DATA.role,
          level: ADMIN_DATA.level,
          exp: ADMIN_DATA.exp,
          is_banned: false,
        },
      });

      if (createError) {
        throw new Error(`Gagal create user: ${createError.message}`);
      }

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username: ADMIN_DATA.displayName,
        level: ADMIN_DATA.level,
        exp: ADMIN_DATA.exp,
      });

      if (profileError) {
        console.log(`⚠️ Warning profile: ${profileError.message}`);
      } else {
        console.log('✅ Profile table berhasil dibuat!');
      }

      console.log('\n✅ ADMIN BARU BERHASIL DIBUAT!\n');
      console.log('📋 Detail Admin:');
      console.log(`   ID: ${data.user.id}`);
      console.log(`   Email: ${ADMIN_DATA.email}`);
      console.log(`   Password: ${ADMIN_DATA.password}`);
      console.log(`   Display Name: ${ADMIN_DATA.displayName}`);
      console.log(`   Role: ${ADMIN_DATA.role}`);
      console.log(`   Level: ${ADMIN_DATA.level}`);
      console.log(`   EXP: ${ADMIN_DATA.exp}`);
    }

    console.log('\n🎉 Sekarang Anda bisa login di /admin/login!\n');
    console.log('🔗 Login URL: https://valoranime-v2.vercel.app/admin/login\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
