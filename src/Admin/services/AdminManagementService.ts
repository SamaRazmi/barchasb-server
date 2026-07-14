import prisma from '../../config/prisma'
import bcrypt from 'bcrypt'
import { AdminRole, AdminStatus, Platform } from '@prisma/client'
import { toJalaliShort } from '../../utils/dateFormatter'

interface CreateAdminInput {
  fullName: string
  phone: string
  password: string
  role: AdminRole
  platforms: Platform[]
  permissions: {
    users: boolean
    ads: boolean
    stories: boolean
    tickets: boolean
    costs: boolean
    articles: boolean
    advertisements: boolean
  }
}

export async function createAdmin(input: CreateAdminInput) {
  const { fullName, phone, password, role, platforms, permissions } = input

  const existing = await prisma.admin.findFirst({
    where: { OR: [{ phone }, { username: phone }] },
  })
  if (existing) throw new Error('شماره تماس تکراری است')

  const hashedPassword = await bcrypt.hash(password, 12)

  const admin = await prisma.admin.create({
    data: {
      fullName,
      username: phone,
      phone,
      password: hashedPassword,
      role,
      status: AdminStatus.PENDING,
      platforms,
      permissions,
    },
  })

  return admin
}

interface GetAdminsInput {
  ownerId: string
  platformFilter?: Platform
}

export async function getAdmins(input: GetAdminsInput) {
  const { ownerId, platformFilter } = input

  const where: any = {
    role: { not: 'OWNER' },
    id: { not: ownerId },
  }

  if (platformFilter) {
    where.platforms = { has: platformFilter }
  }

  const admins = await prisma.admin.findMany({
    where,
    select: {
      id: true,
      fullName: true,
      status: true,
      role: true,
      platforms: true,
      permissions: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return admins.map((admin) => ({
    id: admin.id,
    fullName: admin.fullName,
    status: admin.status,
    role: admin.role,
    platforms: admin.platforms,
    createdAt: toJalaliShort(admin.createdAt),
    totalPermissions: admin.permissions
      ? Object.values(admin.permissions as any).filter(Boolean).length
      : 0,
  }))
}

export async function getAdminById(adminId: string) {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      platforms: true,
      permissions: true,
      createdAt: true,
    },
  })

  if (!admin) throw new Error('ادمین یافت نشد')
  return {
    ...admin,
    createdAt: toJalaliShort(admin.createdAt),
  }
}

interface UpdateAdminInput {
  adminId: string
  fullName?: string
  phone?: string
  password?: string
  role?: AdminRole
  status?: AdminStatus
  platforms?: Platform[]
  permissions?: any
}

export async function updateAdmin(input: UpdateAdminInput) {
  const { adminId, fullName, phone, password, role, status, platforms, permissions } = input

  const existing = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, role: true },
  })
  if (!existing) throw new Error('ادمین یافت نشد')
  if (existing.role === 'OWNER') throw new Error('نمی‌توان OWNER را ویرایش کرد')

  const data: any = {}
  if (fullName !== undefined) data.fullName = fullName
  if (phone !== undefined) data.phone = phone
  if (password) data.password = await bcrypt.hash(password, 12)
  if (role !== undefined) data.role = role
  if (status !== undefined) data.status = status
  if (platforms !== undefined) data.platforms = platforms
  if (permissions !== undefined) data.permissions = permissions

  const updated = await prisma.admin.update({
    where: { id: adminId },
    data,
    select: {
      id: true,
      fullName: true,
      username: true,
      phone: true,
      role: true,
      status: true,
      platforms: true,
      permissions: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return {
    ...updated,
    createdAt: toJalaliShort(updated.createdAt),
    updatedAt: toJalaliShort(updated.updatedAt),
  }
}

export async function deleteAdmin(adminId: string) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } })
  if (!admin) throw new Error('ادمین یافت نشد')
  if (admin.role === 'OWNER') throw new Error('نمی‌توان OWNER را حذف کرد')

  await prisma.admin.delete({ where: { id: adminId } })
  return { message: 'ادمین با موفقیت حذف شد' }
}