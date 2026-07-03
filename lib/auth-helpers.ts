import { supabaseAdmin } from './supabase';
import { cookies } from 'next/headers';

export interface AuthUser {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  level: number;
  exp: number;
  role: string;
  is_banned: boolean;
  ban_reason?: string;
}

/**
 * Verify session dari cookie dan return user data
 */
export async function verifyAdminSession(): Promise<{ user: AuthUser; error?: string }> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('valora_access_token')?.value;

    if (!accessToken) {
      return { user: null as any, error: 'Tidak ada session' };
    }

    // Verify token dengan Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return { user: null as any, error: 'Session tidak valid' };
    }

    // Check if admin
    const role = user.user_metadata?.role || 'User';
    if (role !== 'Admin' && role !== 'Superadmin') {
      return { user: null as any, error: 'Akses ditolak. Hanya admin yang bisa mengakses' };
    }

    // Get profile data
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const authUser: AuthUser = {
      id: user.id,
      email: user.email || '',
      display_name: profile?.display_name || user.user_metadata?.display_name || user.email?.split('@')[0] || '',
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
      level: profile?.level || user.user_metadata?.level || 1,
      exp: profile?.exp || user.user_metadata?.exp || 0,
      role: role,
      is_banned: user.user_metadata?.is_banned || false,
      ban_reason: user.user_metadata?.ban_reason,
    };

    return { user: authUser };
  } catch (error: any) {
    console.error('Verify admin session error:', error);
    return { user: null as any, error: error.message };
  }
}

/**
 * Create admin user (hanya bisa dipanggil oleh superadmin)
 */
export async function createAdminUser(
  email: string,
  password: string,
  displayName?: string,
  role: 'Admin' | 'User' = 'Admin'
) {
  try {
    // Create user di Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm email
      user_metadata: {
        display_name: displayName || email.split('@')[0],
        role: role,
        level: 1,
        exp: 0,
        is_banned: false,
      },
    });

    if (error) throw error;

    // Create profile entry
    await supabaseAdmin.from('profiles').insert({
      id: data.user.id,
      display_name: displayName || email.split('@')[0],
      level: 1,
      exp: 0,
    });

    return { user: data.user, error: null };
  } catch (error: any) {
    console.error('Create admin user error:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Update user role (hanya admin/superadmin)
 */
export async function updateUserRole(userId: string, role: string) {
  try {
    // Get current user metadata
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
    const currentMeta = user?.user_metadata || {};

    // Update user metadata
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...currentMeta,
        role: role,
      },
    });

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Update user role error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Ban/Unban user
 */
export async function updateUserBanStatus(
  userId: string,
  isBanned: boolean,
  banReason?: string
) {
  try {
    // Get current user metadata
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
    const currentMeta = user?.user_metadata || {};

    // Update user metadata
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...currentMeta,
        is_banned: isBanned,
        ban_reason: banReason || '',
      },
    });

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Update user ban status error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete user completely
 */
export async function deleteUser(userId: string) {
  try {
    // Delete from auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // Delete from profiles
    await supabaseAdmin.from('profiles').delete().eq('id', userId);

    // Delete comments
    await supabaseAdmin.from('comments').delete().eq('user_id', userId);

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Delete user error:', error);
    return { success: false, error: error.message };
  }
}
