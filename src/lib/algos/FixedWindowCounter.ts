import { RateLimiter } from "../types";

export class FixedWindowCounter implements RateLimiter {
  private windowSizeMs: number;
  private maxRequests: number;
  private store: Map<string, { count: number; windowStart: number }>;

  constructor(windowSizeMs: number, maxRequests: number) {
    this.windowSizeMs = windowSizeMs;
    this.maxRequests = maxRequests;
    this.store = new Map();
  }

  isAllowed(id: string): boolean {
    const now = Date.now();
    const currentWindowStart = Math.floor(now / this.windowSizeMs) * this.windowSizeMs; //round down time

    const userData = this.store.get(id);

    if (!userData || userData.windowStart !== currentWindowStart) {
      this.store.set(id, { count: 1, windowStart: currentWindowStart });
      return true;
    }

    if (userData.count < this.maxRequests) {
      userData.count++;
      return true;
    }

    return false;
  }
}
