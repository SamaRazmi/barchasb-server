import type { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { hash } from 'bcrypt'
import prisma from "../../../config/prisma";

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
    message: [
      "Passwords do not match"
    ],
    error: "Bad Request",
    statusCode: 400
  })

  const AdminExist = await prisma.admin.findUnique({
    where: {
      phone: `${body.phone!}`
    },
    select: { id: true }
  })

  if (AdminExist) {
    return res.status(400).json(
      {
        message: "Phone already exists",
        error: "Bad Request",
        statusCode: 400
      }
    )
  }

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
    message: 'Admin registered',
    superAdminId: createdAdmin.id,
  })
}

// only super admin can see the pending admins 
export async function AdminPending(req: Request, res: Response) {

  const pendingAdmin = await prisma.admin.findMany()

  // removes passsword from pendingAdmin variable
  const sanitizedAdmins = pendingAdmin.map(({ password, ...rest }) => rest);

  return res.status(200).json(sanitizedAdmins)
}

// only super admin can see the pending admins
export async function AdminActivate(req: Request, res: Response) {

  const admin_parameter = req.params.id as string
  const activated_admin = await prisma.admin.update({
    where: {
      id: admin_parameter
    },
    data: {
      verified: true
    },
    select: {
      id: true,
      role: true,
      firstname: true,
      lastname: true,
      phone: true,
      verified: true,
      createdAt: true
    }
  })

  return res.status(200).json(activated_admin)
}


export async function AdminReject(req: Request, res: Response) {

  const admin_parameter = req.params.id as string
  const activated_admin = await prisma.admin.delete({
    where: {
      id: admin_parameter
    },
    select: {
      id: true,
      role: true,
      firstname: true,
      lastname: true,
      phone: true,
      verified: true,
      createdAt: true
    }
  })

  return res.status(200).json(activated_admin)
}

export async function ActiveAdmins(req: Request, res: Response) {

  const activeAdmin = await prisma.admin.findMany({
    where: {
      verified: true
    },
    select: {
      id: true,
      role: true,
      firstname: true,
      lastname: true,
      phone: true,
      verified: true,
      createdAt: true
    }
  })

  return res.status(200).json(activeAdmin)
}
