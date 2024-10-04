import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import ChatController from './controllers/chatController';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const chatController = new ChatController();

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinGroup', async (groupId) => {
        socket.join(groupId);
        try {
            const messages = await chatController.getGroupMessagesSocket(groupId);
            socket.emit('previousMessages', messages);
        } catch (error) {
            console.error('Error fetching group messages:', error);
            socket.emit('error', 'Error fetching group messages');
        }
    });

    socket.on('sendMessage', async (messageData) => {
        try {
            const savedMessage = await chatController.sendMessageSocket(messageData);
            io.to(messageData.groupId).emit('receiveMessage', savedMessage);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', 'Error sending message');
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});