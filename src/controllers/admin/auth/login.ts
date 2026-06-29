import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../../../config/prisma'
import jwt from 'jsonwebtoken'

export async function AdminLogin(req: Request, res: Response) {
  const body = req.body

  if (!body?.phone || !body?.password) {
    return res.status(400).json({
      message: [
        "password or phone is not entered"
      ],
      error: "Bad Request",
      statusCode: 400
    })
  }

  const admin = await prisma.admin.findUnique({
    where: {
      phone: body.phone
    }
  })

  if (!admin || !admin.verified) {
    return res.status(401).json({
      message: "ادمین با این مشخصات وجود ندارد",
      error: "Unauthorized",
      statusCode: 401
    })
  }

  const validatingPassword = await bcrypt.compare(body.password, admin.password)

  if (!validatingPassword) {
    return res.status(401).json({
      message: "invalid credentials",
      error: "Unauthorized",
      statusCode: 401
    })
  }

  if (admin.role == 'admin') {
    const payload = {
      sub: admin.id,
      phone: admin.phone,
      role: 'ADMIN',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_ADMIN!)

    return res.status(200).json({
      accessToken: token
    })
  } else if (admin.role == 'super_admin') {
    const payload = {
      sub: admin.id,
      phone: admin.phone,
      role: 'SUPER_ADMIN',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_SUPER_ADMIN!)

    return res.status(200).json({
      accessToken: token
    })
  }
}