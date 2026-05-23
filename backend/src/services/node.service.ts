import prisma from '../lib/prisma.js';

export interface NodeRecord {
  id: string;
  region: string;
  city: string;
  ip: string;
  status: string;
  loadPercent: number;
  lastHeartbeat: Date;
  createdAt: Date;
}

export async function listNodes(): Promise<NodeRecord[]> {
  return prisma.node.findMany({
    select: {
      id: true,
      region: true,
      city: true,
      ip: true,
      status: true,
      loadPercent: true,
      lastHeartbeat: true,
      createdAt: true,
    },
    orderBy: [{ region: 'asc' }, { city: 'asc' }],
  });
}

export async function getNodeHealth(nodeId: string): Promise<NodeRecord | null> {
  return prisma.node.findUnique({
    where: { id: nodeId },
    select: {
      id: true,
      region: true,
      city: true,
      ip: true,
      status: true,
      loadPercent: true,
      lastHeartbeat: true,
      createdAt: true,
    },
  });
}
