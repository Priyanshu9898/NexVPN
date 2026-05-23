import { Queue } from 'bullmq';
import { redis } from './redis.js';

const connection = redis;

export const provisioningQueue = new Queue('provisioning', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

export const metricsQueue = new Queue('metrics', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 5000,
    },
    removeOnComplete: 50,
    removeOnFail: 200,
  },
});

export const queues = {
  provisioning: provisioningQueue,
  metrics: metricsQueue,
};

export default queues;
