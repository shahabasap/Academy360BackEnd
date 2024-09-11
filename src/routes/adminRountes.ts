import { Router } from 'express';
import adminController from '../controllers/adminController';
import autMiddleware from '../middlewares/autMiddleware';



const router = Router();
const role=process.env.Admin_Role as string

router.post('/createAdmin',adminController.createAdmin)
router.get('/teachers',autMiddleware.authenticateToken(role), adminController.FetchTeachersDetails);
router.put('/teacher-block/:id',autMiddleware.authenticateToken(role), adminController.TeacherBlock);
router.put('/teacher-unblock/:id',autMiddleware.authenticateToken(role), adminController.TeacherUnblock);
router.patch('/teacher/reject/:id',autMiddleware.authenticateToken(role), adminController.rejectTeacher);
router.patch('/teacher/approve/:id',autMiddleware.authenticateToken(role), adminController.approveTeacher);



router.get('/dashboard',autMiddleware.authenticateToken(role),adminController.dashboardData)


router.get('/students',autMiddleware.authenticateToken(role), adminController.getStudents);
router.put('/student-block/:id',autMiddleware.authenticateToken(role), adminController.StudentBlock);
router.put('/student-unblock/:id',autMiddleware.authenticateToken(role), adminController.StudentUnblock);

// classrooms--------
router.get('/classrooms',autMiddleware.authenticateToken(role), adminController.fetchClassrooms);
router.patch('/classroom-block/:id',autMiddleware.authenticateToken(role), adminController.classroomBlock);
router.patch('/classroom-unblock/:id',autMiddleware.authenticateToken(role), adminController.classroomUnblock);




// Other routes...

export default router;
