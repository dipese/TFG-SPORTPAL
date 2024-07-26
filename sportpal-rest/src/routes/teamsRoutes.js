import { Router } from 'express'
import teamsController from '../controllers/teamsController.js'
import protect from '../middlewares/authMiddelware.js'


const router = Router();

router.get('/', teamsController.getAllTeams);
router.post('/', protect, teamsController.createTeam);
router.get('/buscar', protect, teamsController.buscarEquipos);
router.get('/:id', teamsController.getTeamById);
router.put('/join/:id', protect, teamsController.solictarIngreso);


export default router;