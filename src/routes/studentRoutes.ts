import { Router } from 'express';
import authMiddleware from '../middlewares/autMiddleware'; // Adjust path as needed
import studentController from '../controllers/studentController';

const router = Router();

router.get('/home', authMiddleware.authenticateToken, studentController.home);

export default router;
