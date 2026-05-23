import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email('Invalid email address').optional(),
});

export async function usersRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {
  // GET /users/me — get current user profile
  fastify.get(
    '/me',
    { preHandler: authenticate },
    async (request, reply) => {
      const user = await prisma.user.findUnique({
        where: { id: request.nexvpnUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          stripeCustomerId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'User not found',
        });
      }

      return reply.send({ user });
    },
  );

  // PATCH /users/me — update current user profile
  fastify.patch(
    '/me',
    { preHandler: authenticate },
    async (request, reply) => {
      const parseResult = updateProfileSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: parseResult.error.issues[0]?.message ?? 'Validation error',
          details: parseResult.error.issues,
        });
      }

      const data = parseResult.data;

      // Check email uniqueness if updating email
      if (data.email) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing && existing.id !== request.nexvpnUser.id) {
          return reply.status(409).send({
            statusCode: 409,
            error: 'Conflict',
            message: 'Email already in use',
          });
        }
      }

      const updated = await prisma.user.update({
        where: { id: request.nexvpnUser.id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          updatedAt: true,
        },
      });

      return reply.send({ user: updated });
    },
  );
}

export default usersRoutes;
