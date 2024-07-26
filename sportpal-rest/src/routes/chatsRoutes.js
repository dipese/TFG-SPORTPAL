import { Router } from 'express'
import chatsController from '../controllers/chatsController.js'
import protect from '../middlewares/authMiddelware.js'


const router = Router()

router.get('/friend/:friendId', protect, chatsController.getChatConAmigo);
router.get('/team/:teamId', protect, chatsController.getChatConEquipo);
router.get('/event/:eventId', protect, chatsController.getChatConEvento);
router.post('/sendMessage/:chatId', chatsController.sendMessage);
router.get('/getChat/:chatId', chatsController.getChat);

export default router