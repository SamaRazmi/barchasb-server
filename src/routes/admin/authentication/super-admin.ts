import { Router } from "express";
import { SuperAdminRegister } from "../../../controllers/admin/super-admin";

const router = Router();

router.post('/super-admin/register', SuperAdminRegister);