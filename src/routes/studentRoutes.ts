import { Router } from 'express';
import authMiddleware from '../middlewares/autMiddleware'; // Adjust path as needed
import studentController from '../controllers/studentController';
import multer from 'multer'

const router = Router();
const upload=multer({dest:'uploads/'})

router.get('/home', authMiddleware.authenticateToken, studentController.home);
router.put('/profile/:id', authMiddleware.authenticateToken,upload.single('profilePic'), studentController.updateProfile);
router.get('/profile/:id', authMiddleware.authenticateToken, studentController.profile);



export default router;
