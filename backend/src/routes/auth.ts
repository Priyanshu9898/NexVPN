import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import crypto from 'crypto';
import {
  registerUser,
  loginUser,
  upsertGoogleUser,
  forgotPassword,
  resetPassword,
} from '../services/auth.service.js';
import { sendPasswordResetEmail } from '../services/email.service.js';
import { buildGoogleAuthUrl, exchangeCodeForProfile } from '../services/oauth.service.js';
import { RefreshTokenPayload } from '../types/index.js';
import prisma from '../lib/prisma.js';
import { redis } from '../lib/redis.js';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function authRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {
  const refreshSecret = process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret';
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

  const sign = (payload: object, opts?: object) =>
    fastify.jwt.sign(payload, opts as Parameters<typeof fastify.jwt.sign>[1]);

  const signRefresh = (payload: object, opts?: object) =>
    fastify.jwt.sign(payload, { ...opts as object, key: refreshSecret } as Parameters<typeof fastify.jwt.sign>[1]);

  // POST /auth/register
  fastify.post('/register', async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        statusCode: 400, error: 'Bad Request',
        message: parsed.error.issues[0]?.message ?? 'Validation error',
      });
    }
    const { user, tokens } = await registerUser(parsed.data, sign, signRefresh);
    return reply.status(201).send({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  });

  // POST /auth/login
  fastify.post('/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        statusCode: 400, error: 'Bad Request',
        message: parsed.error.issues[0]?.message ?? 'Validation error',
      });
    }
    const { user, tokens } = await loginUser(parsed.data, sign, signRefresh);
    return reply.send({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  });

  // POST /auth/refresh
  fastify.post('/refresh', async (request, reply) => {
    const parsed = refreshSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: parsed.error.issues[0]?.message });
    }

    let payload: RefreshTokenPayload;
    try {
      payload = fastify.jwt.verify<RefreshTokenPayload>(parsed.data.refreshToken, { key: refreshSecret } as Parameters<typeof fastify.jwt.verify>[1]);
    } catch {
      return reply.status(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Invalid or expired refresh token' });
    }

    if (payload.type !== 'refresh') {
      return reply.status(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Invalid token type' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, plan: true, role: true },
    });

    if (!user) {
      return reply.status(401).send({ statusCode: 401, error: 'Unauthorized', message: 'User not found' });
    }

    const newAccessToken = sign(
      { sub: user.id, email: user.email, plan: user.plan, role: user.role },
      { expiresIn: '15m' },
    );

    return reply.send({ accessToken: newAccessToken });
  });

  // GET /auth/google — initiate OAuth
  fastify.get('/google', async (_request, reply) => {
    const state = crypto.randomBytes(16).toString('hex');
    await redis.set(`oauth:state:${state}`, '1', 'EX', 120);
    const url = buildGoogleAuthUrl(state);
    return reply.redirect(url);
  });

  // GET /auth/google/callback
  fastify.get('/google/callback', async (request, reply) => {
    const { code, state, error } = request.query as Record<string, string>;

    if (error || !code || !state) {
      return reply.redirect(`${frontendUrl}/login?error=oauth_cancelled`);
    }

    const stateKey = `oauth:state:${state}`;
    const valid = await redis.get(stateKey);
    if (!valid) {
      return reply.redirect(`${frontendUrl}/login?error=oauth_invalid_state`);
    }
    await redis.del(stateKey);

    try {
      const profile = await exchangeCodeForProfile(code);
      const { user, tokens } = await upsertGoogleUser(
        profile.id, profile.email, profile.name, sign, signRefresh,
      );
      const params = new URLSearchParams({
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        role: user.role,
      });
      return reply.redirect(`${frontendUrl}/auth/callback?${params}`);
    } catch {
      return reply.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  });

  // POST /auth/forgot-password
  fastify.post('/forgot-password', async (request, reply) => {
    const parsed = forgotSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: parsed.error.issues[0]?.message });
    }

    try {
      await forgotPassword(parsed.data.email);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === '__SEND_EMAIL__') {
        const e = err as Error & { rawToken: string; email: string };
        await sendPasswordResetEmail(e.email, e.rawToken).catch(() => {
          // swallow email errors — still return 200
        });
      }
    }

    // Always return 200 — never reveal if email exists
    return reply.send({ message: 'If an account exists with that email, a reset link has been sent.' });
  });

  // POST /auth/reset-password
  fastify.post('/reset-password', async (request, reply) => {
    const parsed = resetSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: parsed.error.issues[0]?.message });
    }

    const { user, tokens } = await resetPassword(parsed.data.token, parsed.data.newPassword, sign, signRefresh);

    return reply.send({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  });
}

export default authRoutes;
