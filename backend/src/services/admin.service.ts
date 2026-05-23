import prisma from '../lib/prisma.js';

export async function listUsers(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, role: true, plan: true, banned: true, createdAt: true },
    }),
    prisma.user.count(),
  ]);
  return { users, total, page, limit };
}

export async function updateUser(id: string, data: { role?: 'USER' | 'ADMIN'; banned?: boolean }) {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true, plan: true, banned: true },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}

export async function listAdminNodes() {
  return prisma.node.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createNode(data: { region: string; city: string; ip: string }) {
  return prisma.node.create({ data });
}

export async function updateNode(id: string, data: { status?: string; city?: string; region?: string }) {
  return prisma.node.update({ where: { id }, data });
}

export async function deleteNode(id: string) {
  return prisma.node.delete({ where: { id } });
}

export async function listAuditLogs(page = 1, limit = 50, userId?: string) {
  const skip = (page - 1) * limit;
  const where = userId ? { userId } : {};
  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);
  return { logs, total, page, limit };
}

export async function listSubscriptions(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [subscriptions, total] = await prisma.$transaction([
    prisma.subscription.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.subscription.count(),
  ]);
  return { subscriptions, total, page, limit };
}

export async function updateSubscription(id: string, plan: string) {
  return prisma.subscription.update({ where: { id }, data: { plan } });
}

export async function logAdminAction(userId: string, action: string, metadata?: object) {
  return prisma.auditLog.create({ data: { userId, action, metadata } });
}
