# 🔧 Cara Fix Error Forum Chat

## ❌ Masalah yang Terjadi

Ketika Anda mencoba kirim pesan di forum chat, muncul error karena:

**Root Cause:** Struktur tabel `global_messages` di database **tidak sesuai** dengan yang dibutuhkan kode chat.

### Tabel Saat Ini (Salah):
```sql
global_messages (
  id UUID,
  user_id UUID,
  content TEXT,
  reply_to UUID,
  is_pinned BOOLEAN,
  is_edited BOOLEAN,
  created_at TIMESTAMP
)
```

### Yang Dibutuhkan Kode Chat (Benar):
```sql
global_messages (
  id UUID,
  user_id UUID,
  content TEXT,
  reply_to UUID,
  is_pinned BOOLEAN,
  is_edited BOOLEAN,
  created_at TIMESTAMP,
  -- Kolom yang HILANG:
  username TEXT,
  avatar_text TEXT,
  avatar_color TEXT,
  name_color TEXT,
  roles TEXT[],
  role_color TEXT,
  level_text TEXT,
  is_verified BOOLEAN,
  reply_to_username TEXT,
  avatar_url TEXT,
  audio_url TEXT
)
```

**Kesimpulan:** Tabel `global_messages` kurang **11 kolom**!

---

## ✅ Solusi: Update Tabel global_messages

### **Langkah 1: Buka Supabase SQL Editor**

1. Login ke https://supabase.com/dashboard
2. Pilih project `vecrgajrdhicqvggpbea`
3. Klik **SQL Editor** di sidebar kiri
4. Klik **"+ New query"**

### **Langkah 2: Copy SQL Fix**

1. Buka file: `fix-global-messages-table.sql` (di root project ini)
2. Copy **SEMUA isi file** (Ctrl+A → Ctrl+C)

### **Langkah 3: Paste & Run**

1. Paste di SQL Editor (Ctrl+V)
2. Klik **"Run"** (atau Ctrl+Enter)
3. Tunggu muncul hasil query

**Expected Output:**
```
column_name        | data_type
-------------------|-----------
id                 | uuid
user_id            | uuid
content            | text
reply_to           | uuid
is_pinned          | boolean
is_edited          | boolean
created_at         | timestamp with time zone
username           | text           ← BARU
avatar_text        | text           ← BARU
avatar_color       | text           ← BARU
name_color         | text           ← BARU
roles              | ARRAY          ← BARU
role_color         | text           ← BARU
level_text         | text           ← BARU
is_verified        | boolean        ← BARU
reply_to_username  | text           ← BARU
avatar_url         | text           ← BARU
audio_url          | text           ← BARU
```

**✅ Jika semua kolom muncul, fix berhasil!**

---

## 🧪 Test Chat Setelah Fix

### **Test 1: Kirim Pesan Teks**

1. Buka website: https://valoranime-v2.vercel.app
2. Login dengan akun Anda
3. Klik icon **Chat** di navbar
4. Ketik pesan: `Halo, testing chat!`
5. Klik **Send** atau tekan Enter

**Expected:** Pesan terkirim tanpa error ✅

### **Test 2: Reply Pesan**

1. Klik tombol **3 titik** (•••) di pesan orang lain
2. Klik **"Balas"**
3. Ketik pesan Anda
4. Send

**Expected:** Pesan reply terkirim dengan mention ✅

### **Test 3: Pin Pesan (Khusus Admin/Developer)**

1. Klik tombol **3 titik** (•••) di pesan
2. Klik **"Pin"**

**Expected:** Pesan ter-pin dan muncul di bagian atas chat ✅

---

## 🎯 Fitur Chat yang Sudah Fix

Setelah update tabel, semua fitur ini akan bekerja:

✅ **Kirim pesan teks**  
✅ **Reply/Balas pesan**  
✅ **Edit pesan** (untuk owner)  
✅ **Hapus pesan** (untuk owner & admin)  
✅ **Pin pesan** (untuk admin)  
✅ **Mention user** (@username)  
✅ **Emoji picker**  
✅ **Voice note** (pesan suara) - jika storage sudah disetup  
✅ **Real-time chat** (otomatis update tanpa refresh)  
✅ **Online counter** (jumlah user online)  
✅ **Level & rank display** (tampilkan level user di chat)  

---

## 🔧 Troubleshooting

### ❌ Error: "column 'username' does not exist"

**Artinya:** SQL fix belum dijalankan atau gagal.

**Solusi:**
1. Jalankan lagi SQL fix di Supabase SQL Editor
2. Pastikan tidak ada error saat run
3. Refresh website dan test lagi

### ❌ Error: "permission denied for table global_messages"

**Artinya:** RLS (Row Level Security) aktif dan policy belum disetup.

**Solusi:**
Jalankan di SQL Editor:
```sql
ALTER TABLE public.global_messages DISABLE ROW LEVEL SECURITY;
```

### ❌ Voice note tidak bisa dikirim

**Artinya:** Storage bucket `chat_media` belum dibuat.

**Solusi:**
1. **Storage → Buckets**
2. Klik **"New bucket"**
3. Name: `chat_media`
4. Public: **Yes** (centang)
5. Create
6. **Policies**: Add policy untuk INSERT public

### ❌ Chat tidak real-time / tidak auto-update

**Artinya:** Realtime di Supabase belum aktif.

**Solusi:**
1. **Database → Replication**
2. Pilih tabel `global_messages`
3. Toggle **Enable Realtime**
4. Save

---

## 📊 Struktur Tabel global_messages (Setelah Fix)

```sql
CREATE TABLE public.global_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    reply_to UUID REFERENCES public.global_messages(id) ON DELETE SET NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Kolom tambahan untuk rich chat experience:
    username TEXT,
    avatar_text TEXT,
    avatar_color TEXT DEFAULT 'bg-zinc-700',
    name_color TEXT DEFAULT 'text-zinc-100',
    roles TEXT[] DEFAULT '{}',
    role_color TEXT DEFAULT 'text-zinc-500',
    level_text TEXT DEFAULT 'Lvl 1 - Rookie',
    is_verified BOOLEAN DEFAULT FALSE,
    reply_to_username TEXT,
    avatar_url TEXT,
    audio_url TEXT
);

-- Disable RLS untuk kemudahan development
ALTER TABLE public.global_messages DISABLE ROW LEVEL SECURITY;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_messages;
```

---

## 🎨 Fitur Chat Lengkap

### **User Level Display:**
- Lvl 1-20: 🟢 Rookie
- Lvl 21-40: 🔵 Veteran
- Lvl 41-60: 🟣 Elite
- Lvl 61-80: 🟠 Legend
- Lvl 81-99: 🔴 Mythic

### **Special Roles:**
- **Developer/Admin**: Nama hijau + badge verified
- **VIP**: Nama kuning + badge
- **Verified User**: Badge biru centang

### **Interaksi:**
- **Klik avatar**: Buka profil user
- **Klik 3 titik**: Menu (Reply, Edit, Delete, Pin)
- **Ketik @username**: Mention user
- **Klik emoji icon**: Emoji picker
- **Hold mic icon**: Record voice note

---

## 📝 Quick Commands

```bash
# Setelah fix SQL, commit changes:
git add .
git commit -m "fix: Update global_messages table structure for chat"
git push origin main
```

---

## 🎉 Kesimpulan

**Masalah:** Tabel `global_messages` kurang kolom → Chat error  
**Solusi:** Jalankan `fix-global-messages-table.sql` di Supabase  
**Hasil:** Chat berfungsi normal ✅  

**Setelah fix, chat akan bekerja sempurna dengan semua fitur!** 🚀

---

**File SQL Fix**: `fix-global-messages-table.sql`  
**Status**: ⏳ Belum terinstall (Jalankan SQL di Supabase Dashboard)  
**Setelah Install**: ✅ Chat ready to use!
