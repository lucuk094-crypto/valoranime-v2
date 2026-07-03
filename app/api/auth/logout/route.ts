import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('valora_session')?.value;

    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    // Clear cookie
    cookieStore.delete('valora_session');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout gagal' },
      { status: 500 }
    );
  }
}
