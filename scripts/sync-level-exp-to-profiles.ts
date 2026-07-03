/**
 * Script untuk sinkronisasi level & EXP dari auth.users.user_metadata ke tabel profiles
 * Jalankan: npx tsx scripts/sync-level-exp-to-profiles.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function main() {
  console.log('\n🔄 === SYNC LEVEL & EXP: AUTH → PROFILES ===\n');

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
    // Get all users from auth.users
    console.log('🔍 Mengambil semua user dari auth.users...');
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Gagal mengambil users: ${listError.message}`);
    }

    console.log(`✅ Ditemukan ${authUsers.users.length} user\n`);

    let syncCount = 0;
    let errorCount = 0;

    for (const user of authUsers.users) {
      const email = user.email || 'No email';
      const level = user.user_metadata?.level || 1;
      const exp = user.user_metadata?.exp || 0;
      const displayName = user.user_metadata?.display_name || email.split('@')[0];

      console.log(`📝 Syncing: ${email}`);
      console.log(`   Level: ${level}, EXP: ${exp}`);

      try {
        // Update atau insert ke tabel profiles
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            level: level,
            exp: exp,
            username: displayName,
          }, {
            onConflict: 'id',
            ignoreDuplicates: false,
          });

        if (upsertError) {
          console.log(`   ⚠️ Error: ${upsertError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ Synced!`);
          syncCount++;
        }
      } catch (err: any) {
        console.log(`   ❌ Error: ${err.message}`);
        errorCount++;
      }

      console.log('');
    }

    console.log('='.repeat(50));
    console.log(`\n📊 HASIL SINKRONISASI:`);
    console.log(`   Total User: ${authUsers.users.length}`);
    console.log(`   Berhasil: ${syncCount}`);
    console.log(`   Gagal: ${errorCount}\n`);

    if (errorCount === 0) {
      console.log('🎉 Semua data berhasil di-sync!\n');
    } else {
      console.log('⚠️ Ada beberapa error, cek log di atas.\n');
    }

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
