'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'User',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal membuat user');
        setLoading(false);
        return;
      }

      // Success
      setSuccess(`${formData.role} berhasil dibuat! Redirect ke halaman users...`);
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        displayName: '',
        role: 'User',
      });

      // Redirect setelah 2 detik
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (err: any) {
      console.error('Create user error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Kembali ke Users
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Buat User / Admin Baru</h1>
          <p className="text-zinc-400">Tambahkan user atau admin baru ke sistem Valoranime</p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-800/50 text-red-400 text-sm px-4 py-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-900/20 border border-green-800/50 text-green-400 text-sm px-4 py-3 rounded-xl font-medium">
                {success}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">Password minimal 6 karakter</p>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Display Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Nama tampilan (opsional)"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">Kosongkan untuk menggunakan username dari email</p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Role <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="User">User - User biasa</option>
                  <option value="Admin">Admin - Manage users & content</option>
                  <option value="Superadmin">Superadmin - Full access</option>
                </select>
              </div>
              <div className="mt-2 text-xs text-zinc-400 space-y-1">
                <p>• <span className="text-zinc-300">User</span>: User biasa dengan akses terbatas</p>
                <p>• <span className="text-zinc-300">Admin</span>: Bisa manage users dan konten</p>
                <p>• <span className="text-zinc-300">Superadmin</span>: Full access, bisa create admin</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Membuat...'
                ) : (
                  <>
                    <UserPlus size={18} />
                    Buat User
                  </>
                )}
              </button>

              <Link
                href="/admin/users"
                className="px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-all border border-zinc-700"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-900/20 border border-blue-800/50 rounded-xl p-4">
          <p className="text-blue-300 text-sm">
            <strong>ℹ️ Info:</strong> User yang dibuat akan langsung aktif dan bisa login.
            Password harus minimal 6 karakter untuk keamanan.
          </p>
        </div>
      </div>
    </div>
  );
}
