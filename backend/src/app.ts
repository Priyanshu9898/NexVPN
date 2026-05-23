import Fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/auth.js';
import { peersRoutes } from './routes/peers.js';
import { nodesRoutes } from './routes/nodes.js';
import { usersRoutes } from './routes/users.js';
import { subscriptionsRoutes } from './routes/subscriptions.js';
import { adminRoutes } from './routes/admin.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
      ...(process.env.NODE_ENV === 'development' && {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      }),
    },
  });

  // Rate limiting — applied to auth routes
  await app.register(rateLimit, {
    global: false, // apply per-route only
    max: 10,
    timeWindow: '1 minute',
  });

  // Register JWT plugin
  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? 'fallback-secret-change-in-production',
    sign: {
      expiresIn: '15m',
    },
  });

  // Register CORS
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map(o => o.trim());

  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Health check (no auth required)
  app.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Register route plugins under /api/v1 prefix
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(peersRoutes, { prefix: '/api/v1/peers' });
  await app.register(nodesRoutes, { prefix: '/api/v1/nodes' });
  await app.register(usersRoutes, { prefix: '/api/v1/users' });
  await app.register(subscriptionsRoutes, { prefix: '/api/v1/subscriptions' });
  await app.register(adminRoutes, { prefix: '/api/v1/admin' });

  // Register global error handler
  app.setErrorHandler(errorHandler);

  return app;
}

export default buildApp;
