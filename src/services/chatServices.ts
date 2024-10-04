// services/ChatService.ts
import ChatRepository from '../repositories/chatRepository';

export default class ChatService {
  private chatRepository: ChatRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
  }

  public async sendMessage(message: string, sender: string, group: string) {
    // Use ChatRepository to save the message to the database
    return await this.chatRepository.createMessage({ message, sender, group });
  }

  public async getGroupMessages(groupId: string) {

    // Use ChatRepository to fetch all messages of a group
    return await this.chatRepository.findMessagesByGroup(groupId);
  }
}
