import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config/config.js';


const protect = async (req, res, next) => {
  let token;

  
  token = req.cookies['access_token'];

  if (req.cookies['access_token']) {
    try {
      
      const decoded = jwt.verify(token, config.jwtSecret);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protect;
