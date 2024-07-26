import chatService from "../services/chatService.js";

const getChatConAmigo  = async (req, res) => {
    try {
        const { friendId } = req.params;
        const userId = req.user._id.toString();
        const chat = await chatService.getAllChats({ participants: [userId, friendId] });
        if (chat.length === 0) {
            const newChat = await chatService.getAllChats({ participants: [friendId, userId] });
            return res.json(newChat);
        }
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getChatConEquipo = async (req, res) => {
    try {
        const { teamId } = req.params;
        const chat = await chatService.getAllChats({ team: teamId });
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getChatConEvento = async (req, res) => {
    try {
        const { eventId } = req.params;
        const chat = await chatService.getAllChats({ event: eventId });
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const createChat = async (req, res) => {
    try {
        const participants = req.body.participants;
        const chat = await chatService.createChat(participants);
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { content } = req.body;
        const senderId = req.user._id;
        await chatService.sendMessage(chatId, senderId, content);
        res.status(200).json({ message: 'Message sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await chatService.getChat(chatId);
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default { createChat, sendMessage, getChat, getChatConAmigo, getChatConEquipo, getChatConEvento };