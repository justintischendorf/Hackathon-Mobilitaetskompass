import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;

const CACHE_TTL = 60 * 60 * 24; // 24 hours (results are deterministic)

export async function getRedisClient(): Promise<RedisClientType | null> {
  if (client) return client;

  const url = process.env.REDIS_URL || "redis://localhost:6379";
  try {
    client = createClient({ url });
    client.on("error", (err: Error) => console.warn("Redis error:", err.message));
    await client.connect();
    console.log("✅ Redis connected at", url);
    return client;
  } catch {
    console.warn("⚠️ Redis not available — running without cache");
    client = null;
    return null;
  }
}

function buildCacheKey(body: Record<string, number | boolean>): string {
  return `mobility:${body.budget}:${body.comfort}:${body.eco}:${body.distance}:${body.availability}:${body.flexibility}:${body.fuehrerschein}`;
}

export async function getCachedResult(
  body: Record<string, number | boolean>
): Promise<{ empfehlung: string; erklaerung: string } | null> {
  const redis = await getRedisClient();
  if (!redis) return null;

  try {
    const cached = await redis.get(buildCacheKey(body));
    if (cached) {
      console.log("🎯 Cache HIT for", buildCacheKey(body));
      return JSON.parse(cached);
    }
    console.log("💨 Cache MISS for", buildCacheKey(body));
    return null;
  } catch {
    return null;
  }
}

export async function setCachedResult(
  body: Record<string, number | boolean>,
  result: { empfehlung: string; erklaerung: string }
): Promise<void> {
  const redis = await getRedisClient();
  if (!redis) return;

  try {
    await redis.set(buildCacheKey(body), JSON.stringify(result), {
      EX: CACHE_TTL,
    });
  } catch {
    // Cache write failure is non-critical
  }
}
