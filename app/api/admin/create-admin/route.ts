import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, createAdminUser } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
  try {
    // Verify admin session
    const { user, error: authError } = await verifyAdminSession();
    if (authError) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Only superadmin atau admin pertama yang bisa create admin
    if (user.role !== 'Superadmin' && user.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Hanya Superadmin yang bisa membuat admin baru' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, password, displayName, role = 'Admin' } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Validasi role
    if (role !== 'Admin' && role !== 'User' && role !== 'Superadmin') {
      return NextResponse.json(
        { error: 'Role harus Admin, User, atau Superadmin' },
        { status: 400 }
      );
    }

    // Create admin user
    const { user: newUser, error } = await createAdminUser(
      email,
      password,
      displayName,
      role
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `${role} berhasil dibuat`,
      user: {
        id: newUser?.id,
        email: newUser?.email,
        display_name: displayName || email.split('@')[0],
        role: role,
      },
    });
  } catch (error: any) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal membuat admin' },
      { status: 500 }
    );
  }
}
