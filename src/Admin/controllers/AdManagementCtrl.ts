import { Request, Response } from 'express'
import * as AdManagementService from '../services/AdManagementService'
import { AdStatus, AdType } from '@prisma/client'
import { checkAdPermission } from '../utils/permissionCheck'
import { AdminRole } from '@prisma/client'

interface AuthRequest extends Request {
  admin?: {
    id: string
    role: AdminRole  
    permissions?: any
  }
}

const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && value.length > 0) return value[0]
  return ''
}

const AdManagementCtrl = {
  list: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin
      if (!admin) {
        return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' })
      }
      checkAdPermission(admin)

      const status = req.query.status as AdStatus | 'pending' | undefined
      const type = req.query.type as AdType | undefined
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10

      const result = await AdManagementService.getAdsList({
        status,
        type,
        page,
        limit,
      })

      res.status(200).json({ status: 'success', data: result })
    } catch (error: any) {
      console.error('Error in list ads:', error)
      res.status(500).json({ status: 'error', message: error.message })
    }
  },

  details: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin
      if (!admin) {
        return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' })
      }
      checkAdPermission(admin)

      const id = toStr(req.params.id)
      const type = req.query.type as AdType

      if (!id || !type || !Object.values(AdType).includes(type)) {
        return res.status(400).json({
          status: 'error',
          message: 'شناسه و نوع آگهی معتبر نیست',
        })
      }

      const result = await AdManagementService.getAdDetails(id, type)

      res.status(200).json({ status: 'success', data: result })
    } catch (error: any) {
      console.error('Error in ad details:', error)
      res.status(404).json({ status: 'error', message: error.message })
    }
  },

  approve: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin
      if (!admin) {
        return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' })
      }
      checkAdPermission(admin)

      const id = toStr(req.params.id)
      const type = req.query.type as AdType

      if (!id || !type || !Object.values(AdType).includes(type)) {
        return res.status(400).json({
          status: 'error',
          message: 'شناسه و نوع آگهی معتبر نیست',
        })
      }

      const result = await AdManagementService.approveAd(id, type, admin.id)

      res.status(200).json({ status: 'success', data: result })
    } catch (error: any) {
      console.error('Error approving ad:', error)
      res.status(400).json({ status: 'error', message: error.message })
    }
  },

  reject: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin
      if (!admin) {
        return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' })
      }
      checkAdPermission(admin)

      const id = toStr(req.params.id)
      const type = req.query.type as AdType
      const { reason } = req.body

      if (!id || !type || !Object.values(AdType).includes(type)) {
        return res.status(400).json({
          status: 'error',
          message: 'شناسه و نوع آگهی معتبر نیست',
        })
      }

      if (!reason || reason.trim().length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'دلیل رد آگهی الزامی است',
        })
      }

      const result = await AdManagementService.rejectAd(id, type, reason, admin.id)

      res.status(200).json({ status: 'success', data: result })
    } catch (error: any) {
      console.error('Error rejecting ad:', error)
      res.status(400).json({ status: 'error', message: error.message })
    }
  },
}

export default AdManagementCtrl