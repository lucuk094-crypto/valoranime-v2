/**
 * Script untuk reset password admin
 * Jalankan dengan: npx tsx scripts/reset-admin-password.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('\n🔐 === RESET PASSWORD ADMIN VALORANIME ===\n');

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

  // List all users
  const { data: authData, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('❌ Error saat mengambil daftar user:', listError.message);
    rl.close();
    process.exit(1);
  }

  if (authData.users.length === 0) {
    console.log('ℹ️  Belum ada user yang terdaftar.');
    console.log('   Gunakan: npm run create-admin untuk membuat admin baru\n');
    rl.close();
    process.exit(0);
  }

  // Show users
  console.log('👥 Daftar User yang Terdaftar:\n');
  authData.users.forEach((user, index) => {
    const role = user.user_metadata?.role || 'User';
    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0];
    console.log(`   ${index + 1}. ${displayName}`);
    console.log(`      Email: ${user.email}`);
    console.log(`      Role: ${role}`);
    console.log(`      ID: ${user.id}\n`);
  });

  // Get user email to reset
  const email = await question('Masukkan email user yang ingin direset passwordnya: ');

  if (!email) {
    console.error('\n❌ Email harus diisi!');
    rl.close();
    process.exit(1);
  }

  // Find user
  const user = authData.users.find(u => u.email === email);

  if (!user) {
    console.error(`\n❌ User dengan email "${email}" tidak ditemukan!`);
    rl.close();
    process.exit(1);
  }

  // Get new password
  const newPassword = await question('Masukkan password baru (min 6 karakter): ');

  if (!newPassword || newPassword.length < 6) {
    console.error('\n❌ Password minimal 6 karakter!');
    rl.close();
    process.exit(1);
  }

  // Confirm
  const confirm = await question(`\n⚠️  Yakin ingin reset password untuk "${email}"? (y/n): `);

  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('\n❌ Dibatalkan.');
    rl.close();
    process.exit(0);
  }

  console.log('\n⏳ Mereset password...');

  try {
    // Reset password
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (error) {
      console.error('\n❌ Error:', error.message);
      rl.close();
      process.exit(1);
    }

    console.log('\n✅ Password berhasil direset!');
    console.log('\n📋 Detail User:');
    console.log(`   Email: ${email}`);
    console.log(`   Password Baru: ${newPassword}`);
    console.log('\n🎉 Sekarang Anda bisa login di /admin/login dengan password baru!\n');

    rl.close();
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
