import { Router } from "express";
import { AdminRegisterController } from "../../../controllers/admin/sub-admin";

const router = Router();

router.post('/sub-admin/register', AdminRegisterController);


// router.post('/auth/sub-admin/approve/:id');


// router.post('/auth/sub-admin/reject/:id');


// router.get('/sub-admins/active');


// router.get('/sub-admin/pending');

export default router;