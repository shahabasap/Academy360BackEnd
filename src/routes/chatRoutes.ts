// routes/chatRoutes.ts
import { Router } from 'express';
import ChatController from '../controllers/chatController';

const router = Router();
const chatController = new ChatController();

router.post('/send-message', chatController.sendMessage);
router.get('/group-messages/:groupId', chatController.getGroupMessages);

export default router;
