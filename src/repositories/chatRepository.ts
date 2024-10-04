// repositories/ChatRepository.ts
import ChatModel from '../models/chat'; // Mongoose model

export default class ChatRepository {
  public async createMessage(messageData: { message: string; sender: string; group: string }) {

    const message = new ChatModel(messageData);
    return await message.save();
  }

  public async findMessagesByGroup(groupId: string) {
    return await ChatModel.find({ group: groupId }).sort({ createdAt: 1 }); // Sort by creation time
  }
}
