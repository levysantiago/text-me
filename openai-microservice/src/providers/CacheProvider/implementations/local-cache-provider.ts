import { ICacheProvider } from '../types/icache-provider'

class LocalCacheProvider implements ICacheProvider {
  private cache: any = {}

  async save(key: string, value: string): Promise<void> {
    return new Promise(() => {
      this.cache[key] = value
    })
  }

  async retrieve(key: string): Promise<string> {
    return new Promise(() => {
      return this.cache[key]
    })
  }

  async delete(key: string): Promise<void> {
    return new Promise(() => {
      delete this.cache[key]
    })
  }
}

export default LocalCacheProvider
