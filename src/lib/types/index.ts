export interface RateLimiter {
  /**
   * checks if a request is allowed for a given identifier (user ID or IP address).
   * @param id the unique identifier for the user or client.
   * @returns true if the request is allowed, false if rate limited.
   */
  isAllowed(id: string): boolean;
}
