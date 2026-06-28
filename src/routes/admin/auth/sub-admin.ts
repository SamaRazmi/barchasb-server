import { Router } from "express";
import { AdminPending, AdminRegister, AdminActivate, AdminReject, ActiveAdmins } from "../../../controllers/admin/auth/sub-admin";

const router = Router();

router.post('/sub-admin/register', AdminRegister);

router.get('/sub-admin/pending', AdminPending);

router.post('/sub-admin/approve/:id', AdminActivate);

router.get('/sub-admin/reject/:id', AdminReject);

router.get('/sub-admins/active', ActiveAdmins);

export default router;