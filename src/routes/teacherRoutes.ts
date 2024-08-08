import { Router } from 'express';
import teacherController from '../controllers/teacherController';
import autMiddleware from '../middlewares/autMiddleware'
const router = Router();

router.get('/home',autMiddleware.TeacherAuthenticateToken,teacherController.home);

// Other routes...


export default router;