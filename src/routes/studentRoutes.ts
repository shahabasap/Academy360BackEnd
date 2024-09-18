import { Router } from 'express';
import authMiddleware from '../middlewares/autMiddleware';
import studentController from '../controllers/studentController';
import multer from 'multer';
import classroomController from '../controllers/classroomController';
import classroomAuth from '../middlewares/classroomAuth';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Define student role (can be from environment or hardcoded for now)
const studentRole = process.env.Student_Role as string;


// Home route (for student)
router.get('/home', authMiddleware.authenticateToken(studentRole), studentController.home);

// Profile routes
router.put('/profile/:id', authMiddleware.authenticateToken(studentRole), upload.single('photo'), studentController.updateProfile);
router.patch('/profile/:id', authMiddleware.authenticateToken(studentRole), upload.single('photo'), studentController.updateProfilepic);
router.get('/profile/:id', authMiddleware.authenticateToken(studentRole), studentController.profile);

// Classrooms
router.post('/addClassroom', authMiddleware.authenticateToken(studentRole), classroomController.addClassroom);
router.get('/classrooms/:id', authMiddleware.authenticateToken(studentRole), classroomController.fetchStudentsClassrooms);
router.post('/joinClassroom', authMiddleware.authenticateToken(studentRole), classroomController.studentJoinToClassroom);
router.get('/classroom/:id', authMiddleware.authenticateToken(studentRole), classroomController.fetchClassroom);
router.get('/classroom-lock', authMiddleware.authenticateToken(studentRole), classroomController.isLocked);
router.get('/classroom-logout', authMiddleware.authenticateToken(studentRole), classroomController.classroomLogout);
router.get('/classroom-data/:id', authMiddleware.authenticateToken(studentRole),classroomAuth.authenticateToken(studentRole+'-class') ,classroomController.classroomData);

export default router;
