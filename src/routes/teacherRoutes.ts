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
router.post('/classroom',autMiddleware.TeacherAuthenticateToken,  classroomController.createClassroom);
router.get('/addStudent',autMiddleware.TeacherAuthenticateToken,  classroomController.addStudent);
router.get('/classrooms/:id',autMiddleware.TeacherAuthenticateToken,  classroomController.fetchTeacherClassrooms);
router.post('/joinclassroom',autMiddleware.TeacherAuthenticateToken,  classroomController.teacherJoinToClassroom);
router.post('/students',autMiddleware.TeacherAuthenticateToken,  classroomController.searchStudents);






// Other routes...


export default router;