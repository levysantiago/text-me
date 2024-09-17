import { container } from 'tsyringe'
import OpenAiProvider from './implementations/openai.provider'
import FakeAiProvider from './implementations/fake-ai.provider'
import { IAiProvider } from './types/iai-provider'

const implementations = {
  openAi: OpenAiProvider,
  fakeAi: FakeAiProvider,
}

container.registerSingleton<IAiProvider>('AiProvider', implementations.fakeAi)
