import { Router } from 'express';
import adminController from '../controllers/adminController';


const router = Router();
router.get('/teachers', adminController.FetchTeachersDetails);
router.get('/students', adminController.FetchStudentsDetails);

// Other routes...

export default router;
