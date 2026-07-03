/**
 * Script untuk membuat admin pertama
 * Jalankan dengan: npx tsx scripts/create-first-admin.ts
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
  console.log('\n🚀 === VALORANIME - CREATE FIRST ADMIN ===\n');

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

  // Get admin data from user
  const email = await question('Email admin: ');
  const password = await question('Password admin (min 6 karakter): ');
  const displayName = await question('Display name (opsional, tekan Enter untuk skip): ');

  if (!email || !password) {
    console.error('\n❌ Email dan password harus diisi!');
    rl.close();
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('\n❌ Password minimal 6 karakter!');
    rl.close();
    process.exit(1);
  }

  console.log('\n⏳ Membuat admin...');

  try {
    // Create user dengan Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm email
      user_metadata: {
        display_name: displayName || email.split('@')[0],
        role: 'Superadmin',
        level: 99,
        exp: 0,
        is_banned: false,
      },
    });

    if (error) {
      console.error('\n❌ Error:', error.message);
      rl.close();
      process.exit(1);
    }

    // Create profile entry
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      display_name: displayName || email.split('@')[0],
      level: 99,
      exp: 0,
    });

    if (profileError) {
      console.log('\n⚠️ Warning: Gagal membuat profile (mungkin sudah ada):', profileError.message);
    }

    console.log('\n✅ Superadmin berhasil dibuat!');
    console.log('\n📋 Detail Admin:');
    console.log(`   ID: ${data.user.id}`);
    console.log(`   Email: ${email}`);
    console.log(`   Display Name: ${displayName || email.split('@')[0]}`);
    console.log(`   Role: Superadmin`);
    console.log(`   Level: 99`);
    console.log('\n🎉 Sekarang Anda bisa login di /admin/login dengan email dan password tersebut!\n');

    rl.close();
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
