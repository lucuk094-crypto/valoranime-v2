import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

/**
 * API untuk refresh user data dari Supabase
 * GET /api/refresh-user
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('valora_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get fresh user data from Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return fresh data
    return NextResponse.json({
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
      level: user.user_metadata?.level || 1,
      exp: user.user_metadata?.exp || 0,
      role: user.user_metadata?.role || 'User',
      display_name: user.user_metadata?.display_name || user.email?.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url,
      is_verified: user.user_metadata?.is_verified || false,
    });
  } catch (error: any) {
    console.error('Error refreshing user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
