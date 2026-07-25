import { AdminRole } from '@prisma/client'

export interface AdminWithPermissions {
  id: string
  role: AdminRole
  permissions?: {
    users?: boolean
    ads?: boolean
    stories?: boolean
    tickets?: boolean
    costs?: boolean
    articles?: boolean
    advertisements?: boolean
  }
}

export function hasAdPermission(admin: AdminWithPermissions): boolean {
  if (admin.role === 'OWNER') return true
  if (admin.role === 'ADMIN' || admin.role === 'SUPPORTER') {
    return admin.permissions?.ads === true
  }
  return false
}

export function checkAdPermission(admin: AdminWithPermissions): void {
  if (!hasAdPermission(admin)) {
    throw new Error('شما دسترسی لازم برای مدیریت آگهی‌ها را ندارید')
  }
}

export function hasCostPermission(admin: AdminWithPermissions): boolean {
  if (admin.role === 'OWNER') return true
  if (admin.role === 'ADMIN' || admin.role === 'SUPPORTER') {
    return admin.permissions?.costs === true
  }
  return false
}

export function checkCostPermission(admin: AdminWithPermissions): void {
  if (!hasCostPermission(admin)) {
    throw new Error('شما دسترسی لازم برای مدیریت قیمت‌ها را ندارید')
  }
} 