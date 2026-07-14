import { Request, Response } from 'express'
import * as AdminAuthService from '../services/AdminAuth'
import { Platform } from '@prisma/client'

export const AdminAuthCtrl = {
  setupOwner: async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        status: 'error',
        message: 'این مسیر فقط در محیط توسعه قابل دسترسی است',
      })
    }

    try {
      const { fullName, username, phone, password } = req.body

      if (!fullName || !username || !phone || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'همه فیلدها (fullName, username, phone, password) الزامی هستند',
        })
      }

      if (password.length < 8) {
        return res.status(400).json({
          status: 'error',
          message: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
        })
      }

      const result = await AdminAuthService.setupOwner({
        fullName,
        username,
        phone,
        password,
      })

      res.status(201).json({
        status: 'success',
        message: 'Owner با موفقیت ساخته شد',
        data: result,
      })
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'خطا در ساخت Owner',
      })
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body
      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'نام کاربری و رمز عبور الزامی است',
        })
      }

      const result = await AdminAuthService.loginAdmin(username, password)
      res.status(200).json({ status: 'success', data: result })
    } catch (err: any) {
      res.status(401).json({ status: 'error', message: err.message })
    }
  },

  me: async (req: any, res: Response) => {
    try {
      const adminId = req.admin?.id
      if (!adminId) {
        return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' })
      }

      const profile = await AdminAuthService.getAdminProfile(adminId)
      res.status(200).json({ status: 'success', data: profile })
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message })
    }
  },
}