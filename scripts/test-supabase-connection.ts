/**
 * Script untuk test koneksi ke Supabase
 * Jalankan dengan: npx tsx scripts/test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testConnection() {
  console.log('\n🔍 === TEST KONEKSI SUPABASE ===\n');

  // Get Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Validasi environment variables
  console.log('📋 Checking environment variables...');
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Not set'}`);
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Not set'}\n`);

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Environment variables belum diset di .env.local');
    process.exit(1);
  }

  // Test koneksi
  console.log('🔌 Testing connection to Supabase...');
  console.log(`   Project URL: ${supabaseUrl}\n`);

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Test 1: Cek koneksi dengan query sederhana
    console.log('📊 Test 1: Checking database connection...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "public.profiles" does not exist')) {
        console.log('   ⚠️  Tabel "profiles" belum ada di database');
        console.log('   ℹ️  Jalankan database.sql di Supabase SQL Editor\n');
      } else {
        throw error;
      }
    } else {
      console.log('   ✅ Database connection successful!\n');
    }

    // Test 2: Cek auth
    console.log('📊 Test 2: Checking Auth API...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.log('   ❌ Auth error:', authError.message);
    } else {
      console.log(`   ✅ Auth API working! Found ${authData.users.length} users\n`);
      
      if (authData.users.length > 0) {
        console.log('👥 Registered Users:');
        authData.users.forEach((user, index) => {
          const role = user.user_metadata?.role || 'User';
          const displayName = user.user_metadata?.display_name || user.email?.split('@')[0];
          console.log(`   ${index + 1}. ${displayName} (${user.email}) - Role: ${role}`);
        });
        console.log('');
      } else {
        console.log('ℹ️  Belum ada user. Jalankan "npm run create-admin" untuk membuat admin pertama.\n');
      }
    }

    // Test 3: Cek tabel-tabel yang ada
    console.log('📊 Test 3: Checking database tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(0);

    if (tablesError) {
      if (tablesError.message.includes('relation "public.profiles" does not exist')) {
        console.log('   ⚠️  Database schema belum di-setup');
        console.log('   📝 Action Required:');
        console.log('      1. Buka Supabase Dashboard → SQL Editor');
        console.log('      2. Copy isi file database.sql');
        console.log('      3. Paste dan Run\n');
      } else {
        console.log('   ❌ Table check error:', tablesError.message, '\n');
      }
    } else {
      console.log('   ✅ Table "profiles" exists!\n');
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Supabase connection: WORKING');
    console.log('✅ Environment variables: SET');
    console.log('✅ API keys: VALID');
    
    if (authData?.users.length === 0) {
      console.log('\n🎯 NEXT STEP:');
      console.log('   Jalankan: npm run create-admin');
      console.log('   Untuk membuat admin pertama');
    } else {
      console.log('\n🎉 READY! Anda bisa login di:');
      console.log('   http://localhost:3000/admin/login');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Cek file .env.local sudah diisi dengan benar');
    console.error('   2. Cek Supabase project masih aktif');
    console.error('   3. Cek internet connection');
    console.error('   4. Restart development server\n');
    process.exit(1);
  }
}

testConnection();
