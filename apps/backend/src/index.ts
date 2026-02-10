import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

const server = Fastify({
  logger: true,
});

server.register(cors, { origin: process.env.FRONTEND_URL || '*' });
server.register(rateLimit, { max: 100, timeWindow: '1 minute' });

server.get('/health', async () => {
  return { status: 'ok', service: 'modeltrace-api', timestamp: new Date().toISOString() };
});

server.get('/api/v1/stats', async () => {
  return {
    protocol: 'modeltrace',
    network: 'stellar-testnet',
    contracts: 3,
    contributors: 17,
    issues_open: 30,
  };
});

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT) || 4000, host: '0.0.0.0' });
    console.log(`Modeltrace API running on port 4000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
