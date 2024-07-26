import { Router } from 'express'
import sportsController from '../controllers/sportsController.js'

const router = Router();

router.get('/', sportsController.getAllSports);
router.get('/:id', sportsController.getSportById);

export default router;