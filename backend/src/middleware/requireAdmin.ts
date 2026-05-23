import { FastifyRequest, FastifyReply } from 'fastify';

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  if (request.nexvpnUser.role !== 'ADMIN') {
    return reply.status(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Admin access required',
    });
  }
}

export default requireAdmin;
