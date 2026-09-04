/**
 * Base API Client abstraction.
 * Emulates asynchronous network boundary with latency simulation and error handling.
 */
export async function mockNetworkDelay(ms: number = 80): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
