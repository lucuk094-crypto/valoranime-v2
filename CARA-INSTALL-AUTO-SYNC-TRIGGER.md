# 🔄 Cara Install Auto-Sync Trigger di Supabase

## 📋 Apa yang Dilakukan Trigger Ini?

Trigger ini akan **otomatis sinkronisasi** data dari `auth.users.user_metadata` ke tabel `profiles` setiap kali:

✅ Anda edit User Metadata di Supabase Dashboard  
✅ Script update level & EXP  
✅ API update user data  
✅ User baru dibuat  

**Setelah install trigger ini, SEMUA UPDATE OTOMATIS SYNC!** 🎉

---

## 🚀 Cara Install (3 Langkah Mudah)

### **Langkah 1: Buka Supabase SQL Editor**

1. Login ke Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project: `vecrgajrdhicqvggpbea`
3. Klik menu **SQL Editor** di sidebar kiri
4. Klik tombol **"+ New query"**

### **Langkah 2: Copy SQL Trigger**

1. Buka file: `supabase-trigger-auto-sync.sql` (di root project ini)
2. Copy **SEMUA isi file** (Ctrl+A → Ctrl+C)

### **Langkah 3: Paste & Run**

1. Paste di SQL Editor (Ctrl+V)
2. Klik tombol **"Run"** (atau tekan Ctrl+Enter)
3. Tunggu sampai muncul **"Success. No rows returned"**

**✅ SELESAI!** Trigger sudah aktif!

---

## 🧪 Test Apakah Trigger Sudah Jalan

### **Test 1: Edit Manual di Supabase Dashboard**

1. **Buka Authentication → Users**
2. Klik user `alwismith76@gmail.com`
3. Edit **User Metadata**, ubah level menjadi `88`:
   ```json
   {
     "level": 88,
     "exp": 7000,
     "display_name": "Alwiy313",
     "role": "Superadmin"
   }
   ```
4. Klik **Save**
5. **Buka Table Editor → profiles**
6. Cari user dengan email tersebut
7. **Cek kolom `level`** → Harus otomatis jadi `88`! ✅

### **Test 2: Via SQL Editor**

Jalankan query ini di SQL Editor:

```sql
-- Update level & exp via SQL
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  jsonb_set(raw_user_meta_data, '{level}', '95'),
  '{exp}', '8500'
)
WHERE email = 'alwismith76@gmail.com';

-- Cek apakah profiles juga update
SELECT id, username, level, exp 
FROM profiles 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'alwismith76@gmail.com'
);
```

**Hasil yang diharapkan:**
```
level: 95
exp: 8500
```

✅ **Jika hasil sama, trigger berhasil!**

### **Test 3: Via Script Terminal**

```bash
# Edit level di script
npm run update-level

# Cek di Supabase:
# 1. Authentication → Users → User Metadata
# 2. Table Editor → profiles
# Keduanya harus SAMA!
```

---

## 📖 Penjelasan Trigger

### **Trigger 1: `on_auth_user_metadata_updated`**

Berjalan setiap kali `raw_user_meta_data` di `auth.users` diupdate.

**Yang di-sync:**
- `level` (dari user_metadata.level)
- `exp` (dari user_metadata.exp)
- `username` (dari user_metadata.display_name)
- `avatar_url` (dari user_metadata.avatar_url)
- `banner_url` (dari user_metadata.banner_url)

### **Trigger 2: `on_auth_user_created`**

Berjalan setiap kali user baru dibuat (via sign up, script, atau API).

**Yang dilakukan:**
- Auto-create row di tabel `profiles`
- Set default level = 1, exp = 0
- Copy username dari display_name atau email

---

## 🎯 Setelah Trigger Terinstall

### **Cara Update Level & EXP (3 Metode - Semua Auto-Sync)**

#### **Metode 1: Edit Manual di Supabase (SEKARANG AUTO-SYNC!)**

1. **Authentication → Users → (Klik user) → User Metadata**
2. Edit JSON:
   ```json
   {
     "level": 99,
     "exp": 9999
   }
   ```
3. Save
4. **OTOMATIS update ke tabel profiles!** ✅

**TIDAK PERLU EDIT DI 2 TEMPAT LAGI!** 🎉

#### **Metode 2: Script Terminal (Tetap Bisa Digunakan)**

```bash
npm run update-level
```

#### **Metode 3: SQL Editor**

```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  jsonb_set(raw_user_meta_data, '{level}', '99'),
  '{exp}', '9999'
)
WHERE email = 'alwismith76@gmail.com';
```

**Semua metode di atas otomatis sync ke profiles!** ✅

---

## 🔧 Troubleshooting

### ❌ Error saat run SQL: "function already exists"

**Solusi:**
Trigger mungkin sudah ada. Drop dulu, lalu create lagi:

```sql
DROP TRIGGER IF EXISTS on_auth_user_metadata_updated ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.sync_user_metadata_to_profiles();
DROP FUNCTION IF EXISTS public.handle_new_user();
```

Lalu run lagi SQL dari file `supabase-trigger-auto-sync.sql`.

### ❌ Data tetap tidak sync setelah install trigger

**Cek:**
1. Pastikan trigger sudah terinstall:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname LIKE '%auth_user%';
   ```
2. Cek apakah ada error di Supabase logs
3. Jalankan `npm run sync-profiles` untuk force sync semua data

### ❌ Trigger tidak berjalan untuk data lama

**Normal!** Trigger hanya berjalan untuk **update BARU** setelah trigger dibuat.

**Solusi untuk sync data lama:**
```bash
npm run sync-profiles
```

---

## 📊 Diagram Alur Auto-Sync

```
┌─────────────────────────────────────────────────┐
│  EDIT USER METADATA (Level & EXP)              │
│  - Manual di Supabase Dashboard                │
│  - Via Script (npm run update-level)           │
│  - Via API atau SQL                            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  TRIGGER: on_auth_user_metadata_updated        │
│  Otomatis berjalan setiap kali user_metadata   │
│  diupdate                                       │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  FUNCTION: sync_user_metadata_to_profiles()    │
│  Ambil data dari user_metadata:                │
│  - level                                        │
│  - exp                                          │
│  - display_name                                 │
│  - avatar_url                                   │
│  - banner_url                                   │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  UPSERT ke TABEL PROFILES                      │
│  Update jika user sudah ada,                   │
│  Insert jika user baru                         │
└─────────────────────────────────────────────────┘
                 │
                 ▼
         ✅ DATA SINKRON!
```

---

## 🎉 Kesimpulan

**SEBELUM Install Trigger:**
- ❌ Edit manual di User Metadata → Harus edit profiles juga
- ❌ Data bisa tidak sinkron
- ❌ Repot harus update 2 tempat

**SETELAH Install Trigger:**
- ✅ Edit di User Metadata → Otomatis update profiles
- ✅ Data selalu sinkron
- ✅ Edit 1 tempat saja cukup!

**Install sekarang dan lupakan masalah sync manual!** 🚀

---

## 📝 Quick Commands

```bash
# Test trigger dengan script
npm run update-level

# Sync data lama (jika perlu)
npm run sync-profiles

# Test koneksi
npm run test-supabase
```

---

**File SQL Trigger**: `supabase-trigger-auto-sync.sql`  
**Status**: ⏳ Belum terinstall (Ikuti panduan di atas)  
**Setelah Install**: ✅ Auto-sync aktif selamanya!
