import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

interface FeedbackRequest {
  type: 'question' | 'bug' | 'feature' | 'other';
  message: string;
}

/**
 * POST /api/feedback
 * Submit user feedback
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Get user (optional - feedback can be anonymous)
    const { data: { user } } = await supabase.auth.getUser();

    // Parse request body
    const body = (await request.json()) as FeedbackRequest;
    const { type, message } = body;

    // Validate
    if (!type || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Type and message are required' },
        { status: 400 }
      );
    }

    // Check if feedback table exists, if not just log it
    // This allows the feature to work even without the database table
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from('feedback')
        .insert({
          user_id: user?.id || null,
          type,
          message: message.trim(),
          user_email: user?.email || null,
        });

      if (insertError) {
        // If table doesn't exist, log to console instead
        console.log('Feedback received (table not found, logging instead):', {
          user_id: user?.id,
          user_email: user?.email,
          type,
          message: message.trim(),
          created_at: new Date().toISOString(),
        });
      }
    } catch {
      // Log feedback if database operation fails
      console.log('Feedback received:', {
        user_id: user?.id,
        user_email: user?.email,
        type,
        message: message.trim(),
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback
 * Get all feedback (admin only)
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: userData } = await (supabase as any)
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!userData?.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch all feedback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: feedback, error } = await (supabase as any)
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
