import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Connect to database
    await dbConnect();
    
    // Find user and explicitly select password field (which has select: false in schema)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Handle legacy users who were created in the demo flow and don't have a password
    if (!user.password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      await user.save();
    } else {
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
      }
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ 
      email: user.email, 
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
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      message: 'Internal Server Error',
      error: error.message || 'Database connection error'
    }, { status: 500 });
  }
}

