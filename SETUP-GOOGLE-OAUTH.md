# 🔐 SETUP GOOGLE OAUTH - VALORANIME

Panduan lengkap untuk mengaktifkan login Google di Valoranime.

---

## 🎯 MASALAH

Login Google error karena Google OAuth belum disetup di Supabase.

---

## 🚀 SOLUSI (10 MENIT)

### **STEP 1: Setup di Google Cloud Console** (5 menit)

#### **A. Buat Project**

1. Buka: **https://console.cloud.google.com**
2. Login dengan Google account
3. Klik dropdown project → **"New Project"**
4. Nama: `Valoranime`
5. Klik **"Create"**
6. Tunggu project dibuat (~30 detik)

#### **B. Enable Google+ API** (Opsional untuk project baru)

1. Search bar: ketik **"Google+ API"**
2. Klik **"Enable"** (jika muncul)

#### **C. Buat OAuth Consent Screen**

1. Di sidebar kiri: **APIs & Services** → **OAuth consent screen**
2. User Type: Pilih **"External"**
3. Klik **"Create"**
4. Isi form:
   - **App name**: `Valoranime`
   - **User support email**: (email Anda)
   - **Developer contact**: (email Anda)
5. Klik **"Save and Continue"**
6. **Scopes**: Skip (klik "Save and Continue")
7. **Test users**: Skip (klik "Save and Continue")
8. Klik **"Back to Dashboard"**

#### **D. Buat OAuth Client ID**

1. Di sidebar kiri: **APIs & Services** → **Credentials**
2. Klik **"+ Create Credentials"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: `Valoranime Web Client`
5. **Authorized JavaScript origins**: Tambahkan:
   ```
   https://vecrgajrdhicqvggpbea.supabase.co
   https://your-domain.vercel.app
   ```
   
6. **Authorized redirect URIs**: Tambahkan:
   ```
   https://vecrgajrdhicqvggpbea.supabase.co/auth/v1/callback
   ```
   
7. Klik **"Create"**

#### **E. Copy Credentials**

Setelah dibuat, akan muncul popup dengan:
- **Client ID**: Copy ini! (contoh: `123456.apps.googleusercontent.com`)
- **Client Secret**: Copy ini! (contoh: `GOCSPX-xxxx`)

**⚠️ SIMPAN KEDUANYA!** Anda akan memasukkannya ke Supabase.

---

### **STEP 2: Setup di Supabase** (3 menit)

#### **A. Enable Google Provider**

1. Buka: **https://supabase.com/dashboard**
2. Pilih project: **valoranime**
3. Sidebar kiri: **Authentication** → **Providers**
4. Scroll cari **Google**
5. Toggle **"Enable"** (jadi hijau)

#### **B. Masukkan Credentials**

1. **Client ID (for OAuth)**: Paste Client ID dari Google Cloud
2. **Client Secret (for OAuth)**: Paste Client Secret dari Google Cloud
3. Klik **"Save"**

#### **C. Copy Callback URL**

Di bagian bawah form Google, ada **"Callback URL (for OAuth)"**:
```
https://vecrgajrdhicqvggpbea.supabase.co/auth/v1/callback
```

Copy URL ini untuk step berikutnya.

---

### **STEP 3: Update Redirect URL di Google Cloud** (2 menit)

1. Kembali ke: **Google Cloud Console** → **Credentials**
2. Klik OAuth client yang baru dibuat
3. Di **"Authorized redirect URIs"**, pastikan sudah ada:
   ```
   https://vecrgajrdhicqvggpbea.supabase.co/auth/v1/callback
   ```
4. **Jika belum**, klik **"+ ADD URI"** dan paste URL dari Supabase
5. Klik **"Save"**

---

### **STEP 4: Test Login Google**

1. Buka website production: `https://your-domain.vercel.app`
2. Klik **"Login"** (biasanya di navbar)
3. Klik tombol **"Lanjutkan dengan Google"**
4. Pilih akun Google
5. ✅ **Berhasil login!**

---

## 🔍 WHERE IS GOOGLE LOGIN BUTTON?

Login Google ada di halaman: **`/login`**

URL: `https://your-domain.vercel.app/login`

Button: **"Lanjutkan dengan Google"** (tombol putih dengan logo Google)

---

## 🆘 TROUBLESHOOTING

### ❌ Error: "redirect_uri_mismatch"

**Penyebab:** Redirect URI di Google Cloud tidak cocok dengan Supabase.

**Solusi:**
1. Cek Redirect URI di Google Cloud harus **PERSIS** seperti ini:
   ```
   https://vecrgajrdhicqvggpbea.supabase.co/auth/v1/callback
   ```
2. Tidak ada spasi, tidak ada typo
3. Save di Google Cloud

---

### ❌ Error: "invalid_client"

**Penyebab:** Client ID atau Client Secret salah.

**Solusi:**
1. Copy ulang Client ID & Secret dari Google Cloud
2. Paste ulang ke Supabase
3. Save

---

### ❌ Error: "access_denied"

**Penyebab:** User membatalkan login atau OAuth consent screen belum disetup.

**Solusi:**
1. Pastikan OAuth consent screen sudah dibuat
2. Publishing status bisa "Testing" (tidak perlu "Production")
3. Jika "Testing", tambahkan email user ke Test users

---

### ❌ Login Google tidak muncul

**Penyebab:** Google provider belum dienable di Supabase.

**Solusi:**
1. Supabase Dashboard → Authentication → Providers
2. Toggle Google ke **"Enabled"**
3. Save

---

## 📋 CHECKLIST

- [ ] Google Cloud Project dibuat
- [ ] OAuth Consent Screen disetup
- [ ] OAuth Client ID dibuat
- [ ] Client ID & Secret di-copy
- [ ] Google Provider dienable di Supabase
- [ ] Client ID & Secret dipaste ke Supabase
- [ ] Redirect URI ditambahkan di Google Cloud
- [ ] Test login Google berhasil

---

## 🎯 URLS PENTING

**Google Cloud Console:**
- https://console.cloud.google.com/apis/credentials

**Supabase Authentication:**
- https://supabase.com/dashboard/project/vecrgajrdhicqvggpbea/auth/providers

**Login Page:**
- https://your-domain.vercel.app/login

---

## 🔐 SECURITY NOTES

- **Client Secret** adalah rahasia! Jangan share ke publik
- **Client ID** boleh dilihat publik (ada di frontend)
- Redirect URI harus **HTTPS**, tidak boleh HTTP
- Untuk production, set OAuth consent screen ke "Production"

---

## 📝 SUMMARY

**Yang Anda butuhkan:**
1. ✅ Google Cloud Project
2. ✅ OAuth Client ID & Secret
3. ✅ Enable di Supabase
4. ✅ Redirect URI setup dengan benar

**Total waktu:** ~10 menit

**Setelah setup:** Login Google langsung work! ✅

---

**Need help?** Baca troubleshooting section di atas atau lihat Google/Supabase documentation.
