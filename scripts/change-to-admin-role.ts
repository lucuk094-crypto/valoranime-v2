/**
 * Script untuk ubah role dari Developer ke Admin/Superadmin
 * Jalankan: npx tsx scripts/change-to-admin-role.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function main() {
  console.log('\n🔄 === UBAH ROLE KE ADMIN ===\n');

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

    // Step 2: Show current role
    console.log('📊 ROLE SAAT INI:');
    console.log(`   Role: ${user.user_metadata?.role || 'User'}`);
    console.log(`   Level: ${user.user_metadata?.level || 1}`);
    console.log(`   EXP: ${user.user_metadata?.exp || 0}\n`);

    // Step 3: Update to Admin role
    console.log('🔄 Mengubah role menjadi Admin...');

    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        role: 'Admin', // Bisa juga 'Superadmin' jika mau akses lebih tinggi
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

    console.log('✅ Role berhasil diubah menjadi Admin!\n');

    // Step 4: Update profiles table
    console.log('🔄 Mengupdate tabel profiles...');

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: user.user_metadata?.display_name || 'Alwiy313',
        level: 99,
        exp: 9999,
        role: 'Admin',
      }, {
        onConflict: 'id',
      });

    if (profileError) {
      console.log(`⚠️ Warning profile: ${profileError.message}`);
    } else {
      console.log('✅ Profiles table berhasil diupdate!\n');
    }

    console.log('='.repeat(60));
    console.log('\n🎉 BERHASIL!\n');
    console.log('📋 DATA ACCOUNT BARU:');
    console.log(`   Email: ${EMAIL}`);
    console.log(`   Password: Admin313`);
    console.log(`   Role: Admin ⭐ (Bukan Developer lagi)`);
    console.log(`   Level: 99`);
    console.log(`   EXP: 9999`);
    console.log(`   Verified: ✅\n`);
    
    console.log('✅ Sekarang Anda bisa login sebagai Admin!');
    console.log('   URL: https://valoranime-v2.vercel.app/admin/login\n');

    console.log('💡 Tips:');
    console.log('   - Logout dulu jika sedang login');
    console.log('   - Clear browser cache');
    console.log('   - Login ulang dengan kredensial di atas\n');

    console.log('📊 Perbedaan Admin vs Developer:');
    console.log('   Admin: Role standar untuk mengelola website');
    console.log('   Developer: Role teknis (biasanya untuk programmer)\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
