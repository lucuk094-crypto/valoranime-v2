import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

/**
 * API untuk mengambil stats user (level, exp) secara real-time dari Supabase
 * GET /api/user/stats
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

    // Return level and exp from user_metadata
    return NextResponse.json({
      level: user.user_metadata?.level || 1,
      exp: user.user_metadata?.exp || 0,
      display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      role: user.user_metadata?.role || 'User',
      is_banned: user.user_metadata?.is_banned || false,
    });
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
