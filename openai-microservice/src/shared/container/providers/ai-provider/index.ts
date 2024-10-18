import { container } from 'tsyringe'
import OpenAiProvider from './implementations/openai.provider'
import FakeAiProvider from './implementations/fake-ai.provider'
import { IAiProvider } from './types/iai-provider'
import { env } from '@shared/resources/env'

const implementations = {
  openAi: OpenAiProvider,
  fakeAi: FakeAiProvider,
}

container.registerSingleton<IAiProvider>(
  'AiProvider',
  implementations[env.AI_PROVIDER],
)
