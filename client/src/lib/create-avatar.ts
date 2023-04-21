import { micah } from '@dicebear/collection'
import { createAvatar as _createAvatar } from '@dicebear/core'

export function createAvatar(seed: string): string {
  const avatar = _createAvatar(micah, {
    seed,
    backgroundType: ['solid'],
    backgroundColor: ['D5BAFE'],
  })
  return avatar.toDataUriSync()
}
