import { Router } from 'express';
import adminController from '../controllers/adminController';
import autMiddleware from '../middlewares/autMiddleware';



const router = Router();

router.post('/createAdmin',autMiddleware.AdminAuthenticateToken,adminController.createAdmin)
router.get('/teachers',autMiddleware.AdminAuthenticateToken, adminController.FetchTeachersDetails);
router.get('/students',autMiddleware.AdminAuthenticateToken, adminController.FetchStudentsDetails);

// Other routes...

export default router;
