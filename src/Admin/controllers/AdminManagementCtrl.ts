import { Request, Response } from 'express'
import * as AdminManagementService from '../services/AdminManagementService'
import { AdminRole, AdminStatus, Platform } from '@prisma/client'

interface AuthRequest extends Request {
  admin?: { id: string; role: string }
}

const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

const AdminManagementCtrl = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const ownerId = req.admin?.id
      if (!ownerId) {
        return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' })
      }
      if (req.admin?.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه ساخت ادمین دارد' })
      }

      const { fullName, phone, password, role, platforms, permissions } = req.body

      if (!fullName || !phone || !password || !role || !platforms || !permissions) {
        return res.status(400).json({ status: 'error', message: 'همه فیلدها الزامی هستند' })
      }

      if (!Object.values(AdminRole).includes(role as AdminRole)) {
        return res.status(400).json({ status: 'error', message: 'نقش نامعتبر است' })
      }
      if (!Array.isArray(platforms) || platforms.some(p => !Object.values(Platform).includes(p))) {
        return res.status(400).json({ status: 'error', message: 'پلتفرم نامعتبر است' })
      }
      await AdminManagementService.createAdmin({
        fullName,
        phone,
        password,
        role,
        platforms,
        permissions,
      })

      res.status(201).json({ status: 'success', message: 'ادمین با موفقیت ساخته شد'})
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message })
    }
  },

  list: async (req: AuthRequest, res: Response) => {
    try {
      const ownerId = req.admin?.id
      if (!ownerId) {
        return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' })
      }
      if (req.admin?.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه دیدن لیست ادمین‌ها را دارد' })
      }

      const platformFilter = req.query.platform as Platform | undefined
      const result = await AdminManagementService.getAdmins({ ownerId, platformFilter })

      res.status(200).json({ status: 'success', data: result })
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message })
    }
  },

  getOne: async (req: AuthRequest, res: Response) => {
    try {
      if (req.admin?.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه دیدن جزئیات ادمین را دارد' })
      }

      const id = toStr(req.params.id) 
      const result = await AdminManagementService.getAdminById(id)

      res.status(200).json({ status: 'success', data: result })
    } catch (error: any) {
      res.status(404).json({ status: 'error', message: error.message })
    }
  },

  update: async (req: AuthRequest, res: Response) => {
    try {
      if (req.admin?.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه ویرایش ادمین را دارد' })
      }

      const id = toStr(req.params.id) 
      const { fullName, phone, password, role, status, platforms, permissions } = req.body

      if (role && !Object.values(AdminRole).includes(role as AdminRole)) {
        return res.status(400).json({ status: 'error', message: 'نقش نامعتبر است' })
      }
      if (status && !Object.values(AdminStatus).includes(status as AdminStatus)) {
        return res.status(400).json({ status: 'error', message: 'وضعیت نامعتبر است' })
      }
      if (platforms && (!Array.isArray(platforms) || platforms.some(p => !Object.values(Platform).includes(p)))) {
        return res.status(400).json({ status: 'error', message: 'پلتفرم نامعتبر است' })
      }

      const result = await AdminManagementService.updateAdmin({
        adminId: id,
        fullName,
        phone,
        password,
        role: role as AdminRole,
        status: status as AdminStatus,
        platforms: platforms as Platform[],
        permissions,
      })

      res.status(200).json({ status: 'success', data: result })
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message })
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      if (req.admin?.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه حذف ادمین را دارد' })
      }

      const id = toStr(req.params.id)  
      const result = await AdminManagementService.deleteAdmin(id)

      res.status(200).json({ status: 'success', message: result.message })
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message })
    }
  },
}

export default AdminManagementCtrl