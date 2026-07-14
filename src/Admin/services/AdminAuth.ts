import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma'

const JWT_SECRET = process.env.JWT_SECRET_ADMIN!
if (!JWT_SECRET) throw new Error('JWT_SECRET_ADMIN missing')

interface SetupOwnerInput {
  fullName: string
  username: string
  phone: string
  password: string
}

export async function setupOwner(input: SetupOwnerInput) {
  const { fullName, username, phone, password } = input

  const existingOwner = await prisma.admin.findFirst({
    where: { role: 'OWNER' },
  })
  if (existingOwner) {
    throw new Error('مدیر قبلاً ساخته شده است')
  }

  const existingUser = await prisma.admin.findFirst({
    where: {
      OR: [{ username }, { phone }],
    },
  })
  if (existingUser) {
    throw new Error('نام کاربری یا شماره تماس تکراری است')
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const owner = await prisma.admin.create({
    data: {
      fullName,
      username,
      phone,
      password: hashedPassword,
      role: 'OWNER',
      status: 'ACTIVE',
      platforms: ['SHOP', 'EDUCATION', 'CLUB', 'MAIN'],
      permissions: { all: true },
    },
  })

  return {
    id: owner.id,
    fullName: owner.fullName,
    username: owner.username,
    phone: owner.phone,
    role: owner.role,
    status: owner.status,
    platforms: owner.platforms,
  }
}

export async function loginAdmin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { username },
  })

  if (!admin) throw new Error('نام کاربری یا رمز عبور اشتباه است')

  if (admin.status === 'PENDING') {
    throw new Error('حساب شما در انتظار تایید است')
  }

  const isValid = await bcrypt.compare(password, admin.password)
  if (!isValid) throw new Error('نام کاربری یا رمز عبور اشتباه است')

  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  })

  const token = jwt.sign(
    {
      sub: admin.id,
      username: admin.username,
      role: admin.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  return {
    accessToken: token,
    admin: {
      id: admin.id,
      fullName: admin.fullName,
      username: admin.username,
      phone: admin.phone,
      role: admin.role,
      status: admin.status,
      platforms: admin.platforms,
      permissions: admin.permissions,
    },
  }
}

export async function getAdminProfile(adminId: string) {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      fullName: true,
      username: true,
      phone: true,
      role: true,
      status: true,
      platforms: true,
      permissions: true,
      lastLoginAt: true,
      createdAt: true,
    },
  })

  if (!admin) throw new Error('ادمین یافت نشد')
  return admin
}