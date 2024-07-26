import dotenv from 'dotenv';

dotenv.config();

console.log (process.env.MONGO_URI)

export default {
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    cookieExpiresIn: process.env.COOKIE_EXPIRES_IN || 1
  };