import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { z } from 'zod';
import { RateLimiter } from '@/lib/rate-limiter';
import { ALLOWED_EMAILS } from '@/lib/whitelist';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

// Rate limiter: 5 attempts per 15 minutes per email
const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000);

// Zod schema for request validation
const loginRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * POST /api/auth/login
 * Server-side login with rate limiting and whitelist validation
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Input validation
    const body = (await request.json()) as unknown;
    const validation = loginRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 400 }
      );
    }
    const { email, password } = validation.data;

    // Rate limiting (per email)
    const normalizedEmail = email.toLowerCase();
    const rateLimitCheck = loginRateLimiter.check(normalizedEmail);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': Math.ceil(rateLimitCheck.retryAfter / 1000).toString() },
        }
      );
    }

    // Whitelist validation (server-side authoritative)
    if (!ALLOWED_EMAILS.includes(normalizedEmail)) {
      loginRateLimiter.record(normalizedEmail);
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Create Supabase server client with cookie capture pattern
    let cookiesToSet: CookieToSet[] = [];
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(c: CookieToSet[]) {
            // Capture cookies instead of writing to cookieStore
            // We'll apply them to the response manually
            cookiesToSet = c;
          },
        },
      }
    );

    // Attempt login
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      // Record failed attempt for rate limiting
      loginRateLimiter.record(normalizedEmail);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Success - build response and apply captured cookies
    const response = NextResponse.json({ success: true });

    // Apply all captured session cookies to the response
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
