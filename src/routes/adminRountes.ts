import { Router } from 'express';
import adminController from '../controllers/adminController';
import autMiddleware from '../middlewares/autMiddleware';



const router = Router();

router.post('/createAdmin',autMiddleware.AdminAuthenticateToken,adminController.createAdmin)
router.get('/teachers',autMiddleware.AdminAuthenticateToken, adminController.FetchTeachersDetails);
router.put('/teacher-block/:id',autMiddleware.AdminAuthenticateToken, adminController.TeacherBlock);
router.put('/teacher-unblock/:id',autMiddleware.AdminAuthenticateToken, adminController.TeacherUnblock);
router.get('/dashboard',autMiddleware.AdminAuthenticateToken,adminController.dashboardData)


router.get('/students',autMiddleware.AdminAuthenticateToken, adminController.FetchStudentsDetails);
router.put('/student-block/:id',autMiddleware.AdminAuthenticateToken, adminController.StudentBlock);
router.put('/student-unblock/:id',autMiddleware.AdminAuthenticateToken, adminController.StudentUnblock);

// Other routes...

export default router;
