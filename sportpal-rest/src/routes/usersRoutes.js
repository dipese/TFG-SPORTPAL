import { Router } from 'express'
import usersController from '../controllers/usersController.js'
import protect from '../middlewares/authMiddelware.js'

const router = Router();

router.get('/', protect, usersController.getAllUsers);
router.put('/update', protect, usersController.updateUser);
router.get('/teams', protect, usersController.getEquiposUsuario);
router.get('/adminTeams', protect, usersController.getEquiposAdministrados);
router.post('/friendRequest/:toUserId', protect, usersController.sendFriendRequest);
router.post('/acceptFriendRequest/:fromUserId', protect, usersController.acceptFriendRequest);
router.delete('/removeFriend/:friendId', protect, usersController.removeFriend);
router.delete('/deleteFriendRequest/:fromUserId', protect, usersController.deleteFriendRequest);
router.get('/friends', protect, usersController.getFriends);
router.get('/events', protect, usersController.getEventosUsuarios);
router.get('/buscar', protect, usersController.buscarUsuarios);


export default router;
