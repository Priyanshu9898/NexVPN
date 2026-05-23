import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtPayload } from '../types/index.js';
import prisma from '../lib/prisma.js';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const payload = await request.jwtVerify<JwtPayload>();

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, plan: true, role: true, banned: true },
    });

    if (!user) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'User not found',
      });
    }

    if (user.banned) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Account suspended',
      });
    }

    request.nexvpnUser = {
      id: user.id,
      email: user.email,
      plan: user.plan,
      role: user.role,
    };
  } catch {
    reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
}

export default authenticate;
