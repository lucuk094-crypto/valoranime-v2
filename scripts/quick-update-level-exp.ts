/**
 * Script untuk quick update level & EXP user
 * Edit data di bawah, lalu jalankan:
 * npx tsx scripts/quick-update-level-exp.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

// ============================================
// 📝 EDIT DATA USER DI SINI:
// ============================================
const UPDATE_DATA = {
  email: 'alwismith76@gmail.com',  // Email user yang mau diupdate
  level: 50,                       // Level baru (1-99)
  exp: 2500,                       // EXP baru (0 - level*100)
};
// ============================================

async function main() {
  console.log('\n🎮 === QUICK UPDATE LEVEL & EXP ===\n');

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

  console.log('📋 Data yang akan diupdate:');
  console.log(`   Email: ${UPDATE_DATA.email}`);
  console.log(`   Level: ${UPDATE_DATA.level}`);
  console.log(`   EXP: ${UPDATE_DATA.exp}\n`);

  try {
    // Step 1: Cari user by email
    console.log('🔍 Mencari user...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Gagal mencari user: ${listError.message}`);
    }

    const user = existingUsers.users.find(u => u.email === UPDATE_DATA.email);

    if (!user) {
      console.error(`\n❌ Error: User dengan email ${UPDATE_DATA.email} tidak ditemukan!`);
      console.error('   Pastikan email sudah terdaftar di Supabase.\n');
      process.exit(1);
    }

    console.log(`✅ User ditemukan!`);
    console.log(`   User ID: ${user.id}`);
    console.log(`   Level sekarang: ${user.user_metadata?.level || 1}`);
    console.log(`   EXP sekarang: ${user.user_metadata?.exp || 0}\n`);

    // Step 2: Update user metadata
    console.log('🔄 Mengupdate level & EXP...');

    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        level: UPDATE_DATA.level,
        exp: UPDATE_DATA.exp,
      },
    });

    if (updateError) {
      throw new Error(`Gagal update: ${updateError.message}`);
    }

    console.log('\n✅ UPDATE BERHASIL!\n');
    console.log('📊 Data Terbaru:');
    console.log(`   Email: ${UPDATE_DATA.email}`);
    console.log(`   Level: ${UPDATE_DATA.level}`);
    console.log(`   EXP: ${UPDATE_DATA.exp}`);
    
    // Hitung rank
    const rankNames = ['Rookie', 'Veteran', 'Elite', 'Legend', 'Mythic'];
    const currentRank = rankNames[Math.min(Math.floor(UPDATE_DATA.level / 20), rankNames.length - 1)];
    console.log(`   Rank: ${currentRank}`);
    
    // Hitung progress ke level berikutnya
    const expNeeded = UPDATE_DATA.level * 100;
    const expRemaining = expNeeded - UPDATE_DATA.exp;
    const expPercentage = Math.min(100, Math.round((UPDATE_DATA.exp / expNeeded) * 100));
    console.log(`   Progress: ${expPercentage}% (${expRemaining} XP lagi ke level ${UPDATE_DATA.level + 1})`);

    console.log('\n🌐 Cek website dalam 10 detik untuk melihat perubahan!');
    console.log('   URL: https://valoranime-v2.vercel.app/profile\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
