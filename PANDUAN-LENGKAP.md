# 📚 PANDUAN LENGKAP VALORANIME - ADMIN & USER MANAGEMENT

Panduan lengkap untuk setup, manage admin/user, dan deployment Valoranime dengan Supabase.

---

## 📋 DAFTAR ISI

1. [Setup Awal](#1-setup-awal)
2. [Cara Tambah Admin/User](#2-cara-tambah-adminuser)
3. [Cara Ganti Password](#3-cara-ganti-password)
4. [Cara Update Level & EXP User](#4-cara-update-level--exp-user)
5. [Cara Update Role User](#5-cara-update-role-user)
6. [Cara Ban/Unban User](#6-cara-banunban-user)
7. [Cara Hapus User](#7-cara-hapus-user)
8. [Deploy ke Vercel](#8-deploy-ke-vercel)
9. [Commands Reference](#9-commands-reference)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. SETUP AWAL

### ✅ Prasyarat
- Node.js sudah terinstall
- Project Valoranime sudah ada
- Akun Supabase (gratis)

### 🚀 Langkah Setup

#### **STEP 1: Setup Supabase Project** (2 menit)

1. Buka https://supabase.com → Login
2. Klik **"New Project"**
3. Isi form:
   - Name: `valoranime`
   - Database Password: Buat password kuat (simpan!)
   - Region: **Southeast Asia (Singapore)**
4. Klik **"Create new project"** → Tunggu 2 menit

#### **STEP 2: Copy API Keys** (1 menit)

1. Di Supabase Dashboard → **Settings** → **API**
2. Copy 3 keys:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **anon public** (key panjang)
   - **service_role** (key panjang - **RAHASIA!**)

#### **STEP 3: Setup Environment Variables** (1 menit)

1. Buka file `.env.local` di project
2. Ganti dengan keys Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1Ni...
```

3. Save → Restart server:
```bash
npm run dev
```

#### **STEP 4: Setup Database** (1 menit)

1. Di Supabase Dashboard → **SQL Editor** → **New query**
2. Buka file `database.sql` di project
3. Copy SEMUA isi → Paste ke SQL Editor
4. Klik **"Run"** atau **"Run without RLS"**
5. Tunggu muncul **"Success"**

#### **STEP 5: Buat Admin Pertama** (1 menit)

**Cara 1: Via Script Cepat (Recommended)**

1. Edit file `scripts/quick-create-admin.ts`
2. Ganti data di baris 13-19:

```typescript
const ADMIN_DATA = {
  email: 'admin@valoranime.com',
  password: 'admin123456',
  displayName: 'Super Admin',
  role: 'Superadmin',
};
```

3. Save → Jalankan:
```bash
npm run quick-admin
```

**Cara 2: Via Terminal Interaktif**

```bash
npm run create-admin
```
Lalu isi data yang diminta.

#### **STEP 6: Test Login**

1. Buka: http://localhost:3000/admin/login
2. Login dengan email & password yang dibuat
3. ✅ Berhasil masuk ke Admin Panel!

---

## 2. CARA TAMBAH ADMIN/USER

### 🎯 Ada 3 Cara:

#### **Cara 1: Via Script (Paling Cepat)** ⭐

1. Edit file `scripts/quick-create-admin.ts`
2. Ganti data:

```typescript
const ADMIN_DATA = {
  email: 'newuser@example.com',    // Email baru
  password: 'password123',          // Password
  displayName: 'New User',          // Nama
  role: 'User',                     // User/Admin/Superadmin
};
```

3. Jalankan:
```bash
npm run quick-admin
```

#### **Cara 2: Via Browser (Paling Visual)**

1. Login dulu di `/admin/login`
2. Buka: http://localhost:3000/admin/create-user
3. Isi form:
   - Email
   - Password (min 6 karakter)
   - Display Name
   - Role (User/Admin/Superadmin)
4. Klik **"Buat User"**

#### **Cara 3: Via Supabase Dashboard (Manual)**

1. Buka Supabase Dashboard → **Authentication** → **Users**
2. Klik **"Add User"** → **"Create new user"**
3. Isi email & password
4. Centang **"Auto Confirm User"**
5. Di **User Metadata**, tambahkan:

```json
{
  "role": "Admin",
  "display_name": "Admin Name",
  "level": 1,
  "exp": 0,
  "is_banned": false
}
```

6. Klik **"Create user"**

### 📊 Role yang Tersedia:

| Role | Akses |
|------|-------|
| **Superadmin** | Full access, bisa create admin |
| **Admin** | Manage users & content |
| **User** | User biasa, tidak bisa akses admin panel |

---

## 3. CARA GANTI PASSWORD

### 🔐 Ada 3 Cara:

#### **Cara 1: Via Script Reset Password**

```bash
npm run reset-password
```

1. Script akan tampilkan daftar user
2. Ketik email user yang mau direset
3. Masukkan password baru (min 6 karakter)
4. Konfirmasi dengan ketik `y`
5. ✅ Password berhasil direset!

#### **Cara 2: Buat User Baru dengan Email Sama**

Jika email user lama mau dipakai lagi:

1. Hapus user lama dulu (lihat [Cara Hapus User](#7-cara-hapus-user))
2. Buat user baru dengan email & password baru

#### **Cara 3: Via Supabase Dashboard**

1. Supabase Dashboard → **Authentication** → **Users**
2. Klik email user yang mau direset
3. Scroll bawah → Klik **"Update user"**
4. Di field **Password**, isi password baru
5. Klik **"Update user"**

---

## 4. CARA UPDATE LEVEL & EXP USER

### 📊 Via API Endpoint

Gunakan endpoint yang sudah ada: `PUT /api/admin/users/[id]`

**Contoh dengan curl:**

```bash
curl -X PUT http://localhost:3000/api/admin/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "level": 50,
    "exp": 12500
  }'
```

**Contoh dengan JavaScript:**

```javascript
const userId = '12345-abcde-67890'; // User ID dari Supabase

const response = await fetch(`/api/admin/users/${userId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    level: 50,
    exp: 12500
  })
});

const result = await response.json();
console.log(result); // { success: true, updated: { level: 50, exp: 12500 } }
```

### 📊 Via Supabase Dashboard

#### **Cara 1: Update di Table Editor**

1. Supabase Dashboard → **Table Editor** → **profiles**
2. Cari user berdasarkan ID
3. Klik cell **level** atau **exp** → Edit langsung
4. Tekan Enter untuk save

#### **Cara 2: Update di Authentication**

1. Supabase Dashboard → **Authentication** → **Users**
2. Klik email user
3. Edit **User Metadata**:

```json
{
  "role": "Admin",
  "display_name": "Admin Name",
  "level": 50,        // ← Edit ini
  "exp": 12500,       // ← Edit ini
  "is_banned": false
}
```

4. Klik **"Update user"**

### 🎯 Script Khusus Update Level/EXP

Buat file baru `scripts/update-user-level.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updateUserLevel(userId: string, level: number, exp: number) {
  // Update tabel profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ level, exp })
    .eq('id', userId);

  if (profileError) {
    console.error('Error:', profileError);
    return;
  }

  // Update user metadata
  const { data: { user } } = await supabase.auth.admin.getUserById(userId);
  const currentMeta = user?.user_metadata || {};

  await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { ...currentMeta, level, exp }
  });

  console.log(`✅ User ${userId} updated: Level ${level}, EXP ${exp}`);
}

// Edit di sini:
const USER_ID = 'paste-user-id-here';
const NEW_LEVEL = 50;
const NEW_EXP = 12500;

updateUserLevel(USER_ID, NEW_LEVEL, NEW_EXP);
```

Jalankan: `npx tsx scripts/update-user-level.ts`

---

## 5. CARA UPDATE ROLE USER

### 👑 Via API Endpoint

```bash
curl -X PUT http://localhost:3000/api/admin/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Admin"
  }'
```

### 👑 Via Supabase Dashboard

1. Supabase Dashboard → **Authentication** → **Users**
2. Klik email user
3. Edit **User Metadata**:

```json
{
  "role": "Superadmin",  // ← Ganti ini (User/Admin/Superadmin)
  "display_name": "User Name",
  "level": 50,
  "exp": 12500,
  "is_banned": false
}
```

4. Klik **"Update user"**

---

## 6. CARA BAN/UNBAN USER

### 🚫 Via API Endpoint

```bash
# Ban user
curl -X PUT http://localhost:3000/api/admin/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "is_banned": true,
    "ban_reason": "Melanggar peraturan"
  }'

# Unban user
curl -X PUT http://localhost:3000/api/admin/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "is_banned": false,
    "ban_reason": ""
  }'
```

### 🚫 Via Supabase Dashboard

1. Supabase Dashboard → **Authentication** → **Users**
2. Klik email user
3. Edit **User Metadata**:

```json
{
  "role": "User",
  "display_name": "User Name",
  "level": 50,
  "exp": 12500,
  "is_banned": true,              // ← true = banned, false = unbanned
  "ban_reason": "Alasan ban"      // ← Alasan (opsional)
}
```

4. Klik **"Update user"**

**Efek:**
- User yang dibanned tidak bisa login
- Akan muncul pesan error saat login: "Akun Anda telah dibanned. Alasan: ..."

---

## 7. CARA HAPUS USER

### 🗑️ Via API Endpoint

```bash
curl -X DELETE http://localhost:3000/api/admin/users/USER_ID_HERE
```

### 🗑️ Via Supabase Dashboard

1. Supabase Dashboard → **Authentication** → **Users**
2. Klik email user yang mau dihapus
3. Scroll bawah → Klik **"Delete user"**
4. Konfirmasi dengan ketik nama/email user
5. Klik **"Delete"**

**⚠️ Perhatian:**
- User yang dihapus **TIDAK BISA** dikembalikan!
- Semua data user (comments, bookmarks, history) juga akan terhapus

---

## 8. DEPLOY KE VERCEL

### 🚀 Langkah Deployment

#### **STEP 1: Push ke GitHub**

```bash
git add .
git commit -m "Add admin system with Supabase"
git push origin main
```

#### **STEP 2: Connect ke Vercel**

1. Buka https://vercel.com → Login
2. Klik **"New Project"**
3. Import repository Valoranime dari GitHub
4. Klik **"Import"**

#### **STEP 3: Setup Environment Variables**

Di Vercel dashboard project:

1. Klik **"Settings"** → **"Environment Variables"**
2. Tambahkan 3 variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1Ni...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1Ni...` | Production, Preview, Development |

3. Klik **"Save"** untuk setiap variable

#### **STEP 4: Deploy**

1. Kembali ke tab **"Deployments"**
2. Klik **"Redeploy"** → **"Redeploy"**
3. Tunggu 2-3 menit hingga deployment selesai
4. Klik **"Visit"** untuk buka website

#### **STEP 5: Test Production**

1. Buka: `https://your-domain.vercel.app/admin/login`
2. Login dengan admin yang sudah dibuat
3. ✅ Berhasil! Supabase tetap tersambung!

### 🔗 Supabase Tetap Tersambung

**PENTING:** Supabase tetap tersambung ke production karena:
- Environment variables sudah diset di Vercel
- API keys yang sama digunakan untuk local & production
- Database Supabase di cloud, bisa diakses dari mana saja
- Tidak perlu setup tambahan!

### 📝 Custom Domain (Opsional)

1. Di Vercel → **Settings** → **Domains**
2. Klik **"Add"**
3. Masukkan domain Anda (contoh: `valoranime.com`)
4. Ikuti instruksi untuk setup DNS
5. Tunggu propagasi (~5-10 menit)

---

## 9. COMMANDS REFERENCE

### 🎯 Development

```bash
npm run dev              # Start development server
npm run build            # Build untuk production
npm run start            # Run production build
npm run lint             # Run linter
```

### 👥 User Management

```bash
npm run quick-admin      # Buat admin cepat (edit script dulu)
npm run create-admin     # Buat admin interaktif (via terminal)
npm run reset-password   # Reset password user yang ada
npm run test-supabase    # Test koneksi ke Supabase
```

### 🔧 Custom Scripts

Buat script custom di `scripts/` lalu tambahkan ke `package.json`:

```json
"scripts": {
  "my-script": "tsx scripts/my-script.ts"
}
```

---

## 10. TROUBLESHOOTING

### ❌ Error: "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Penyebab:** Environment variables belum diset atau tidak ter-load.

**Solusi:**
1. Cek file `.env.local` sudah diisi dengan benar
2. Restart development server: Ctrl+C → `npm run dev`
3. Pastikan tidak ada typo di nama variable

---

### ❌ Error: "Email already registered"

**Penyebab:** Email sudah digunakan oleh user lain.

**Solusi:**
1. Gunakan email yang berbeda, ATAU
2. Hapus user lama dulu, ATAU
3. Reset password user yang ada dengan `npm run reset-password`

---

### ❌ Login redirect ke login lagi

**Penyebab:** User tidak punya role "Admin" atau "Superadmin".

**Solusi:**
1. Buka Supabase Dashboard → **Authentication** → **Users**
2. Klik user yang bermasalah
3. Edit **User Metadata**, pastikan ada:
```json
{
  "role": "Superadmin"  // atau "Admin"
}
```
4. Save dan coba login lagi

---

### ❌ Error: "Failed to create user"

**Penyebab:** `SUPABASE_SERVICE_ROLE_KEY` tidak valid atau salah.

**Solusi:**
1. Buka file `.env.local`
2. Copy ulang `service_role` key dari Supabase Dashboard → Settings → API
3. Paste ke `.env.local`
4. Restart server

---

### ❌ Error: "relation public.profiles does not exist"

**Penyebab:** Database schema belum di-setup.

**Solusi:**
1. Buka Supabase Dashboard → **SQL Editor** → **New query**
2. Copy isi file `database.sql`
3. Paste dan klik **"Run"**

---

### ❌ Deployment Vercel Error: Environment Variables

**Penyebab:** Environment variables belum diset di Vercel.

**Solusi:**
1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Tambahkan 3 variables (lihat [Step 3 Deploy](#step-3-setup-environment-variables))
3. Redeploy project

---

### ❌ Script tidak jalan / stuck

**Solusi:**
1. Tekan Ctrl+C untuk stop
2. Pastikan `.env.local` sudah diisi
3. Jalankan `npm run test-supabase` untuk test koneksi
4. Coba lagi

---

## 📞 SUPPORT & RESOURCES

### 📚 Dokumentasi

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)

### 🔗 URLs Penting

**Local Development:**
- Admin Login: http://localhost:3000/admin/login
- Admin Panel: http://localhost:3000/admin
- Create User: http://localhost:3000/admin/create-user

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Your Project: https://supabase.com/dashboard/project/[your-project-id]

**Vercel:**
- Dashboard: https://vercel.com/dashboard

---

## 🔐 SECURITY CHECKLIST

- ✅ Password di-hash dengan bcrypt
- ✅ HTTP-only cookies untuk session
- ✅ Environment variables untuk secrets
- ✅ Role-based access control
- ⚠️ **JANGAN commit `.env.local` ke Git!**
- ⚠️ **JANGAN share `SUPABASE_SERVICE_ROLE_KEY`!**
- ⚠️ Gunakan password yang kuat untuk production

---

## ✅ QUICK START CHECKLIST

Setup dari awal:

- [ ] Supabase project dibuat
- [ ] API keys dicopy
- [ ] `.env.local` diisi dengan keys
- [ ] Server direstart (`npm run dev`)
- [ ] Database schema di-setup (jalankan `database.sql`)
- [ ] Admin pertama dibuat
- [ ] Bisa login di `/admin/login`
- [ ] Test tambah user baru
- [ ] Push ke GitHub
- [ ] Deploy ke Vercel
- [ ] Environment variables diset di Vercel
- [ ] Test production login

---

## 🎉 KESIMPULAN

**Valoranime sekarang punya:**

✅ Full authentication system dengan Supabase  
✅ Admin panel dengan role-based access  
✅ User management (create, update, delete)  
✅ Level & EXP system  
✅ Ban/unban functionality  
✅ Production ready (siap deploy ke Vercel)  
✅ Supabase tersambung di local & production  

**SELAMAT! Anda siap manage users dan deploy ke production!** 🚀

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
