import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authenticate } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

export async function subscriptionsRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {
  // GET /subscriptions/me — get current user's subscription status
  fastify.get(
    '/me',
    { preHandler: authenticate },
    async (request, reply) => {
      const subscription = await prisma.subscription.findFirst({
        where: { userId: request.nexvpnUser.id },
        select: {
          id: true,
          userId: true,
          stripeSubscriptionId: true,
          status: true,
          plan: true,
          currentPeriodEnd: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!subscription) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'No subscription found for this user',
        });
      }

      return reply.send({ subscription });
    },
  );
}

export default subscriptionsRoutes;
