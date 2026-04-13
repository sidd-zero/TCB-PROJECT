import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email && password) {
      await dbConnect();
      
      // Find user and check onboarding status
      let user = await User.findOne({ email });
      
      // If user doesn't exist, create a new one (for this demo/demo flows)
      if (!user) {
        user = await User.create({
          email,
          name: email.split('@')[0], // Default name
          isOnboarded: false
        });
      }

      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const session = await encrypt({ 
        email, 
        userId: user._id.toString(),
        isOnboarded: user.isOnboarded,
        expires 
      });

      (await cookies()).set('session', session, { 
        expires, 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      return NextResponse.json({ 
        message: 'Logged in successfully',
        isOnboarded: user.isOnboarded 
      });
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
