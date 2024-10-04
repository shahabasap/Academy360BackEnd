// controllers/ChatController.ts
import ChatService from '../services/chatServices';
import { Request, Response, NextFunction } from 'express'; // Import necessary types

class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  // HTTP method for sending messages (uses req, res)
  public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { message, sender, group } = req.body;
    try {
      const chat = await this.chatService.sendMessage(message, sender, group);
      return res.status(200).json(chat);
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  };

  // HTTP method for fetching group messages (uses req, res)
  public getGroupMessages = async (req: Request, res: Response, next: NextFunction) => {
    const { groupId } = req.params;
    try {
      const messages = await this.chatService.getGroupMessages(groupId);
      return res.status(200).json(messages);
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  };

  // --- SOCKET-SPECIFIC METHODS ---

  // Socket.io version for sending messages (no req, res)
  public sendMessageSocket = async (messageData: any) => {
    const { message, sender, groupId } = messageData;
    try {
      const chat = await this.chatService.sendMessage(message, sender, groupId);
      return chat; // Directly return the saved message
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; // Throw the error to be handled elsewhere
    }
  };

  // Socket.io version for fetching group messages (no req, res)
  public getGroupMessagesSocket = async (groupId: string) => {
    try {
      const messages = await this.chatService.getGroupMessages(groupId);
      return messages; // Directly return the group messages
    } catch (error) {
      console.error('Error fetching group messages:', error);
      throw error; // Throw the error to be handled elsewhere
    }
  }
}

export default ChatController;
