import prisma from '../lib/prisma.js';

export interface PeerRecord {
  id: string;
  userId: string;
  nodeId: string;
  publicKey: string;
  ipAddress: string;
  createdAt: Date;
  revokedAt: Date | null;
}

export async function listUserPeers(userId: string): Promise<PeerRecord[]> {
  return prisma.peer.findMany({
    where: { userId, revokedAt: null },
    select: {
      id: true,
      userId: true,
      nodeId: true,
      publicKey: true,
      ipAddress: true,
      createdAt: true,
      revokedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function revokePeer(peerId: string, userId: string): Promise<PeerRecord | null> {
  const peer = await prisma.peer.findFirst({
    where: { id: peerId, userId, revokedAt: null },
  });

  if (!peer) return null;

  return prisma.peer.update({
    where: { id: peerId },
    data: { revokedAt: new Date() },
    select: {
      id: true,
      userId: true,
      nodeId: true,
      publicKey: true,
      ipAddress: true,
      createdAt: true,
      revokedAt: true,
    },
  });
}
