import { Router } from 'express';
import teacherController from '../controllers/teacherController';
import autMiddleware from '../middlewares/autMiddleware'
import multer from 'multer'
const router = Router();

const upload = multer({ dest: 'uploads/' }); 

router.get('/home',autMiddleware.TeacherAuthenticateToken,teacherController.home);
router.put('/profile/:id',autMiddleware.TeacherAuthenticateToken, upload.single('profilePic'), teacherController.updateProfile);
router.get('/profile/:id',autMiddleware.TeacherAuthenticateToken,  teacherController.profile);
router.post('/classroom',autMiddleware.TeacherAuthenticateToken,  teacherController.classroom);


// Other routes...


export default router;