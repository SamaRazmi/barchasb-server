import { Router } from "express";
import { AdminPending, AdminRegister, AdminActivate, AdminReject } from "../../../controllers/admin/sub-admin";

const router = Router();

router.post('/sub-admin/register', AdminRegister);

router.get('/sub-admin/pending', AdminPending);

router.post('/sub-admin/approve/:id', AdminActivate);

router.get('/sub-admin/reject/:id', AdminReject);


// router.get('/sub-admins/active');


// router.get('/sub-admin/pending');

export default router;