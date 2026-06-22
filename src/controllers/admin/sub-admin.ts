import type { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import prisma from "../../config/prisma";
import { hash } from 'bcrypt'

type RegisterSubAdminInput = {
  firstName: string;       // Min length 2, Max length 30
  lastName: string;        // Min length 2, Max length 30
  phone: string;           // Regex: /^09\d{9}$/ (Iranian Phone Number)
  password: string;        // Min length 8, Must contain uppercase, lowercase, number
  passwordConfirm: string; // Must match password field
};

export async function AdminRegister(req: Request, res: Response) {
  const body: RegisterSubAdminInput = req.body

  if (!body?.firstName || !body?.lastName || !body?.phone || !body?.password || !body?.passwordConfirm) {
    return res.status(400).json({
      error: "Bad Request",
      statusCode: 400
    })
  }

  if (body.password !== body.passwordConfirm) return res.status(400).json({

  })

  const AdminExist = await prisma.admin.findUnique({
    where: {
      phone: `${body.phone!}`
    },
    select: { id: true }
  })

  if (AdminExist) return res.status(400)

  const hashedPassword = await hash(body.password, 12);

  const createdAdmin = await prisma.admin.create({
    data: {
      firstname: body.firstName,
      lastname: body.lastName,
      password: hashedPassword,
      phone: body.phone,
      role: 'admin'
    },
    select: {
      id: true
    }
  })

  return res.status(201).json({
    message: 'Super Admin registered',
    superAdminId: createdAdmin.id,
  })
}

// only super admin can see the pending admins 
export async function AdminPending(req: Request, res: Response) {
  if (!verifySuperAdmin(req, res)) return;


  return await prisma.admin.findMany()
}

// only super admin can see the pending admins
export async function AdminActivate(req: Request, res: Response) {
  if (!verifySuperAdmin(req, res)) return;


  const admin_parameter = req.params.id as string
  const activated_admin = await prisma.admin.update({
    where: {
      id: admin_parameter
    },
    data: {
      verified: true
    }
  })

  return res.status(200).json(activated_admin)
}


export async function AdminReject(req: Request, res: Response) {
  if (!verifySuperAdmin(req, res)) return;


  const admin_parameter = req.params.id as string
  const activated_admin = await prisma.admin.delete({
    where: {
      id: admin_parameter
    },
  })

  return res.status(200).json(activated_admin)
}


function verifySuperAdmin(req: Request, res: Response): boolean {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "دسترسی غیرمجاز: توکن ارسال نشده است.",
    });
    return false;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_SUPER_ADMIN!);
    return true;
  } catch (err) {
    res.status(403).json({
      message: "Only Super Admin can perform this action",
      error: "Forbidden",
      statusCode: 403
    });
    return false;
  }
}