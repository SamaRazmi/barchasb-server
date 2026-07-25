import { Request, Response } from 'express'
import * as AdminPricingService from '../services/PricingManagementService'
import { checkCostPermission } from '../utils/permissionCheck'

const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && value.length > 0) return value[0]
  return ''
}

interface AuthRequest extends Request {
  admin?: {
    id: string
    role: string
    permissions?: any
  }
}

const AdminPricingCtrl = {
  getAll: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin
      if (!admin) {
        return res.status(401).json({
          status: 'error',
          message: 'احراز هویت نشده',
        })
      }

      checkCostPermission({
        id: admin.id,
        role: admin.role as any,
        permissions: admin.permissions,
      })

      const pricing = await AdminPricingService.getAllPricing()

      const pricingWithoutUpdatedAt = pricing.map((item: any) => {
        const { updatedAt, ...rest } = item
        return rest
      })

      res.status(200).json({
        status: 'success',
        data: pricingWithoutUpdatedAt,
      })
    } catch (error: any) {
      console.error(error)
      const status = error.message?.includes('دسترسی') ? 403 : 500
      res.status(status).json({
        status: 'error',
        message: error.message || 'خطا در دریافت قیمت‌ها',
      })
    }
  },

  update: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin
      if (!admin) {
        return res.status(401).json({
          status: 'error',
          message: 'احراز هویت نشده',
        })
      }

      checkCostPermission({
        id: admin.id,
        role: admin.role as any,
        permissions: admin.permissions,
      })

      const key = toStr(req.params.key)
      if (!key) {
        return res.status(400).json({
          status: 'error',
          message: 'کلید قیمت معتبر نیست',
        })
      }

      const { value } = req.body
      if (value === undefined || value === null || value < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'مقدار قیمت معتبر نیست (باید عددی مثبت باشد)',
        })
      }

      const updated = await AdminPricingService.updatePricing(key, value)

      res.status(200).json({
        status: 'success',
        message: 'قیمت با موفقیت به‌روزرسانی شد',
        data: updated,
      })
    } catch (error: any) {
      console.error(error)
      const status = error.message?.includes('دسترسی') ? 403 : 500
      res.status(status).json({
        status: 'error',
        message: error.message || 'خطا در به‌روزرسانی قیمت',
      })
    }
  },
}


export default AdminPricingCtrl