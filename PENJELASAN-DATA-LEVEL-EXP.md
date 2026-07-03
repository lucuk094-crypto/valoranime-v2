# 📖 Penjelasan: Kenapa Data Level & EXP Beda di Supabase?

## ❓ Masalah yang Terjadi

Ketika Anda cek data level & EXP di Supabase, mungkin Anda lihat **2 tempat berbeda**:

1. **Authentication → Users → User Metadata** (auth.users.raw_user_meta_data)
2. **Table Editor → profiles** (tabel profiles)

Dan datanya **TIDAK SAMA** / tidak sinkron!

---

## 🔍 Penjelasan Teknis

### Data Disimpan di 2 Tempat:

#### 1. **`auth.users.raw_user_meta_data`** (User Metadata)
- Ini adalah metadata user di Supabase Auth
- Data format JSON seperti:
  ```json
  {
    "level": 75,
    "exp": 5000,
    "display_name": "Alwiy313",
    "role": "Superadmin"
  }
  ```
- **Website menggunakan data ini** untuk menampilkan level & EXP
- Lokasi: **Authentication → Users → (Klik user) → User Metadata**

#### 2. **Tabel `profiles`**
- Ini adalah tabel database terpisah untuk menyimpan data user
- Struktur tabel:
  ```sql
  profiles (
    id UUID,
    username TEXT,
    level INTEGER,
    exp INTEGER,
    avatar_url TEXT,
    ...
  )
  ```
- **Tidak digunakan untuk menampilkan level & EXP di website** (sebelumnya)
- Lokasi: **Table Editor → profiles**

---

## ✅ Solusi yang Sudah Diterapkan

Sekarang **semua script otomatis sync ke KEDUA tempat**:

### Script yang Sudah Diperbaiki:

1. **`npm run update-level`** (Quick update level & EXP)
   - ✅ Update `auth.users.user_metadata`
   - ✅ Update tabel `profiles`

2. **`npm run sync-admin`** (Sync data admin)
   - ✅ Update `auth.users.user_metadata`
   - ✅ Update tabel `profiles`

3. **`npm run sync-profiles`** (Sync semua user dari auth → profiles)
   - ✅ Sync semua data level & EXP dari auth.users ke profiles
   - ✅ Jalankan sekali untuk fix data yang sudah ada

---

## 🎯 Cara Pastikan Data Sinkron

### Opsi 1: Gunakan Script (Paling Mudah)

```bash
# Update level & EXP (otomatis sync ke kedua tempat)
npm run update-level

# Atau sync semua user sekaligus
npm run sync-profiles
```

### Opsi 2: Edit Manual di Supabase Dashboard

**PENTING**: Jika Anda edit manual di Supabase, edit di **2 tempat**:

#### A. Edit di User Metadata:
1. **Authentication → Users**
2. Klik user yang mau diedit
3. Scroll ke **User Metadata**
4. Edit JSON:
   ```json
   {
     "level": 75,
     "exp": 5000,
     "display_name": "Alwiy313",
     "role": "Superadmin"
   }
   ```
5. Save

#### B. Edit di Tabel Profiles:
1. **Table Editor → profiles**
2. Cari row dengan `id` yang sama dengan user ID
3. Edit kolom `level` dan `exp`
4. Save

### Opsi 3: Edit via SQL (Paling Cepat)

Jalankan query ini di **SQL Editor**:

```sql
-- Update user metadata
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  jsonb_set(raw_user_meta_data, '{level}', '75'),
  '{exp}', '5000'
)
WHERE email = 'alwismith76@gmail.com';

-- Update tabel profiles
UPDATE profiles
SET level = 75, exp = 5000
WHERE id = (SELECT id FROM auth.users WHERE email = 'alwismith76@gmail.com');
```

---

## 🚀 Best Practice untuk Update Level & EXP

### ✅ Cara yang Benar:

**Gunakan script terminal:**
```bash
# 1. Edit file: scripts/quick-update-level-exp.ts
# 2. Ubah level dan exp

# 3. Jalankan:
npm run update-level
```

Script ini **otomatis sync ke kedua tempat** tanpa perlu manual!

### ❌ Cara yang Salah:

**JANGAN edit manual hanya di 1 tempat!**
- ❌ Edit hanya di User Metadata → Profiles tidak update
- ❌ Edit hanya di Profiles → User Metadata tidak update
- ❌ Data jadi tidak sinkron

---

## 🔧 Troubleshooting

### ❓ Kenapa data di profiles tidak update?

**Kemungkinan:**
1. Edit manual hanya di User Metadata, tidak di Profiles
2. Kolom di tabel profiles namanya berbeda (cek: `level` vs `display_name` vs `username`)

**Solusi:**
```bash
npm run sync-profiles
```

### ❓ Kenapa data di website tidak update?

**Kemungkinan:**
1. Edit manual hanya di Profiles, tidak di User Metadata
2. Website menggunakan data dari `auth.users.user_metadata`

**Solusi:**
- Edit di User Metadata juga
- Atau gunakan `npm run update-level`

### ❓ Bagaimana cara cek data sudah sinkron?

**Cek di Supabase:**

1. **User Metadata**:
   - Authentication → Users → (Klik user) → User Metadata
   - Lihat nilai `level` dan `exp`

2. **Tabel Profiles**:
   - Table Editor → profiles → (Cari user by ID)
   - Lihat kolom `level` dan `exp`

3. **Harus SAMA!**

**Cek via Script:**
```bash
npm run test-supabase
```

---

## 📊 Struktur Data Level & EXP

### Di `auth.users.user_metadata`:
```json
{
  "level": 75,           // INTEGER
  "exp": 5000,           // INTEGER
  "display_name": "...",
  "role": "...",
  "avatar_url": "..."
}
```

### Di tabel `profiles`:
```sql
id           | UUID (primary key)
username     | TEXT
level        | INTEGER  ← Harus sama dengan user_metadata.level
exp          | INTEGER  ← Harus sama dengan user_metadata.exp
avatar_url   | TEXT
banner_url   | TEXT
bio          | TEXT
created_at   | TIMESTAMP
```

---

## 🎯 Kesimpulan

**Masalah:** Data level & EXP disimpan di 2 tempat dan tidak sinkron

**Solusi:** Selalu update KEDUA tempat, atau gunakan script yang sudah diperbaiki

**Script yang Sudah Fix:**
- ✅ `npm run update-level` - Update level & EXP
- ✅ `npm run sync-admin` - Sync data admin
- ✅ `npm run sync-profiles` - Sync semua user

**Best Practice:**
1. Gunakan script terminal (otomatis sync)
2. Jika edit manual, edit di KEDUA tempat
3. Jalankan `npm run sync-profiles` setelah migrasi/import data

---

## 📝 Command Quick Reference

```bash
# Update level & EXP user (sync ke kedua tempat)
npm run update-level

# Sync semua user dari auth → profiles
npm run sync-profiles

# Sync data admin baru
npm run sync-admin

# Test koneksi Supabase
npm run test-supabase
```

---

**Update Terakhir**: 3 Juli 2026  
**Status**: ✅ Fixed - Semua script sudah sync ke kedua tempat
