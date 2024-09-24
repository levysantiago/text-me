export interface ICacheProvider {
  save(key: string, value: string, ttl?: number): Promise<void>
  retrieve(key: string): Promise<string | null>
  delete(key: string): Promise<void>
  disconnect(): Promise<void>
}
