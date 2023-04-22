import { Message } from 'src/app/entities/message';
import { MessageRepository } from 'src/app/repositories/message-repository';

export class CacheMessageRepository implements MessageRepository {
  private cache: Message[] = [];

  create(message: Message): Promise<void> {
    return new Promise((resolve) => {
      this.cache.push(message);
      resolve();
    });
  }

  findBy(id: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      const message = this.cache.filter((_message) => {
        return _message.id === id;
      });

      if (!message.length) {
        // throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        reject();
      }

      resolve(message[0]);
    });
  }

  findByUsers(fromUserId: string, toUserId: string): Promise<Message[]> {
    return new Promise((resolve, reject) => {
      const messages = this.cache.filter((_message) => {
        return (
          _message.fromUserId === fromUserId && _message.toUserId === toUserId
        );
      });

      if (!messages.length) {
        reject(null);
      }

      resolve(messages);
    });
  }
}
