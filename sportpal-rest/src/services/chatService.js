import Chat from '../models/chats.js';

const getAllChats = async (filters) => {
    return await Chat.find(filters);
};

const createChat = async (participants) => {
    const chat = new Chat({ participants, messages: [] });
    return await chat.save();
};

const addParticipants = async (teamId, eventId, participants) => {
    if (eventId) {
        const chat = await Chat.findOne({ event: eventId });
        chat.participants.push(...participants);
        await chat.save();
    }
    else if (teamId) {
        const chat = await Chat.findOne({ team: teamId });
        chat.participants.push(...participants);
        await chat.save();
    }
};

const createTeamChat = async (teamId, participants) => {
    const chat = new Chat({ team: teamId, messages: [], participants: participants });
    return await chat.save();
};

const createEventChat = async (eventId, participants) => {
    const chat = new Chat({ event: eventId, messages: [], participants: participants });
    return await chat.save();
};

const sendMessage = async (chatId, senderId, content) => {
    const chat = await Chat.findById(chatId);
    chat.messages.push({ sender: senderId, content });
    await chat.save();
};

const getChat = async (chatId) => {
    return await Chat.findById(chatId);
};

export default { createChat, sendMessage, getChat, getAllChats, createTeamChat, addParticipants, createEventChat };

