import { Router } from 'express';
import adminController from '../controllers/adminController';
import autMiddleware from '../middlewares/autMiddleware';



const router = Router();

router.post('/createAdmin',autMiddleware.AdminAuthenticateToken,adminController.createAdmin)
router.get('/teachers',autMiddleware.AdminAuthenticateToken, adminController.FetchTeachersDetails);
router.put('/teacher-block/:id',autMiddleware.AdminAuthenticateToken, adminController.TeacherBlock);
router.put('/teacher-unblock/:id',autMiddleware.AdminAuthenticateToken, adminController.TeacherUnblock);
router.patch('/teacher/reject/:id',autMiddleware.AdminAuthenticateToken, adminController.rejectTeacher);
router.patch('/teacher/approve/:id',autMiddleware.AdminAuthenticateToken, adminController.approveTeacher);



router.get('/dashboard',autMiddleware.AdminAuthenticateToken,adminController.dashboardData)


router.get('/students',autMiddleware.AdminAuthenticateToken, adminController.getStudents);
router.put('/student-block/:id',autMiddleware.AdminAuthenticateToken, adminController.StudentBlock);
router.put('/student-unblock/:id',autMiddleware.AdminAuthenticateToken, adminController.StudentUnblock);

// classrooms--------
router.get('/classrooms',autMiddleware.AdminAuthenticateToken, adminController.fetchClassrooms);
router.patch('/classroom-block/:id',autMiddleware.AdminAuthenticateToken, adminController.classroomBlock);
router.patch('/classroom-unblock/:id',autMiddleware.AdminAuthenticateToken, adminController.classroomUnblock);




// Other routes...

export default router;
