import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // For Demo purposes, allow any password for a specific user
    // or just allow anyone to log in for this classy dashboard demo.
    if (email && password) {
      // Create the session
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const session = await encrypt({ email, expires });

      // Save the session in a cookie
      (await cookies()).set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      return NextResponse.json({ message: 'Logged in successfully' });
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
