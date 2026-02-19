import { createClient } from "redis";

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis connected successfully"));

// Connect and handle errors
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connection initiated");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
};

connectRedis();

export default redisClient;
