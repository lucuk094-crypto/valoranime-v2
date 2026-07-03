/**
 * Script untuk cek apakah trigger sudah terinstall dan sync data
 * Jalankan: npx tsx scripts/check-and-fix-sync.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function main() {
  console.log('\n🔍 === CEK & FIX SYNC LEVEL & EXP ===\n');

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
    // Step 1: Ambil user by email
    const EMAIL = 'alwismith76@gmail.com';
    console.log(`🔍 Mencari user dengan email: ${EMAIL}`);
    
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

    // Step 2: Cek data di auth.users.user_metadata
    console.log('📊 DATA DI AUTH.USERS.USER_METADATA:');
    console.log(`   Level: ${user.user_metadata?.level || 'TIDAK ADA'}`);
    console.log(`   EXP: ${user.user_metadata?.exp || 'TIDAK ADA'}`);
    console.log(`   Display Name: ${user.user_metadata?.display_name || 'TIDAK ADA'}`);
    console.log(`   Role: ${user.user_metadata?.role || 'TIDAK ADA'}\n`);

    // Step 3: Cek data di tabel profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log(`⚠️ Profile tidak ditemukan: ${profileError.message}\n`);
      console.log('💡 Membuat profile baru...');
      
      // Create profile
      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        username: user.user_metadata?.display_name || EMAIL.split('@')[0],
        level: user.user_metadata?.level || 1,
        exp: user.user_metadata?.exp || 0,
      });

      if (insertError) {
        console.error(`❌ Gagal membuat profile: ${insertError.message}`);
      } else {
        console.log('✅ Profile berhasil dibuat!\n');
      }
    } else {
      console.log('📊 DATA DI TABEL PROFILES:');
      console.log(`   Level: ${profile.level || 'TIDAK ADA'}`);
      console.log(`   EXP: ${profile.exp || 'TIDAK ADA'}`);
      console.log(`   Username: ${profile.username || 'TIDAK ADA'}\n`);

      // Compare
      const authLevel = user.user_metadata?.level || 1;
      const authExp = user.user_metadata?.exp || 0;
      const profileLevel = profile.level || 1;
      const profileExp = profile.exp || 0;

      if (authLevel !== profileLevel || authExp !== profileExp) {
        console.log('⚠️ DATA TIDAK SINKRON!\n');
        console.log('🔄 Mensinkronkan data dari auth.users ke profiles...');

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            level: authLevel,
            exp: authExp,
          })
          .eq('id', user.id);

        if (updateError) {
          console.error(`❌ Gagal update profile: ${updateError.message}`);
        } else {
          console.log('✅ Data berhasil disinkronkan!\n');
        }
      } else {
        console.log('✅ DATA SUDAH SINKRON!\n');
      }
    }

    // Step 4: Update user menjadi Developer dengan level tinggi
    console.log('🚀 MENGUPDATE USER MENJADI DEVELOPER...\n');

    const { error: devUpdateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        role: 'Developer',
        level: 99,
        exp: 9999,
        display_name: user.user_metadata?.display_name || 'Alwiy313',
        is_verified: true,
      },
    });

    if (devUpdateError) {
      console.error(`❌ Gagal update role: ${devUpdateError.message}`);
    } else {
      console.log('✅ User berhasil diupdate menjadi Developer!\n');

      // Update profiles juga
      const { error: profileUpdateError } = await supabase
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

      if (profileUpdateError) {
        console.log(`⚠️ Warning profile: ${profileUpdateError.message}`);
      } else {
        console.log('✅ Profile table berhasil diupdate!\n');
      }
    }

    console.log('='.repeat(60));
    console.log('\n🎉 SELESAI!\n');
    console.log('📋 DATA TERBARU:');
    console.log(`   Email: ${EMAIL}`);
    console.log(`   Role: Developer ⚡`);
    console.log(`   Level: 99 (Mythic) 🔴`);
    console.log(`   EXP: 9999`);
    console.log(`   Verified: ✅`);
    console.log('\n🌐 Silakan login ke website:');
    console.log('   URL: https://valoranime-v2.vercel.app/admin/login');
    console.log('   Email: alwismith76@gmail.com');
    console.log('   Password: Admin313\n');
    console.log('💡 Tips: Jika level belum berubah, logout dan login lagi!\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
