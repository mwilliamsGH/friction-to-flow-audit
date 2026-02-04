import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { z } from 'zod';
import { RateLimiter } from '@/lib/rate-limiter';
import { ALLOWED_EMAILS } from '@/lib/whitelist';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

// Rate limiter: 5 attempts per 15 minutes per email
const signupRateLimiter = new RateLimiter(5, 15 * 60 * 1000);

// Zod schema for request validation
const signupRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  fullName: z.string().min(1, 'Full name is required'),
});

/**
 * Validate password strength requirements
 */
function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one digit' };
  }
  return { valid: true };
}

/**
 * POST /api/auth/signup
 * Server-side signup with rate limiting and whitelist validation
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Input validation
    const body = (await request.json()) as unknown;
    const validation = signupRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }
    const { email, password, fullName } = validation.data;

    // Rate limiting (per email)
    const normalizedEmail = email.toLowerCase();
    const rateLimitCheck = signupRateLimiter.check(normalizedEmail);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many signup attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': Math.ceil(rateLimitCheck.retryAfter / 1000).toString() },
        }
      );
    }

    // Whitelist validation (server-side authoritative)
    if (!ALLOWED_EMAILS.includes(normalizedEmail)) {
      signupRateLimiter.record(normalizedEmail);
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Password strength validation (server-side authoritative)
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      signupRateLimiter.record(normalizedEmail);
      return NextResponse.json(
        { success: false, error: passwordValidation.error },
        { status: 400 }
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
            cookiesToSet = c;
          },
        },
      }
    );

    // Construct emailRedirectTo for email confirmation
    const origin = request.headers.get('origin') ?? `https://${request.headers.get('host')}`;
    const emailRedirectTo = `${origin}/api/auth/callback`;

    // Attempt signup
    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo,
      },
    });

    if (error) {
      // Record attempt for rate limiting
      signupRateLimiter.record(normalizedEmail);
      return NextResponse.json(
        { success: false, error: error.message || 'Signup failed' },
        { status: 400 }
      );
    }

    // Success - Supabase sent confirmation email
    const response = NextResponse.json({ success: true });

    // Apply any captured session cookies to the response (usually none for signup)
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
