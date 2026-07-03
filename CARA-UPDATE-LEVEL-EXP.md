# 🎮 Cara Update Level & EXP User di Supabase

## ✅ Fitur Baru: Real-Time Sync Level & EXP

Website sekarang sudah **otomatis sinkronisasi** level & EXP dari Supabase!

### 🔄 Cara Kerja:
1. **Fetch Real-Time**: Setiap kali halaman profile dibuka, data level & EXP diambil langsung dari Supabase
2. **Auto-Refresh**: Data otomatis refresh setiap **10 detik** tanpa perlu reload halaman
3. **Instant Update**: Perubahan level/EXP di Supabase langsung terlihat di website dalam maksimal 10 detik

---

## 📝 Cara Update Level & EXP di Supabase

### Metode 1: Melalui Supabase Dashboard (Paling Mudah)

1. **Login ke Supabase Dashboard**: https://supabase.com/dashboard
2. **Pilih Project**: `vecrgajrdhicqvggpbea`
3. **Buka Authentication**: Klik menu **Authentication** → **Users**
4. **Cari User**: Cari email user yang mau diupdate
5. **Edit User Metadata**:
   - Klik user tersebut
   - Scroll ke bagian **User Metadata**
   - Edit JSON:
     ```json
     {
       "level": 99,
       "exp": 5000,
       "display_name": "Alwiy313",
       "role": "Superadmin"
     }
     ```
   - Klik **Save**
6. **Cek Website**: Dalam maksimal 10 detik, perubahan akan terlihat di website!

---

### Metode 2: Melalui API (Update Bulk/Otomatis)

Gunakan endpoint: `POST /api/update-exp`

**Request:**
```json
{
  "userId": "d67cafb9-5217-40e3-8b54-ba4913ff72e6",
  "expToAdd": 100
}
```

**Response:**
```json
{
  "success": true,
  "newLevel": 10,
  "newExp": 50
}
```

---

### Metode 3: Melalui Script Terminal (Advanced)

Buat script baru atau gunakan existing script untuk update level/exp:

```typescript
// scripts/update-level-exp.ts
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updateUserLevelExp(email: string, level: number, exp: number) {
  // 1. Cari user by email
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users.users.find(u => u.email === email);
  
  if (!user) {
    console.error('User tidak ditemukan!');
    return;
  }

  // 2. Update user metadata
  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      level: level,
      exp: exp,
    },
  });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('✅ Berhasil update!');
    console.log(`   Email: ${email}`);
    console.log(`   Level: ${level}`);
    console.log(`   EXP: ${exp}`);
  }
}

// Contoh usage
updateUserLevelExp('alwismith76@gmail.com', 99, 9999);
```

Jalankan: `npx tsx scripts/update-level-exp.ts`

---

## 🎯 Tips & Best Practices

### Level System:
- **Level 1-20**: Rookie (User biasa)
- **Level 21-40**: Veteran
- **Level 41-60**: Elite
- **Level 61-80**: Legend
- **Level 81-99**: Mythic
- **Level 100**: Max Level

### EXP System:
- **EXP per Level** = Level × 100
- Contoh:
  - Level 10 butuh 1000 EXP
  - Level 50 butuh 5000 EXP
  - Level 99 butuh 9900 EXP

### Pemberian EXP:
- **Menonton 1 episode**: +10 EXP
- **Menyelesaikan anime**: +50 EXP
- **Komentar pertama**: +5 EXP
- **Daily login**: +20 EXP

---

## 🔍 Troubleshooting

### ❓ Level/EXP tidak berubah di website?

**Solusi:**
1. **Refresh halaman** (F5 atau Ctrl+R)
2. **Tunggu 10 detik** (auto-refresh berjalan)
3. **Clear cache browser** (Ctrl+Shift+Delete)
4. **Logout dan login lagi**

### ❓ Error saat update di Supabase?

**Cek:**
1. Pastikan JSON format benar (pakai double quotes `"`)
2. Pastikan level dan exp adalah **angka** (bukan string)
3. Pastikan environment variables sudah benar di `.env.local`

### ❓ Ingin disable auto-refresh?

Edit file `app/profile/page.tsx`, hapus atau comment baris ini:

```typescript
// Auto-refresh stats setiap 10 detik
const refreshInterval = setInterval(() => {
  // ... kode refresh
}, 10000);
```

---

## 📚 File Terkait

- **API Endpoint**: `app/api/user/stats/route.ts`
- **Profile Page**: `app/profile/page.tsx`
- **Auth Helpers**: `lib/auth-helpers.ts`
- **Sync Admin Script**: `scripts/sync-admin-to-supabase.ts`

---

## 🚀 Update Terbaru (2024)

✅ Real-time level & EXP sync dari Supabase  
✅ Auto-refresh setiap 10 detik  
✅ Instant update tanpa reload halaman  
✅ API endpoint `/api/user/stats` untuk fetch data terbaru  
✅ Fallback ke user metadata jika API gagal  

---

**Catatan**: Data level & EXP disimpan di `auth.users.user_metadata` di Supabase, bukan di tabel `profiles`. Ini memastikan data selalu sinkron dengan authentication system.
