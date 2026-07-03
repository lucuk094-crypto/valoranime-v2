# 🎯 Akses Developer & Admin Dashboard

## ✅ SELESAI: Anda Sudah Jadi Developer!

Script `npm run check-sync` sudah dijalankan dan berhasil:

### 📋 Data Account Anda:

- **Email**: `alwismith76@gmail.com`
- **Password**: `Admin313`
- **Role**: **Developer** ⚡ (Akses Tertinggi!)
- **Level**: **99** (Mythic) 🔴
- **EXP**: **9999**
- **Verified**: ✅
- **User ID**: `d67cafb9-5217-40e3-8b54-ba4913ff72e6`

---

## 🚀 Cara Login & Akses Admin Dashboard

### **Step 1: Logout Dulu (Penting!)**

Jika Anda sedang login di website, **logout dulu** untuk clear cache session lama:

1. Buka https://valoranime-v2.vercel.app
2. Klik profil Anda
3. Klik **"Logout"**

### **Step 2: Login Ulang**

1. Buka https://valoranime-v2.vercel.app/admin/login
2. Login dengan:
   - Email: `alwismith76@gmail.com`
   - Password: `Admin313`
3. Klik **"Login"**

### **Step 3: Akses Admin Dashboard**

Setelah login, Anda bisa akses:

**Admin Panel:**
- **URL**: https://valoranime-v2.vercel.app/admin
- **Direct links:**
  - Dashboard: `/admin`
  - Users Management: `/admin/users`
  - Comments Management: `/admin/comments`
  - Reports: `/admin/reports`
  - Missions: `/admin/missions`
  - Novel Management: `/admin/novel`
  - Settings: `/admin/settings`
  - Create User: `/admin/create-user`

---

## 🎯 Hak Akses Developer

Sebagai **Developer**, Anda punya akses penuh:

✅ **Admin Dashboard** - Kelola semua konten  
✅ **User Management** - Create, edit, delete, ban users  
✅ **Comment Moderation** - Hapus, pin, ban comments  
✅ **Reports** - Handle user reports  
✅ **Chat Moderation** - Pin messages, delete any message  
✅ **Mission Management** - Create daily/weekly missions  
✅ **Novel Management** - Upload, edit, delete novels  
✅ **System Settings** - Ubah config website  
✅ **Nama Hijau di Chat** - Developer badge 🟢  
✅ **Verified Badge** - Centang biru di profil ✅  
✅ **Level 99 (Mythic)** - Level tertinggi 🔴  

---

## 🔄 Jika Level/EXP Tidak Berubah

### **Solusi 1: Logout & Login Ulang (PALING EFEKTIF)**

1. Logout dari website
2. Clear browser cache (Ctrl+Shift+Delete)
3. Login ulang
4. Level & role akan update otomatis

### **Solusi 2: Force Refresh dengan Script**

Jalankan script ini untuk cek dan fix sync:

```bash
npm run check-sync
```

Script ini akan:
- ✅ Cek data di auth.users dan profiles
- ✅ Sinkronkan jika berbeda
- ✅ Set Anda sebagai Developer dengan level 99

### **Solusi 3: Manual Update di Supabase**

Jika masih belum berubah, update manual:

1. **Login ke Supabase Dashboard**: https://supabase.com/dashboard
2. **Authentication → Users**
3. Klik user `alwismith76@gmail.com`
4. Edit **User Metadata**:
   ```json
   {
     "role": "Developer",
     "level": 99,
     "exp": 9999,
     "display_name": "Alwiy313",
     "is_verified": true
   }
   ```
5. **Save**
6. **Table Editor → profiles**
7. Edit row dengan ID Anda:
   ```
   level: 99
   exp: 9999
   role: Developer
   ```
8. **Save**
9. **Logout & Login ulang** di website

### **Solusi 4: Install Trigger Auto-Sync (Recommended)**

Agar setiap update otomatis sync:

1. Buka Supabase → SQL Editor
2. Copy isi file `supabase-trigger-auto-sync.sql`
3. Paste dan Run
4. Trigger akan otomatis sync setiap update

**Setelah install trigger, edit di User Metadata otomatis update ke profiles!**

---

## 📊 Cek Apakah Sudah Berhasil

### **Di Website:**

1. Login ke https://valoranime-v2.vercel.app
2. Klik profil Anda
3. **Cek:**
   - Level: **99** ✅
   - Rank: **Mythic** 🔴
   - Badge: **Verified** ✅
4. **Buka Chat:**
   - Nama Anda harus **hijau** 🟢
   - Ada label **"Developer"**
5. **Navbar:**
   - Ada menu **"Admin"** (jika role admin/developer)

### **Di Supabase:**

**Authentication → Users → (Your email):**
```json
{
  "role": "Developer",
  "level": 99,
  "exp": 9999,
  "is_verified": true
}
```

**Table Editor → profiles:**
```
level: 99
exp: 9999
role: Developer
```

**Keduanya harus SAMA!** ✅

---

## 🎨 Tampilan Developer di Website

### **Di Chat:**
- **Nama**: 🟢 Hijau (Developer color)
- **Badge**: "Developer" atau "Admin"
- **Verified**: ✅ Centang biru
- **Level**: "Lvl 99 - Developer"

### **Di Profile:**
- **Level**: 99 (Mythic) 🔴
- **Badge**: Verified ✅
- **Role Badge**: Developer ⚡

### **Di Admin Panel:**
- Akses penuh ke semua menu
- Bisa create, edit, delete semua konten
- Bisa ban/unban users
- Bisa moderate comments & chat

---

## 🛠️ Command Reference

```bash
# Cek dan fix sync level/exp/role
npm run check-sync

# Update level & EXP manual
npm run update-level

# Sync semua user dari auth → profiles
npm run sync-profiles

# Sync admin data
npm run sync-admin

# Test koneksi Supabase
npm run test-supabase
```

---

## 🔐 Keamanan

Sebagai Developer, Anda punya akses tertinggi. **Jangan share kredensial ini!**

### **Password Security:**
- Gunakan password yang kuat
- Jangan share dengan orang lain
- Ubah password secara berkala

### **Admin Actions:**
- Setiap aksi admin ter-log di database
- Hati-hati saat delete data (tidak bisa undo)
- Backup data penting sebelum edit bulk

---

## 📚 Documentation Reference

- **Panduan Lengkap**: `PANDUAN-LENGKAP.md`
- **Update Level/EXP**: `CARA-UPDATE-LEVEL-EXP.md`
- **Auto-Sync Trigger**: `CARA-INSTALL-AUTO-SYNC-TRIGGER.md`
- **Fix Chat Error**: `CARA-FIX-CHAT-ERROR.md`
- **Deploy Guide**: `DEPLOY-GUIDE.md`

---

## 🎉 Selamat!

Anda sekarang adalah **Developer** website Valoranime dengan akses penuh!

**Next Steps:**
1. ✅ Logout & login ulang di website
2. ✅ Cek level & badge Anda
3. ✅ Akses admin dashboard: `/admin`
4. ✅ Install trigger auto-sync (optional tapi recommended)
5. ✅ Explore semua fitur admin!

**Jika ada masalah atau pertanyaan, check dokumentasi di file-file .md atau tanya saya!** 🚀

---

**Status**: ✅ Developer Access Granted  
**Level**: 99 (Mythic) 🔴  
**Role**: Developer ⚡  
**Verified**: ✅  
**Admin Dashboard**: https://valoranime-v2.vercel.app/admin
