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
    all?: boolean
  }
}

export function hasAdPermission(admin: AdminWithPermissions): boolean {
  if (admin.role === 'OWNER') return true

  if (admin.role === 'ADMIN' || admin.role === 'SUPPORTER') {
    return admin.permissions?.ads === true || admin.permissions?.all === true
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
    return admin.permissions?.costs === true || admin.permissions?.all === true
  }
  return false
}

export function checkCostPermission(admin: AdminWithPermissions): void {
  if (!hasCostPermission(admin)) {
    throw new Error('شما دسترسی لازم برای مدیریت قیمت‌ها را ندارید')
  }
}

export function hasArticlePermission(admin: AdminWithPermissions): boolean {
  if (admin.role === 'OWNER') return true
  if (admin.role === 'ADMIN' || admin.role === 'SUPPORTER') {
    return admin.permissions?.articles === true || admin.permissions?.all === true
  }
  return false
}

export function checkArticlePermission(admin: AdminWithPermissions): void {
  if (!hasArticlePermission(admin)) {
    throw new Error('شما دسترسی لازم برای مدیریت مقالات را ندارید')
  }
}

export function hasUserPermission(admin: AdminWithPermissions): boolean {
  if (admin.role === 'OWNER') return true
  if (admin.role === 'ADMIN' || admin.role === 'SUPPORTER') {
    return admin.permissions?.users === true || admin.permissions?.all === true
  }
  return false
}

export function checkUserPermission(admin: AdminWithPermissions): void {
  if (!hasUserPermission(admin)) {
    throw new Error('شما دسترسی لازم برای مدیریت کاربران را ندارید')
  }
}