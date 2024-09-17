export interface ICacheProvider {
  save(key: string, value: string): Promise<void>
  retrieve(key: string): Promise<string>
  delete(key: string): Promise<void>
}
