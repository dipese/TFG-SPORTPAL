import { get } from 'mongoose';
import User from '../models/user.js';
import chatService from './chatService.js';

const getAllUsers = async (filters) => {
    return await User.find(filters);
}

const getUserById = async (userId) => {
    return await User.findById(userId);
}

const updateUser = async (userId, updateData) => {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return updatedUser;
};

const getEloSport = async (userId, sportId) => {
    const user = await User.findById(userId);
    const elo = user.elo.find(e => e.sport.toString() == sportId);
    return elo.elo;
}

const sendFriendRequest = async (fromUserId, toUserId) => {
    const toUser = await User.findById(toUserId);
    if (!toUser.friendRequests.includes(fromUserId) && !toUser.friends.includes(fromUserId)) {
        toUser.friendRequests.push(fromUserId);
        await toUser.save();
    }
};

const acceptFriendRequest = async (fromUserId, toUserId) => {
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    // Eliminar la solicitud de amistad
    toUser.friendRequests = toUser.friendRequests.filter(request => request.toString() !== fromUserId);
    // Añadir amigos mutuamente
    if (!fromUser.friends.includes(toUserId)) {
        fromUser.friends.push(toUserId);
    }
    if (!toUser.friends.includes(fromUserId)) {
        toUser.friends.push(fromUserId);
    }

    await fromUser.save();
    await toUser.save();
    await chatService.createChat([fromUserId, toUserId]);
};

const removeFriend = async (userId, friendId) => {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    user.friends = user.friends.filter(friend => friend.toString() !== friendId);
    friend.friends = friend.friends.filter(friend => friend.toString() !== userId.toString());

    await user.save();
    await friend.save();
};

const getFriends = async (userId) => {
    const user = await User.findById(userId).populate('friends', 'email username');
    return user.friends;
};

const deleteFriendRequest = async (fromUserId, toUserId) => {
    const toUser = await User.findById(toUserId);
    toUser.friendRequests = toUser.friendRequests.filter(request => request.toString() !== fromUserId);
    await toUser.save();
};

const buscarUsuarios = async (username) => {
    return await User.find({ username: { $regex: `.*${username}.*`, $options: 'i' } });
};

export default {
    getAllUsers,
    getUserById,
    updateUser,
    getEloSport,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    getFriends,
    deleteFriendRequest,
    buscarUsuarios
}

