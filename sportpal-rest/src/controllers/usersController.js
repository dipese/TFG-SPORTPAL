import userService from '../services/userService.js';
import teamsService from '../services/teamsService.js';
import { get } from 'mongoose';
import Event from '../models/events.js';

const getAllUsers = async (req, res) => {
    try {
      const filters = req.query;
      const users = await userService.getAllUsers(filters);
      const filteredUsers = users.map(user => {
        return {
          nombre: user.nombre,
          apellidos: user.apellidos,
          username: user.username,
          elo: user.elo,
          _id: user._id
        };
      });
      res.json(filteredUsers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
  try {
    const id = req.user._id;
    const userData = req.body;
    const updatedUser = await userService.updateUser(id, userData);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEquiposUsuario = async (req, res) => {
  try {
    const teams = await teamsService.getAllTeams({ players: req.user._id });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEquiposAdministrados = async (req, res) => {
  try {
    const teams = await teamsService.getAllTeams({ admin: req.user._id });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const sendFriendRequest = async (req, res) => {
  try {
    const { toUserId } = req.params;
    const fromUserId = req.user._id;
    await userService.sendFriendRequest(fromUserId, toUserId);
    res.status(200).json({ message: 'Friend request sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { fromUserId } = req.params;
    const toUserId = req.user._id;
    await userService.acceptFriendRequest(fromUserId, toUserId);
    res.status(200).json({ message: 'Friend request accepted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;
    await userService.removeFriend(userId, friendId);
    res.status(200).json({ message: 'Friend removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const friends = await userService.getFriends(userId);
    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFriendRequest = async (req, res) => {
  try {
    const { fromUserId } = req.params;
    const toUserId = req.user._id;
    await userService.deleteFriendRequest(fromUserId, toUserId);
    res.status(200).json({ message: 'Friend request deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const buscarUsuarios = async (req, res) => {
  try {
    const { username } = req.query;
    const users = await userService.buscarUsuarios( username );

    // Filter out the user with req.user._id
    const sinUserSolicitante = users.filter(user => user._id.toString() !== req.user._id.toString());

    const filteredUsers = sinUserSolicitante.map(user => {
      return {
        nombre: user.nombre,
        apellidos: user.apellidos,
        username: user.username,
        elo: user.elo,
        _id: user._id,
        friends: user.friends,
        friendRequests: user.friendRequests
      };
    });

    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getEventosUsuarios = async (req, res) => {
  try {
    const userId = req.user._id; // Asumiendo que el ID del usuario está disponible en req.user._id

    // Buscar eventos donde el usuario es participante1, participante2, o parte de equipo1 o equipo2
    const eventos = await Event.find({
      $or: [
        { participante1: userId },
        { participante2: userId },
        { equipo1: { $in: [userId] } }, // Asumiendo que equipo1 y equipo2 almacenan arrays de IDs de usuarios
        { equipo2: { $in: [userId] } }
      ]
    }).populate('participante1 participante2 equipo1 equipo2'); // Opcional: Poblar los documentos relacionados para obtener más detalles

    if (eventos.length > 0) {
      res.json(eventos);
    } else {
      res.status(404).json({ message: 'No se encontraron eventos para el usuario.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export default {
  getAllUsers,
  updateUser,
  getEquiposUsuario,
  getEquiposAdministrados,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getFriends,
  deleteFriendRequest,
  buscarUsuarios,
  getEventosUsuarios,
};