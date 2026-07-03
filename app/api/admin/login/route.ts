import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Login menggunakan Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Check if user is admin/developer
    const role = data.user?.user_metadata?.role || 'User';
    const allowedRoles = ['Admin', 'Superadmin', 'Developer', 'Moderator'];
    
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya admin/developer yang bisa login di sini' },
        { status: 403 }
      );
    }

    // Check if banned
    const isBanned = data.user?.user_metadata?.is_banned || false;
    if (isBanned) {
      const banReason = data.user?.user_metadata?.ban_reason || 'Tidak ada alasan';
      return NextResponse.json(
        { error: `Akun Anda telah dibanned. Alasan: ${banReason}` },
        { status: 403 }
      );
    }

    // Set cookies
    const cookieStore = await cookies();
    cookieStore.set('valora_access_token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: '/',
    });

    cookieStore.set('valora_refresh_token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: '/',
    });

    // Set legacy auth cookie untuk kompatibilitas
    cookieStore.set('valora_admin_auth', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        display_name: data.user.user_metadata?.display_name || data.user.email?.split('@')[0],
        role: role,
      },
    });
  } catch (error: any) {
    console.error('Login catch error:', error);
    return NextResponse.json(
      { error: 'Login gagal. Silakan coba lagi' },
      { status: 500 }
    );
  }
}
