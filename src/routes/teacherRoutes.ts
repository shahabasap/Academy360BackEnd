import { Router } from 'express';
import teacherController from '../controllers/teacherController';
import autMiddleware from '../middlewares/autMiddleware'
import classroomAuth from '../middlewares/classroomAuth'
import multer from 'multer'
import classroomController from '../controllers/classroomController';
import attendenceController from '../controllers/attendenceController';
import { upload } from '../config/multer';
const router = Router();


const role=process.env.Teacher_Role as string



router.get('/home',autMiddleware.authenticateToken(role),teacherController.home);

// Profile routes------------------------------
router.put('/profile/:id', autMiddleware.authenticateToken(role), upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'ugCertificate', maxCount: 1 },
    { name: 'pgCertificate', maxCount: 1 },
  ]), teacherController.updateProfile);

router.patch('/profile-pic/:id',autMiddleware.authenticateToken(role),upload.single('profilePic'),  teacherController.profilePic);
router.get('/profile/:id',autMiddleware.authenticateToken(role),  teacherController.profile);

// classrooms routes--------
router.post('/classroom',autMiddleware.authenticateToken(role),  classroomController.createClassroom);
router.get('/addStudent',autMiddleware.authenticateToken(role),classroomAuth.authenticateToken(role+'-class'),  classroomController.addStudent);
router.get('/classrooms/:id',autMiddleware.authenticateToken(role),  classroomController.fetchTeacherClassrooms);
router.post('/joinclassroom',autMiddleware.authenticateToken(role),  classroomController.teacherJoinToClassroom);
router.post('/students',autMiddleware.authenticateToken(role),classroomAuth.authenticateToken(role+'-class'),  classroomController.searchStudents);
router.get('/classroom-logout',autMiddleware.authenticateToken(role),classroomAuth.authenticateToken(role+'-class'),  classroomController.teacherClasroomLogout);
router.get('/classroom-data/:id',autMiddleware.authenticateToken(role),classroomAuth.authenticateToken(role+'-class'),  classroomController.classroomData);

router.post('/attendance',autMiddleware.authenticateToken(role),classroomAuth.authenticateToken(role+'-class'),  attendenceController.DayAttendence);
router.patch('/attendance',autMiddleware.authenticateToken(role),classroomAuth.authenticateToken(role+'-class'),  attendenceController.MarkAttendence);
router.get('/attendance',autMiddleware.authenticateToken(role),classroomAuth.authenticateToken(role+'-class'),  attendenceController.AttendenceHistory);













// Other routes...


export default router;