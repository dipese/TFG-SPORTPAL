import { Router } from 'express'
import eventsController from '../controllers/eventsController.js'
import protect from '../middlewares/authMiddelware.js'

const router = Router();

router.get('/', eventsController.getAllEvents);
router.post('/', protect, eventsController.createEvent);
router.put('/:id', protect, eventsController.updateEvent);
router.put('/join/:id', protect, eventsController.solicitarUnionEvento);
router.put('join/:id/team/:teamId', protect, eventsController.solicitarUnionEventoEquipo);
router.get('/eventsMostrar', protect, eventsController.getEventsAMostrar);


export default router;