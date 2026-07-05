/**
 * Lightweight in-memory IP rate limiter for serverless (free tier).
 * 5 requests per minute per IP. Resets automatically after the window.
 */

const MAX_REQUESTS = 5;
const WINDOW_MS = 60_000;

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

/** Prune expired entries periodically to limit memory growth. */
function pruneExpired(now: number) {
  if (store.size < 500) return;
  store.forEach((bucket, ip) => {
    if (now > bucket.resetAt) store.delete(ip);
  });
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  pruneExpired(now);

  const bucket = store.get(ip);

  if (!bucket || now > bucket.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export const RATE_LIMIT_ERROR =
  "Quá nhiều yêu cầu. Vui lòng đợi 30 giây trước khi tải lại.";
