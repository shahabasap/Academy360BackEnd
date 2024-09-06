import { Router } from 'express';
import authMiddleware from '../middlewares/autMiddleware'; // Adjust path as needed
import studentController from '../controllers/studentController';
import multer from 'multer'
import classroomController from '../controllers/classroomController';

const router = Router();
const upload=multer({dest:'uploads/'})

router.get('/home', authMiddleware.authenticateToken, studentController.home);

// Profile routes------------
router.put('/profile/:id', authMiddleware.authenticateToken,upload.single('photo'), studentController.updateProfile);
router.patch('/profile/:id', authMiddleware.authenticateToken,upload.single('photo'), studentController.updateProfilepic);
router.get('/profile/:id', authMiddleware.authenticateToken, studentController.profile);

// Classrooms--------------
router.post('/addClassroom', authMiddleware.authenticateToken, classroomController.addClassroom);
router.get('/classrooms/:id', authMiddleware.authenticateToken, classroomController.fetchStudentsClassrooms);
router.post('/joinClassroom', authMiddleware.authenticateToken, classroomController.studentJoinToClassroom);








export default router;
