import Redis from "ioredis";
const globalForClients = global as unknown as {
  redis?: Redis;
};
export const redis =
  globalForClients.redis || new Redis(process.env.REDIS_URL!);

if (process.env.NODE_ENV !== "production") globalForClients.redis = redis;
