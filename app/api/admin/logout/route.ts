import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear all auth cookies
    cookieStore.delete('valora_access_token');
    cookieStore.delete('valora_refresh_token');
    cookieStore.delete('valora_admin_auth');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout gagal' },
      { status: 500 }
    );
  }
}
