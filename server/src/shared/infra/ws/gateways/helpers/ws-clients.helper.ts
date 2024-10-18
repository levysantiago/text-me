import { ILocale } from '@shared/resources/types/ilocale';

interface IClientData {
  clientId: string;
  userId: string;
  token: string;
  locale: ILocale;
  interval: NodeJS.Timer;
  lastTypingTime: Date | undefined;
}

interface IClientDict {
  [x: string]: IClientData;
}

interface ISaveDTO {
  clientId: string;
  userId: string;
  token: string;
  locale?: ILocale;
}

interface IUpdateDTO {
  interval?: NodeJS.Timer | null;
  lastTypingTime?: Date | null;
}

export class WsClientsHelper {
  private static clients: IClientDict = {};

  public static save({ clientId, userId, token, locale }: ISaveDTO): void {
    this.clients[clientId] = {
      clientId,
      userId,
      token,
      locale: locale || 'en',
      interval: null,
      lastTypingTime: null,
    };
  }

  public static findByClientId(clientId: string): IClientData | undefined {
    return this.clients[clientId];
  }

  public static findByUserId(userId: string): IClientData | undefined {
    const clientData = Object.values(this.clients).find(
      (data) => data.userId === userId,
    );
    return clientData;
  }

  public static update(clientId: string, data: IUpdateDTO): void {
    const clientData = this.findByClientId(clientId);

    data.interval !== undefined
      ? (clientData.interval = data.interval)
      : undefined;

    data.lastTypingTime !== undefined
      ? (clientData.lastTypingTime = data.lastTypingTime)
      : undefined;
  }

  public static delete(clientId: string): void {
    if (this.clients[clientId]) {
      delete this.clients[clientId];
    }
  }
}
