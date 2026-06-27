import type { Request, Response } from 'express'
import prisma from '../../config/prisma';
import { hash } from 'bcrypt';

type RegisterSubAdminInput = {
  firstName: string;       // Min length 2, Max length 30
  lastName: string;        // Min length 2, Max length 30
  phone: string;           // Regex: /^09\d{9}$/ (Iranian Phone Number)
  password: string;        // Min length 8, Must contain uppercase, lowercase, number
  passwordConfirm: string; // Must match password field
};

export async function SuperAdminRegister(req: Request, res: Response) {
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
    return res.status(400).json({
    message: "Phone already exists",
    error: "Bad Request",
    statusCode: 400
  })
}

  const hashedPassword = await hash(body.password, 12);

  const createdAdmin = await prisma.admin.create({
    data: {
      firstname: body.firstName,
      lastname: body.lastName,
      password: hashedPassword,
      phone: body.phone,
      role: 'super_admin'
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