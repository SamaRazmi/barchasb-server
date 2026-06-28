import { Router } from "express";
import { SuperAdminRegister } from "../../../controllers/admin/auth/super-admin";

const router = Router();

router.post('/super-admin/register', SuperAdminRegister);

export default router;