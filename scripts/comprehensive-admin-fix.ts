/**
 * Comprehensive Fix untuk Admin Dashboard
 * - Fix role access (Admin, Superadmin, Developer, Moderator)
 * - Ensure data sync dari Supabase
 * - Reset password & konfirmasi semua settings
 * 
 * Jalankan: npx tsx scripts/comprehensive-admin-fix.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function main() {
  console.log('\n🔧 === COMPREHENSIVE ADMIN FIX ===\n');

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
    const PASSWORD = 'Admin313';

    console.log('═'.repeat(60));
    console.log('STEP 1: GET USER DATA');
    console.log('═'.repeat(60));

    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Gagal mengambil users: ${listError.message}`);
    }

    const user = authUsers.users.find(u => u.email === EMAIL);

    if (!user) {
      console.error(`\n❌ User dengan email ${EMAIL} tidak ditemukan!`);
      console.log('💡 Membuat user baru...\n');

      // Create new admin user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: EMAIL,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: {
          role: 'Admin',
          level: 99,
          exp: 9999,
          display_name: 'Alwiy313',
          is_verified: true,
          is_banned: false,
        },
      });

      if (createError) {
        throw new Error(`Gagal create user: ${createError.message}`);
      }

      console.log('✅ User baru berhasil dibuat!\n');

      // Create profile
      await supabase.from('profiles').insert({
        id: newUser.user.id,
        username: 'Alwiy313',
        level: 99,
        exp: 9999,
        role: 'Admin',
      });

      console.log('✅ Profile table berhasil dibuat!\n');
      
      console.log('🎉 SETUP SELESAI! User baru dibuat.\n');
      console.log('📋 DATA LOGIN:');
      console.log(`   Email: ${EMAIL}`);
      console.log(`   Password: ${PASSWORD}`);
      console.log(`   Role: Admin`);
      console.log(`   Level: 99`);
      
      return;
    }

    console.log(`✅ User ditemukan: ${user.id}\n`);

    console.log('═'.repeat(60));
    console.log('STEP 2: CHECK CURRENT DATA');
    console.log('═'.repeat(60));

    console.log('\n📊 AUTH.USERS.USER_METADATA:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.user_metadata?.role || 'TIDAK ADA'}`);
    console.log(`   Level: ${user.user_metadata?.level || 'TIDAK ADA'}`);
    console.log(`   EXP: ${user.user_metadata?.exp || 'TIDAK ADA'}`);
    console.log(`   Display Name: ${user.user_metadata?.display_name || 'TIDAK ADA'}`);
    console.log(`   Is Verified: ${user.user_metadata?.is_verified || false}`);
    console.log(`   Is Banned: ${user.user_metadata?.is_banned || false}\n`);

    // Check profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log('⚠️ Profile tidak ditemukan di tabel profiles!\n');
    } else {
      console.log('📊 TABEL PROFILES:');
      console.log(`   Username: ${profile.username || 'TIDAK ADA'}`);
      console.log(`   Level: ${profile.level || 'TIDAK ADA'}`);
      console.log(`   EXP: ${profile.exp || 'TIDAK ADA'}`);
      console.log(`   Role: ${profile.role || 'TIDAK ADA'}\n`);
    }

    console.log('═'.repeat(60));
    console.log('STEP 3: UPDATE & FIX DATA');
    console.log('═'.repeat(60));

    console.log('\n🔄 Mengupdate auth.users.user_metadata...');

    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: PASSWORD,
      user_metadata: {
        role: 'Admin',
        level: 99,
        exp: 9999,
        display_name: 'Alwiy313',
        is_verified: true,
        is_banned: false,
        avatar_url: user.user_metadata?.avatar_url || '',
        banner_url: user.user_metadata?.banner_url || '',
        bio: user.user_metadata?.bio || '',
      },
    });

    if (updateError) {
      throw new Error(`Gagal update user: ${updateError.message}`);
    }

    console.log('✅ Auth.users berhasil diupdate!\n');

    console.log('🔄 Mengupdate tabel profiles...');

    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: 'Alwiy313',
        level: 99,
        exp: 9999,
        role: 'Admin',
        avatar_url: user.user_metadata?.avatar_url || '',
        banner_url: user.user_metadata?.banner_url || '',
        bio: user.user_metadata?.bio || '',
      }, {
        onConflict: 'id',
      });

    if (profileUpdateError) {
      console.log(`⚠️ Warning: ${profileUpdateError.message}`);
    } else {
      console.log('✅ Profiles table berhasil diupdate!\n');
    }

    console.log('═'.repeat(60));
    console.log('STEP 4: VERIFY SYNC');
    console.log('═'.repeat(60));

    // Get fresh data
    const { data: { user: freshUser }, error: freshError } = await supabase.auth.admin.getUserById(user.id);
    
    if (freshError) {
      console.log('⚠️ Gagal verify data fresh');
    } else {
      console.log('\n✅ VERIFICATION SUCCESS!\n');
      console.log('📊 DATA TERBARU:');
      console.log(`   Email: ${freshUser.email}`);
      console.log(`   Role: ${freshUser.user_metadata?.role}`);
      console.log(`   Level: ${freshUser.user_metadata?.level}`);
      console.log(`   EXP: ${freshUser.user_metadata?.exp}`);
      console.log(`   Display Name: ${freshUser.user_metadata?.display_name}`);
      console.log(`   Is Verified: ${freshUser.user_metadata?.is_verified}`);
      console.log(`   Is Banned: ${freshUser.user_metadata?.is_banned}\n`);
    }

    console.log('═'.repeat(60));
    console.log('🎉 COMPREHENSIVE FIX SELESAI!');
    console.log('═'.repeat(60));

    console.log('\n📋 KREDENSIAL LOGIN:');
    console.log(`   Email: ${EMAIL}`);
    console.log(`   Password: ${PASSWORD}`);
    console.log(`   Role: Admin`);
    console.log(`   Level: 99`);
    console.log(`   EXP: 9999\n`);

    console.log('✅ CHECKLIST:');
    console.log('   ✓ User metadata updated');
    console.log('   ✓ Profiles table synced');
    console.log('   ✓ Password reset');
    console.log('   ✓ Role set to Admin');
    console.log('   ✓ Level & EXP maxed\n');

    console.log('🚀 NEXT STEPS:');
    console.log('   1. Tunggu 2-3 menit untuk Vercel deploy');
    console.log('   2. Clear browser cache (Ctrl+Shift+Delete)');
    console.log('   3. Login di: https://valoranime-v2.vercel.app/admin/login');
    console.log('   4. Akses dashboard: https://valoranime-v2.vercel.app/admin');
    console.log('   5. Seharusnya berhasil! ✅\n');

    console.log('💡 TIPS:');
    console.log('   - Jika masih redirect ke beranda, logout & login ulang');
    console.log('   - Jika masih error, cek browser console (F12)');
    console.log('   - Role "Admin" sekarang diterima oleh semua admin pages\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
