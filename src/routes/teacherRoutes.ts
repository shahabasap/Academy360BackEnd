import { Router } from 'express';
import teacherController from '../controllers/teacherController';
import autMiddleware from '../middlewares/autMiddleware'
import multer from 'multer'
import classroomController from '../controllers/classroomController';
import attendenceController from '../controllers/attendenceController';
import { upload } from '../config/multer';
const router = Router();



router.get('/home',autMiddleware.TeacherAuthenticateToken,teacherController.home);

// Profile routes------------------------------
router.put('/profile/:id', autMiddleware.TeacherAuthenticateToken, upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'ugCertificate', maxCount: 1 },
    { name: 'pgCertificate', maxCount: 1 },
  ]), teacherController.updateProfile);

router.patch('/profile-pic/:id',autMiddleware.TeacherAuthenticateToken,upload.single('profilePic'),  teacherController.profilePic);
router.get('/profile/:id',autMiddleware.TeacherAuthenticateToken,  teacherController.profile);

// classrooms routes--------
router.post('/classroom',autMiddleware.TeacherAuthenticateToken,  classroomController.createClassroom);
router.get('/addStudent',autMiddleware.TeacherAuthenticateToken,  classroomController.addStudent);
router.get('/classrooms/:id',autMiddleware.TeacherAuthenticateToken,  classroomController.fetchTeacherClassrooms);
router.post('/joinclassroom',autMiddleware.TeacherAuthenticateToken,  classroomController.teacherJoinToClassroom);
router.post('/students',autMiddleware.TeacherAuthenticateToken,  classroomController.searchStudents);


router.post('/attendence',autMiddleware.TeacherAuthenticateToken,  attendenceController.DayAttendence);
router.patch('/attendence',autMiddleware.TeacherAuthenticateToken,  attendenceController.MarkAttendence);
router.get('/attendence',autMiddleware.TeacherAuthenticateToken,  attendenceController.AttendenceHistory);












// Other routes...


export default router;