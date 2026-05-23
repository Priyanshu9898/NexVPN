import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  const statusCode = error.statusCode ?? 500;

  request.log.error(
    { err: error, url: request.url, method: request.method },
    'Request error',
  );

  if (statusCode >= 500) {
    reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
    return;
  }

  reply.status(statusCode).send({
    statusCode,
    error: error.name ?? 'Error',
    message: error.message,
  });
}

export default errorHandler;
