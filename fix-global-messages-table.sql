-- ==============================================================================
-- 🔧 FIX: Update Tabel global_messages untuk Chat
-- ==============================================================================
-- Tabel global_messages saat ini tidak punya kolom yang dibutuhkan chat.
-- Script ini akan menambahkan kolom yang hilang.
--
-- Cara Install:
-- 1. Buka Supabase Dashboard > SQL Editor
-- 2. Copy semua kode ini
-- 3. Paste dan klik "Run"
-- ==============================================================================

-- Tambahkan kolom yang hilang
ALTER TABLE public.global_messages 
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS avatar_text TEXT,
ADD COLUMN IF NOT EXISTS avatar_color TEXT DEFAULT 'bg-zinc-700',
ADD COLUMN IF NOT EXISTS name_color TEXT DEFAULT 'text-zinc-100',
ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS role_color TEXT DEFAULT 'text-zinc-500',
ADD COLUMN IF NOT EXISTS level_text TEXT DEFAULT 'Lvl 1 - Rookie',
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reply_to_username TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Update constraint id menjadi SERIAL jika perlu (untuk auto-increment)
-- Catatan: Jika id sudah UUID, skip ini
-- ALTER TABLE public.global_messages ALTER COLUMN id TYPE BIGSERIAL;

-- Verifikasi kolom berhasil ditambahkan
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'global_messages' 
ORDER BY ordinal_position;

-- ==============================================================================
-- ✅ SELESAI! Tabel global_messages sudah diupdate!
-- ==============================================================================
