import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import { RegisterBody, LoginBody } from '../types/index.js';

const SALT_ROUNDS = 12;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  plan: string;
  role: 'USER' | 'ADMIN';
}

type SignFn = (payload: object, options?: object) => string;

export async function registerUser(
  body: RegisterBody,
  signToken: SignFn,
  signRefreshToken: SignFn,
): Promise<{ user: UserRecord; tokens: AuthTokens }> {
  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    const error = new Error('Email already in use') as Error & { statusCode: number };
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name: body.name, email: body.email, passwordHash },
    select: { id: true, email: true, name: true, plan: true, role: true },
  });

  await prisma.subscription.create({
    data: { userId: user.id, plan: 'free', status: 'active' },
  });

  const tokens = buildTokens(user, signToken, signRefreshToken);
  return { user, tokens };
}

export async function loginUser(
  body: LoginBody,
  signToken: SignFn,
  signRefreshToken: SignFn,
): Promise<{ user: UserRecord; tokens: AuthTokens }> {
  const user = await prisma.user.findUnique({
    where: { email: body.email },
    select: { id: true, email: true, name: true, plan: true, role: true, passwordHash: true, banned: true },
  });

  if (!user || !user.passwordHash) {
    const error = new Error('Invalid credentials') as Error & { statusCode: number };
    error.statusCode = 401;
    throw error;
  }

  if (user.banned) {
    const error = new Error('Account suspended') as Error & { statusCode: number };
    error.statusCode = 403;
    throw error;
  }

  const valid = await bcrypt.compare(body.password, user.passwordHash);
  if (!valid) {
    const error = new Error('Invalid credentials') as Error & { statusCode: number };
    error.statusCode = 401;
    throw error;
  }

  const { passwordHash: _omit, banned: _banned, ...userRecord } = user;
  const tokens = buildTokens(userRecord, signToken, signRefreshToken);
  return { user: userRecord, tokens };
}

export async function upsertGoogleUser(
  googleId: string,
  email: string,
  name: string,
  signToken: SignFn,
  signRefreshToken: SignFn,
): Promise<{ user: UserRecord; tokens: AuthTokens }> {
  // 1. Try find by googleId
  let user = await prisma.user.findUnique({
    where: { googleId },
    select: { id: true, email: true, name: true, plan: true, role: true, banned: true },
  });

  if (!user) {
    // 2. Try find by email (link accounts)
    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      user = await prisma.user.update({
        where: { id: byEmail.id },
        data: { googleId },
        select: { id: true, email: true, name: true, plan: true, role: true, banned: true },
      });
    } else {
      // 3. Create new user
      user = await prisma.user.create({
        data: { name, email, googleId },
        select: { id: true, email: true, name: true, plan: true, role: true, banned: true },
      });
      await prisma.subscription.create({
        data: { userId: user.id, plan: 'free', status: 'active' },
      });
    }
  }

  if (user.banned) {
    const error = new Error('Account suspended') as Error & { statusCode: number };
    error.statusCode = 403;
    throw error;
  }

  const { banned: _banned, ...userRecord } = user;
  const tokens = buildTokens(userRecord, signToken, signRefreshToken);
  return { user: userRecord, tokens };
}

export async function forgotPassword(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always resolve — never leak whether email exists
  if (!user || (user.googleId && !user.passwordHash)) return;

  // Delete existing unused tokens for this user
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, used: false } });

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  // Return the raw token — caller sends the email
  // (We throw a special object so the route can send the email)
  const err = new Error('__SEND_EMAIL__') as Error & { rawToken: string; email: string };
  (err as any).rawToken = rawToken;
  (err as any).email = email;
  throw err;
}

export async function resetPassword(
  rawToken: string,
  newPassword: string,
  signToken: SignFn,
  signRefreshToken: SignFn,
): Promise<{ user: UserRecord; tokens: AuthTokens }> {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.used) {
    const error = new Error('Invalid or expired reset token') as Error & { statusCode: number };
    error.statusCode = 400;
    throw error;
  }

  if (record.expiresAt < new Date()) {
    const error = new Error('Reset token has expired') as Error & { statusCode: number };
    error.statusCode = 410;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  const [user] = await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
      select: { id: true, email: true, name: true, plan: true, role: true },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
  ]);

  const tokens = buildTokens(user, signToken, signRefreshToken);
  return { user, tokens };
}

function buildTokens(user: UserRecord, signToken: SignFn, signRefreshToken: SignFn): AuthTokens {
  const accessToken = signToken(
    { sub: user.id, email: user.email, plan: user.plan, role: user.role },
    { expiresIn: '15m' },
  );
  const refreshToken = signRefreshToken(
    { sub: user.id, type: 'refresh' },
    { expiresIn: '7d' },
  );
  return { accessToken, refreshToken };
}
