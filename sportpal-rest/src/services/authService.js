import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config/config.js';

export const registerUser = async (userData) => {
    User.validateUser(userData);
    const user = new User(userData);
    return await user.save();
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    const token = generateToken(user._id);
    return {
      _id: user._id,
      token,
      email: user.email,
      username: user.username,
      nombre: user.nombre,
      apellidos: user.apellidos,
      elo: user.elo,
      friendRequests: user.friendRequests,
      friends: user.friends,
      teams: user.teams,
      events: user.events,
      teamEvents: user.teamEvents
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};
  