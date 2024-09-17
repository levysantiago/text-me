import { ICacheProvider } from '../types/icache-provider'

class LocalCacheProvider implements ICacheProvider {
  private cache: any = {}

  async save(key: string, value: string): Promise<void> {
    return new Promise((resolve) => {
      this.cache[key] = value
      resolve()
    })
  }

  async retrieve(key: string): Promise<string> {
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
}

export default LocalCacheProvider
