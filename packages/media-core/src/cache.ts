export class MemoryCache<T> {
  private cache = new Map<string, T>();

  get<U = T>(key: string): U | undefined {
    return this.cache.get(key) as unknown as U | undefined;
  }

  set(key: string, value: T): void {
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
