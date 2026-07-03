-- ==============================================================================
-- 🔄 AUTO-SYNC TRIGGER: User Metadata → Profiles Table
-- ==============================================================================
-- Trigger ini akan otomatis update tabel profiles setiap kali:
-- 1. User metadata (level, exp, display_name) diupdate di auth.users
-- 2. User baru dibuat
--
-- Cara Install:
-- 1. Buka Supabase Dashboard > SQL Editor
-- 2. Copy semua kode ini
-- 3. Paste dan klik "Run"
-- ==============================================================================

-- 1️⃣ FUNCTION: Sync user metadata ke profiles saat UPDATE
CREATE OR REPLACE FUNCTION public.sync_user_metadata_to_profiles()
RETURNS TRIGGER AS $$
BEGIN
  -- Update atau insert ke tabel profiles
  INSERT INTO public.profiles (
    id,
    username,
    level,
    exp,
    avatar_url,
    banner_url
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'level')::integer, 1),
    COALESCE((NEW.raw_user_meta_data->>'exp')::integer, 0),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'banner_url', '')
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    username = COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    level = COALESCE((NEW.raw_user_meta_data->>'level')::integer, 1),
    exp = COALESCE((NEW.raw_user_meta_data->>'exp')::integer, 0),
    avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
    banner_url = COALESCE(NEW.raw_user_meta_data->>'banner_url', profiles.banner_url);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2️⃣ DROP trigger lama jika ada
DROP TRIGGER IF EXISTS on_auth_user_metadata_updated ON auth.users;

-- 3️⃣ CREATE trigger baru untuk UPDATE
CREATE TRIGGER on_auth_user_metadata_updated
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW
  WHEN (
    OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data
  )
  EXECUTE FUNCTION public.sync_user_metadata_to_profiles();

-- 4️⃣ UPDATE trigger untuk user baru (sudah ada, tapi diperbaiki)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    level,
    exp,
    avatar_url
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'level')::integer, 1),
    COALESCE((NEW.raw_user_meta_data->>'exp')::integer, 0),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ✅ SELESAI! Sekarang setiap kali Anda update User Metadata, otomatis sync!
-- ==============================================================================

-- 🧪 TEST (Opsional - Uncomment untuk test):
-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(
--   jsonb_set(raw_user_meta_data, '{level}', '99'),
--   '{exp}', '9999'
-- )
-- WHERE email = 'alwismith76@gmail.com';
-- 
-- SELECT id, username, level, exp FROM profiles WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'alwismith76@gmail.com'
-- );
