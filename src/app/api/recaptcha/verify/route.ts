import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) {
      return NextResponse.json({ success: true });
    }

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      { method: 'POST' },
    );

    const data = await response.json();
    return NextResponse.json({ success: data.success === true });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
