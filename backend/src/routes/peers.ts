import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authenticate } from '../middleware/auth.js';

export async function peersRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {
  // GET /peers — list user's active peers
  fastify.get(
    '/',
    { preHandler: authenticate },
    async (_request, reply) => {
      return reply.status(501).send({
        statusCode: 501,
        error: 'Not Implemented',
        message: 'Peer listing is not yet implemented',
      });
    },
  );

  // POST /peers — provision a new peer
  fastify.post(
    '/',
    { preHandler: authenticate },
    async (_request, reply) => {
      return reply.status(501).send({
        statusCode: 501,
        error: 'Not Implemented',
        message: 'Peer provisioning is not yet implemented',
      });
    },
  );

  // DELETE /peers/:id — revoke a peer
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    { preHandler: authenticate },
    async (_request, reply) => {
      return reply.status(501).send({
        statusCode: 501,
        error: 'Not Implemented',
        message: 'Peer revocation is not yet implemented',
      });
    },
  );
}

export default peersRoutes;
