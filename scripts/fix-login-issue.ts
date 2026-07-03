/**
 * Script untuk fix login issue & set ulang password
 * Jalankan: npx tsx scripts/fix-login-issue.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function main() {
  console.log('\n🔧 === FIX LOGIN ISSUE ===\n');

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

  try {
    const EMAIL = 'alwismith76@gmail.com';
    const NEW_PASSWORD = 'Admin313';

    // Step 1: Get user
    console.log(`🔍 Mencari user: ${EMAIL}`);
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Gagal mengambil users: ${listError.message}`);
    }

    const user = authUsers.users.find(u => u.email === EMAIL);

    if (!user) {
      console.error(`\n❌ User dengan email ${EMAIL} tidak ditemukan!`);
      process.exit(1);
    }

    console.log(`✅ User ditemukan: ${user.id}\n`);

    // Step 2: Check current role
    console.log('📊 DATA SAAT INI:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.user_metadata?.role || 'TIDAK ADA'}`);
    console.log(`   Level: ${user.user_metadata?.level || 'TIDAK ADA'}`);
    console.log(`   EXP: ${user.user_metadata?.exp || 'TIDAK ADA'}`);
    console.log(`   Is Banned: ${user.user_metadata?.is_banned || false}\n`);

    // Step 3: Update password & ensure Developer role
    console.log('🔄 Mengupdate password & role...');

    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: NEW_PASSWORD,
      user_metadata: {
        ...user.user_metadata,
        role: 'Developer',
        level: 99,
        exp: 9999,
        display_name: user.user_metadata?.display_name || 'Alwiy313',
        is_verified: true,
        is_banned: false,
      },
    });

    if (updateError) {
      throw new Error(`Gagal update: ${updateError.message}`);
    }

    console.log('✅ Password & role berhasil diupdate!\n');

    // Step 4: Update profiles table
    console.log('🔄 Mengupdate tabel profiles...');

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: user.user_metadata?.display_name || 'Alwiy313',
        level: 99,
        exp: 9999,
        role: 'Developer',
      }, {
        onConflict: 'id',
      });

    if (profileError) {
      console.log(`⚠️ Warning profile: ${profileError.message}`);
    } else {
      console.log('✅ Profiles table berhasil diupdate!\n');
    }

    console.log('='.repeat(60));
    console.log('\n🎉 FIX SELESAI!\n');
    console.log('📋 DATA LOGIN BARU:');
    console.log(`   Email: ${EMAIL}`);
    console.log(`   Password: ${NEW_PASSWORD}`);
    console.log(`   Role: Developer`);
    console.log(`   Level: 99`);
    console.log(`   EXP: 9999\n`);
    
    console.log('⏰ TUNGGU 2-3 MENIT untuk Vercel deploy selesai, lalu:');
    console.log('   1. Buka: https://valoranime-v2.vercel.app/admin/login');
    console.log('   2. Login dengan email & password di atas');
    console.log('   3. Seharusnya berhasil! ✅\n');

    console.log('💡 Jika masih error:');
    console.log('   - Clear browser cache (Ctrl+Shift+Delete)');
    console.log('   - Coba browser incognito/private');
    console.log('   - Cek console browser untuk error message\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
