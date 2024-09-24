import { ICacheProvider } from '../types/icache-provider'

class LocalCacheProvider implements ICacheProvider {
  private cache: any = {}

  async save(key: string, value: string, ttl?: number): Promise<void> {
    return new Promise((resolve) => {
      this.cache[key] = value
      resolve()
    })
  }

  async retrieve(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      resolve(this.cache[key])
    })
  }

  async delete(key: string): Promise<void> {
    return new Promise((resolve) => {
      delete this.cache[key]
      resolve()
    })
  }

  async disconnect(): Promise<void> {}
}

export default LocalCacheProvider
