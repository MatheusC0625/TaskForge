import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

function createLimiter(requests: number, window: Parameters<typeof Ratelimit.slidingWindow>[1]) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: "taskforge",
  });
}

// Sem UPSTASH_REDIS_REST_URL/TOKEN configuradas, os limiters ficam null e
// checkRateLimit() sempre libera — o app funciona normalmente sem Upstash.
const registerLimiter = createLimiter(5, "10 m");
const loginLimiter = createLimiter(10, "1 m");
const passwordResetLimiter = createLimiter(3, "10 m");

export type RateLimitKind = "register" | "login" | "password-reset";

const limiters: Record<RateLimitKind, Ratelimit | null> = {
  register: registerLimiter,
  login: loginLimiter,
  "password-reset": passwordResetLimiter,
};

export async function checkRateLimit(kind: RateLimitKind, identifier: string) {
  const limiter = limiters[kind];
  if (!limiter) return { success: true };

  const result = await limiter.limit(`${kind}:${identifier}`);
  return { success: result.success };
}

/** Extrai o IP do cliente a partir dos headers (funciona atrás do proxy da Vercel). */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
