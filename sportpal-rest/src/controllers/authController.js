import { registerUser, loginUser } from '../services/authService.js';
import sportService from '../services/sportService.js';
import config from '../config/config.js';


const iniciarElo = async () => {
  const deportes = await sportService.getAllSports();
  const elo = [];
  deportes.forEach(deporte => {
    elo.push({elo: 1500, sport: deporte._id});
  });
  return elo;
}

export const register = async (req, res) => {
  try {
    req.body.elo = await iniciarElo();
    req.body.friendRequests = [];
    req.body.friends = [];
    req.body.teams = [];
    req.body.events = [];
    req.body.teamEvents = [];

    const user = await registerUser(req.body);
    const token = loginUser(user.email, req.body.password);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: config.cookieExpiresIn * 24 * 60 * 60 * 1000 // 1 día
    });

    res.status(201).json({
      _id: user._id,
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
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, username, nombre, apellidos, elo, friendRequests, friends, teams, events, teamEvents, _id} = await loginUser(email, password);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: config.cookieExpiresIn * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ 
      email, 
      username, 
      nombre, 
      apellidos,
      elo,
      friendRequests,
      friends,
      teams,
      events,
      teamEvents,
      _id
     });
    
  } catch (error) {
    res.status(401).json({ message: error.message });
  } 

};

export const logout = async (req, res) => {
  res.clearCookie('access_token');
  res.status(200).json({ message: 'Logged out' });
};