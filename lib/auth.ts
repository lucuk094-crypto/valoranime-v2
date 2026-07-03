import { supabase, supabaseAdmin } from './supabase';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin' | 'superadmin';
  is_active: boolean;
  display_name: string | null;
  profile_picture: string | null;
  created_at: string;
  last_login: string | null;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
}

/**
 * Hash password menggunakan bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify password dengan hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate random session token
 */
export function generateSessionToken(): string {
  return `${Date.now()}.${Math.random().toString(36).substring(2, 15)}.${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Create session baru untuk user
 */
export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Session valid 7 hari

  const { data, error } = await supabaseAdmin
    .from('sessions')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Session;
}

/**
 * Verify session token
 */
export async function verifySession(token: string): Promise<User | null> {
  const { data: session, error } = await supabaseAdmin
    .from('sessions')
    .select('*, users(*)')
    .eq('token', token)
    .gte('expires_at', new Date().toISOString())
    .single();

  if (error || !session) return null;

  // Update last_login
  await supabaseAdmin
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', session.user_id);

  return session.users as User;
}

/**
 * Delete session (logout)
 */
export async function deleteSession(token: string) {
  const { error } = await supabaseAdmin
    .from('sessions')
    .delete()
    .eq('token', token);

  if (error) throw error;
}

/**
 * Log activity ke database
 */
export async function logActivity(
  userId: string | null,
  action: string,
  description?: string,
  ipAddress?: string
) {
  await supabaseAdmin.from('activity_logs').insert({
    user_id: userId,
    action,
    description,
    ip_address: ipAddress,
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data as User;
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) return null;
  return data as User;
}

/**
 * Create new user
 */
export async function createUser(
  email: string,
  username: string,
  password: string,
  role: 'user' | 'admin' | 'superadmin' = 'user',
  displayName?: string
) {
  const passwordHash = await hashPassword(password);

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      email,
      username,
      password_hash: passwordHash,
      role,
      display_name: displayName || username,
    })
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

/**
 * Login user
 */
export async function loginUser(
  emailOrUsername: string,
  password: string,
  ipAddress?: string,
  userAgent?: string
) {
  // Cari user by email atau username
  let user = await getUserByEmail(emailOrUsername);
  if (!user) {
    user = await getUserByUsername(emailOrUsername);
  }

  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  if (!user.is_active) {
    throw new Error('Akun Anda telah dinonaktifkan');
  }

  // Verify password
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('password_hash')
    .eq('id', user.id)
    .single();

  if (!userData) {
    throw new Error('Data user tidak ditemukan');
  }

  const isValid = await verifyPassword(password, userData.password_hash);
  if (!isValid) {
    await logActivity(user.id, 'login_failed', 'Password salah', ipAddress);
    throw new Error('Password salah');
  }

  // Create session
  const session = await createSession(user.id, ipAddress, userAgent);

  // Log activity
  await logActivity(user.id, 'login_success', 'Login berhasil', ipAddress);

  return { user, session };
}
