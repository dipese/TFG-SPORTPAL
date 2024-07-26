import express from 'express'
import mongoose from 'mongoose'
import config from './config/config.js'
import userRoutes from './routes/usersRoutes.js'
import authRoutes from './routes/authRoutes.js'
import teamRoutes from './routes/teamsRoutes.js'
import sportRoutes from './routes/sportsRoutes.js'
import eventsRoutes from './routes/eventsRoutes.js'
import chatRoutes from './routes/chatsRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import { Server } from 'socket.io'
import chatService from './services/chatService.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    }

});


app.use(express.json())
app.disable('x-powered-by')

app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

//RUTAS
app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/teams', teamRoutes)
app.use('/sports', sportRoutes)
app.use('/events', eventsRoutes)
app.use('/chats', chatRoutes)

//CONEXION A LA BASE DE DATOS
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Database connected')

    }).catch (err => {
        console.error (err)
})

const PORT = config.port;

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('joinChat', ({ chatId }) => {
        socket.join(chatId);
        console.log(`Un usuario se unió al chat: ${chatId}`);
    });
    
    socket.on('sendMessage', async ({ chatId, message }) => {
        try{
            await chatService.sendMessage(chatId, message.sender, message.content);
            io.to(chatId).emit('message', message);
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});


server.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})
