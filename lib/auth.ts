import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'your-fallback-secret-key-change-this';
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return {
    ...payload,
    isOnboarded: !!payload.isOnboarded
  };
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (err) {
    return null;
  }
}

export async function updateSession(newPayload: any) {
  const session = (await cookies()).get('session')?.value;
  if (!session) return;
  
  const payload = await decrypt(session);
  const updatedPayload = { ...payload, ...newPayload };
  
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const newSession = await encrypt(updatedPayload);
  
  (await cookies()).set('session', newSession, { 
    expires, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/' 
  });
}
