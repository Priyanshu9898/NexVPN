import { Worker, Job } from 'bullmq';
import { redis } from '../lib/redis.js';

export interface MetricsJobData {
  nodeId: string;
  timestamp: number;
}

// Placeholder worker for node metrics collection
// TODO: Implement actual metrics collection from VPN nodes
export function startMetricsWorker(): Worker<MetricsJobData> {
  const worker = new Worker<MetricsJobData>(
    'metrics',
    async (job: Job<MetricsJobData>) => {
      console.log(`[MetricsJob] Processing job ${job.id} for node ${job.data.nodeId}`);
      // TODO: Collect metrics from VPN node via AI engine or direct API
      // TODO: Update node.loadPercent and node.lastHeartbeat in DB
    },
    { connection: redis },
  );

  worker.on('completed', (job) => {
    console.log(`[MetricsJob] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[MetricsJob] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
