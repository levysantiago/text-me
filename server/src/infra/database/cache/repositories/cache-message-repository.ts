import { IUpdateMessageDTO } from 'src/app/dtos/iupdate-message-dto';
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
        reject('Message not found');
      }

      resolve(message[0]);
    });
  }

  findAllOfUser(userReceiverId: string): Promise<Message[]> {
    return new Promise((resolve) => {
      const message = this.cache.filter((_message) => {
        return _message.toUserId === userReceiverId;
      });

      resolve(message);
    });
  }

  findByConversation(conversation: string): Promise<Message[]> {
    return new Promise((resolve) => {
      const messages = this.cache.filter((_message) => {
        return _message.conversation === conversation;
      });

      resolve(messages);
    });
  }

  visualizeMessages(fromUserId: string, toUserId: string): Promise<void> {
    return new Promise(() => {
      this.cache.map((_message) => {
        if (
          _message.fromUserId === fromUserId &&
          _message.toUserId === toUserId
        ) {
          _message.visualized = true;
        }
      });
    });
  }

  save(message: Message): Promise<void> {
    return new Promise((resolve, reject) => {
      let messageToUpdate = this.cache.filter((m) => {
        return m.id === message.id;
      })[0];
      if (!messageToUpdate) reject(null);
      messageToUpdate = message;

      resolve();
    });
  }
}
