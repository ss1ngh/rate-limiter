import { RateLimiter } from "../types";

export class SlidingWindowLog implements RateLimiter {
  private windowSizeMs: number;
  private maxRequests: number;
  private store: Map<string, number[]>;

  constructor(windowSizeMs: number, maxRequests: number) {
    this.windowSizeMs = windowSizeMs;
    this.maxRequests = maxRequests;
    this.store = new Map();
  }

  isAllowed(id: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowSizeMs;

    //get the current log of timestamps for this user
    const userLog = this.store.get(id) || [];

    //only keep timestamps that are within the current window
    const validLog = userLog.filter((timestamp) => timestamp > windowStart);

    //check if the log size is within limits
    if (validLog.length < this.maxRequests) {
      validLog.push(now);
      this.store.set(id, validLog);
      return true;
    }

    //update the store with the cleaned log
    this.store.set(id, validLog);
    return false;
  }
}
