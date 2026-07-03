# 🚀 QUICK DEPLOY GUIDE - VALORANIME KE VERCEL

Panduan super cepat deploy ke Vercel dalam 5-10 menit!

---

## ⚡ STEP-BY-STEP DEPLOYMENT

### **STEP 1: Push ke GitHub** (2 menit)

Buka terminal di project ini, lalu jalankan:

```bash
# Jika belum init git
git init
git add .
git commit -m "Add admin system with Supabase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/valoranime.git
git push -u origin main
```

**Jika sudah ada repository:**
```bash
git add .
git commit -m "Update admin system"
git push origin main
```

---

### **STEP 2: Deploy ke Vercel** (5 menit)

#### **A. Import Project**

1. Buka: **https://vercel.com**
2. Login dengan GitHub
3. Klik **"New Project"**
4. Pilih repository **valoranime**
5. Klik **"Import"**

#### **B. Setup Environment Variables**

**⚠️ PENTING!** Sebelum klik Deploy, tambahkan environment variables:

Klik **"Environment Variables"** lalu tambahkan 3 variables ini:

**Copy dari file `VERCEL-ENV-SETUP.txt` atau dari sini:**

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://vecrgajrdhicqvggpbea.supabase.co`
- Environment: ☑ Production ☑ Preview ☑ Development

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlY3JnYWpyZGhpY3F2Z2dwYmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNDQ2OTQsImV4cCI6MjA5ODYyMDY5NH0.nmXs_vOmEATuxMqpBFUjqhogJ_EfTtB5AV9itazp0mk`
- Environment: ☑ Production ☑ Preview ☑ Development

**Variable 3:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlY3JnYWpyZGhpY3F2Z2dwYmVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA0NDY5NCwiZXhwIjoyMDk4NjIwNjk0fQ.jjmR_MPQuZDR5P1V-YIkSCkiQ3dK2HHcwJnC-ynpHAs`
- Environment: ☑ Production ☑ Preview ☑ Development

#### **C. Deploy**

1. Klik **"Deploy"**
2. Tunggu 2-3 menit...
3. ✅ **Selesai!**

---

### **STEP 3: Get Your URL** (1 menit)

Setelah deploy berhasil:

1. Vercel akan memberikan URL otomatis, contoh:
   ```
   https://valoranime.vercel.app
   https://valoranime-git-main-yourusername.vercel.app
   ```

2. URL ini sudah **pendek dan siap pakai!**

3. Untuk custom domain yang lebih pendek:
   - Settings → Domains → Add
   - Contoh: `valoranime.vercel.app` (default sudah bagus!)

---

### **STEP 4: Test Production** (1 menit)

1. Buka: `https://your-url.vercel.app/admin/login`
2. Login dengan:
   - Email: `admin@valoranime.com`
   - Password: `newpassword123`
3. ✅ **Login berhasil! Supabase tetap tersambung!**

---

## 🎯 CARA ATUR ADMIN/USER/EXP/LEVEL DI PRODUCTION

### **Cara 1: Via Admin Panel (Browser)**

1. Login di production: `https://your-url.vercel.app/admin/login`
2. Buka: `https://your-url.vercel.app/admin/users`
3. Klik user yang mau diupdate
4. Edit level, exp, role, dll

### **Cara 2: Via Supabase Dashboard**

1. Buka: https://supabase.com/dashboard
2. Pilih project: **valoranime**
3. **Table Editor** → **profiles**
4. Edit langsung di table:
   - `level` - Level user
   - `exp` - Experience points
   - `title` - Title/jabatan user

### **Cara 3: Via API**

Call API endpoint dari mana saja:

```javascript
// Update user
fetch('https://your-url.vercel.app/api/admin/users/USER_ID', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    level: 99,
    exp: 50000,
    role: 'Admin'
  })
});
```

---

## 📊 MANAGEMENT COMMANDS (Production)

Anda bisa jalankan script dari local untuk manage production database:

```bash
# Test koneksi ke production
npm run test-supabase

# Buat admin baru (otomatis ke production database)
npm run quick-admin

# Reset password user
npm run reset-password
```

**Semua script langsung akses Supabase production!** Karena menggunakan keys yang sama.

---

## 🔗 URLS PENTING

Setelah deploy, save URLs ini:

| URL | Fungsi |
|-----|--------|
| `https://your-url.vercel.app` | Homepage production |
| `https://your-url.vercel.app/admin/login` | Admin login |
| `https://your-url.vercel.app/admin/create-user` | Create user |
| `https://vercel.com/dashboard` | Vercel dashboard |
| `https://supabase.com/dashboard` | Supabase dashboard |

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Code sudah di-push ke GitHub
- [ ] Project di-import di Vercel
- [ ] 3 environment variables sudah ditambahkan
- [ ] Deployment berhasil (status: Ready)
- [ ] Bisa akses homepage production
- [ ] Bisa login di `/admin/login`
- [ ] Supabase tersambung (data user muncul)
- [ ] Save URL production untuk reference

---

## 🆘 TROUBLESHOOTING

### ❌ Error saat deploy: "Environment variable not found"

**Solusi:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Pastikan 3 variables sudah ditambahkan
3. Redeploy: Deployments → ... → Redeploy

### ❌ Login redirect ke login lagi

**Solusi:**
- Sama seperti local, cek user metadata di Supabase
- Pastikan ada `"role": "Superadmin"` atau `"role": "Admin"`

### ❌ 500 Internal Server Error

**Solusi:**
1. Vercel Dashboard → Project → Logs
2. Cek error message
3. Biasanya karena environment variables salah atau belum diset

---

## 🎉 SELAMAT!

Website Valoranime Anda sekarang sudah **LIVE di internet** dan bisa diakses siapa saja!

**Supabase tetap tersambung**, jadi Anda bisa:
- ✅ Manage admin/user dari mana saja
- ✅ Update level, exp, title via Supabase Dashboard
- ✅ Monitor users secara realtime
- ✅ Scale tanpa batasan!

**URL Anda siap dipublic!** 🚀

---

**Need help?** Baca `PANDUAN-LENGKAP.md` Section 8 untuk detail lengkap.
