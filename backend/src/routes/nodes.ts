import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authenticate } from '../middleware/auth.js';
import { listNodes, getNodeHealth } from '../services/node.service.js';

export async function nodesRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {
  // GET /nodes — list all available nodes
  fastify.get(
    '/',
    { preHandler: authenticate },
    async (_request, reply) => {
      const nodes = await listNodes();
      return reply.send({ nodes });
    },
  );

  // GET /nodes/:id/health — get health info for a specific node
  fastify.get<{ Params: { id: string } }>(
    '/:id/health',
    { preHandler: authenticate },
    async (request, reply) => {
      const node = await getNodeHealth(request.params.id);
      if (!node) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Node not found',
        });
      }
      return reply.send({ node });
    },
  );
}

export default nodesRoutes;
