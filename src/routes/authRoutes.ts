import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

// Student-Routes------------------------------------

router.post('/login', authController.login);
router.post('/register', authController.SignUp);
router.post('/otp', authController.Otp);
router.post('/student/verify', authController.VerifyOtp);
router.post('/forgotpassword',authController.studentForgotPassword)
router.post('/reset-password',authController.studentResetPassword)
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);
router.get('/logout', authController.StudentLogout);


// Admin Routes------------------------
router.post('/admin/login', authController.AdminLogin);
router.get('/admin/logout',authController.AdminLogout)

// Teacher Rountes-------------------------------------------
// router.post('/teacher/login', authController.TeacherLogin);
router.post('/teacher/login', authController.TeacherLogin);
router.post('/teacher/register', authController.TeacherSignUp);
router.post('/teacher/otp', authController.TeacherOtp);
router.post('/teacher/verify', authController.TeacherVerifyOtp);
router.get('/teacher/logout',authController.TeacherLogout)
router.post('/teacher/forgotpassword',authController.teacherForgotPassword)
router.post('/teacher/reset-password',authController.teacherResetPassword)




export default router;