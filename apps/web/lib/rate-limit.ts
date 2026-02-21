const buckets = new Map<string, { count: number; resetAt: number }>();

type LimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
};

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): LimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      retryAfterSec: Math.ceil(windowMs / 1000)
    };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - existing.count),
    retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
  };
}
