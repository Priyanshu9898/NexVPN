import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import {
  listUsers, updateUser, deleteUser,
  listAdminNodes, createNode, updateNode, deleteNode,
  listAuditLogs, listSubscriptions, updateSubscription,
  logAdminAction,
} from '../services/admin.service.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preHandler: any = [authenticate, requireAdmin];

const updateUserSchema = z.object({
  role: z.enum(['USER', 'ADMIN']).optional(),
  banned: z.boolean().optional(),
});

const createNodeSchema = z.object({
  region: z.string().min(1),
  city: z.string().min(1),
  ip: z.string().min(1),
});

const updateNodeSchema = z.object({
  status: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
});

const updateSubSchema = z.object({
  plan: z.string().min(1),
});

export async function adminRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {

  // ── Users ──────────────────────────────────────────────────────────────────

  fastify.get('/users', { preHandler }, async (request, reply) => {
    const { page = '1', limit = '20' } = request.query as Record<string, string>;
    const result = await listUsers(parseInt(page), parseInt(limit));
    return reply.send(result);
  });

  fastify.patch<{ Params: { id: string } }>('/users/:id', { preHandler }, async (request, reply) => {
    const parsed = updateUserSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: parsed.error.issues[0]?.message });
    }
    const user = await updateUser(request.params.id, parsed.data);
    await logAdminAction(request.nexvpnUser.id, `admin:user:update:${request.params.id}`, parsed.data);
    return reply.send({ user });
  });

  fastify.delete<{ Params: { id: string } }>('/users/:id', { preHandler }, async (request, reply) => {
    await deleteUser(request.params.id);
    await logAdminAction(request.nexvpnUser.id, `admin:user:delete:${request.params.id}`);
    return reply.status(204).send();
  });

  // ── Nodes ──────────────────────────────────────────────────────────────────

  fastify.get('/nodes', { preHandler }, async (_request, reply) => {
    const nodes = await listAdminNodes();
    return reply.send({ nodes });
  });

  fastify.post('/nodes', { preHandler }, async (request, reply) => {
    const parsed = createNodeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: parsed.error.issues[0]?.message });
    }
    const node = await createNode(parsed.data);
    await logAdminAction(request.nexvpnUser.id, 'admin:node:create', parsed.data);
    return reply.status(201).send({ node });
  });

  fastify.patch<{ Params: { id: string } }>('/nodes/:id', { preHandler }, async (request, reply) => {
    const parsed = updateNodeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: parsed.error.issues[0]?.message });
    }
    const node = await updateNode(request.params.id, parsed.data);
    await logAdminAction(request.nexvpnUser.id, `admin:node:update:${request.params.id}`, parsed.data);
    return reply.send({ node });
  });

  fastify.delete<{ Params: { id: string } }>('/nodes/:id', { preHandler }, async (request, reply) => {
    await deleteNode(request.params.id);
    await logAdminAction(request.nexvpnUser.id, `admin:node:delete:${request.params.id}`);
    return reply.status(204).send();
  });

  // ── Audit Logs ─────────────────────────────────────────────────────────────

  fastify.get('/audit-logs', { preHandler }, async (request, reply) => {
    const { page = '1', limit = '50', userId } = request.query as Record<string, string>;
    const result = await listAuditLogs(parseInt(page), parseInt(limit), userId);
    return reply.send(result);
  });

  // ── Subscriptions ──────────────────────────────────────────────────────────

  fastify.get('/subscriptions', { preHandler }, async (request, reply) => {
    const { page = '1', limit = '20' } = request.query as Record<string, string>;
    const result = await listSubscriptions(parseInt(page), parseInt(limit));
    return reply.send(result);
  });

  fastify.patch<{ Params: { id: string } }>('/subscriptions/:id', { preHandler }, async (request, reply) => {
    const parsed = updateSubSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: parsed.error.issues[0]?.message });
    }
    const subscription = await updateSubscription(request.params.id, parsed.data.plan);
    await logAdminAction(request.nexvpnUser.id, `admin:subscription:update:${request.params.id}`, parsed.data);
    return reply.send({ subscription });
  });
}

export default adminRoutes;
