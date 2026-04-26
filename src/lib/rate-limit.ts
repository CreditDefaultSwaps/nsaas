// Simple in-memory rate limiter for login attempts
// In production, use Redis or similar

interface RateLimitEntry {
  attempts: number;
  resetTime: number;
  blocked: boolean;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number; blocked?: boolean } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up expired entries
  if (entry && now > entry.resetTime + BLOCK_DURATION_MS) {
    rateLimitStore.delete(identifier);
    return { allowed: true, remaining: MAX_ATTEMPTS, resetTime: now + WINDOW_MS };
  }

  // Check if blocked
  if (entry?.blocked) {
    const blockExpires = entry.resetTime + BLOCK_DURATION_MS;
    if (now < blockExpires) {
      return { 
        allowed: false, 
        remaining: 0, 
        resetTime: blockExpires,
        blocked: true 
      };
    }
    // Block expired, reset
    rateLimitStore.delete(identifier);
    return { allowed: true, remaining: MAX_ATTEMPTS, resetTime: now + WINDOW_MS };
  }

  // Check window
  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitStore.set(identifier, {
      attempts: 1,
      resetTime: now + WINDOW_MS,
      blocked: false,
    });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetTime: now + WINDOW_MS };
  }

  // Within window
  if (entry.attempts >= MAX_ATTEMPTS) {
    // Block the user
    entry.blocked = true;
    entry.resetTime = now; // Reset to track block duration
    rateLimitStore.set(identifier, entry);
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: now + BLOCK_DURATION_MS,
      blocked: true 
    };
  }

  entry.attempts++;
  rateLimitStore.set(identifier, entry);
  return { 
    allowed: true, 
    remaining: MAX_ATTEMPTS - entry.attempts, 
    resetTime: entry.resetTime 
  };
}

export function getRateLimitStatus(identifier: string): { blocked: boolean; resetTime: number; attempts: number } {
  const entry = rateLimitStore.get(identifier);
  if (!entry) return { blocked: false, resetTime: Date.now() + WINDOW_MS, attempts: 0 };
  
  return {
    blocked: entry.blocked,
    resetTime: entry.resetTime,
    attempts: entry.attempts,
  };
}
