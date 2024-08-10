import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

// Student-Routes------------------------------------

router.post('/login', authController.login);
router.post('/register', authController.SignUp);
router.post('/otp', authController.Otp);
router.post('/student/verify', authController.VerifyOtp);
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);
router.get('/logout', authController.logout);


// Admin Routes------------------------
router.post('/admin/login', authController.AdminLogin);

// Teacher Rountes-------------------------------------------
// router.post('/teacher/login', authController.TeacherLogin);
router.post('/teacher/login', authController.TeacherLogin);
router.post('/teacher/register', authController.TeacherSignUp);
router.post('/teacher/otp', authController.TeacherOtp);
router.post('/teacher/verify', authController.TeacherVerifyOtp);




export default router;