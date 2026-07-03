import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('valora_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Tidak ada session' },
        { status: 401 }
      );
    }

    const user = await verifySession(sessionToken);

    if (!user) {
      cookieStore.delete('valora_session');
      return NextResponse.json(
        { error: 'Session tidak valid' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        display_name: user.display_name,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Gagal mendapatkan data user' },
      { status: 500 }
    );
  }
}
