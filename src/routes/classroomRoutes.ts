import { Router } from 'express';
import classroomController from '../controllers/classroomController';

const router = Router();
router.post('/classrooms', classroomController.createClassroom);

// Other routes...

export default router;
