import { Router } from 'express';
import teacherController from '../controllers/teacherController';
import autMiddleware from '../middlewares/autMiddleware'
import multer from 'multer'
import classroomController from '../controllers/classroomController';
const router = Router();

const upload = multer({ dest: 'uploads/' }); 

router.get('/home',autMiddleware.TeacherAuthenticateToken,teacherController.home);

// Profile routes------------------------------
router.put('/profile/:id',autMiddleware.TeacherAuthenticateToken, upload.single('profilePic'), teacherController.updateProfile);
router.get('/profile/:id',autMiddleware.TeacherAuthenticateToken,  teacherController.profile);

// classrooms routes--------
router.post('/classroom',autMiddleware.TeacherAuthenticateToken,  classroomController.classroom);
router.get('/addStudent',autMiddleware.TeacherAuthenticateToken,  classroomController.AddStudent);



// Other routes...


export default router;