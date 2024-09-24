import { IEmitEventName } from './iemit-event-name'
import { IHandlerCallback } from './ihandler-callback'
import { ISubscribeEventName } from './isubscribe-event-names'

export interface ISocketProvider {
  init(): Promise<void>
  subscribe(event: ISubscribeEventName, callback: IHandlerCallback): void
  emit(eventName: IEmitEventName, data: any): void
}
