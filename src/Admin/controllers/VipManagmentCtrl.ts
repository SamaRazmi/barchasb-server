import { Request, Response } from 'express';
import * as AdminVipService from '../services/VipManagementService';
import { toJalali } from '../../utils/dateFormatter';

const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return '';
};

interface AuthRequest extends Request {
  admin?: {
    id: string;
    role: string;
  };
}

const AdminVipCtrl = {
  generate: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' });
      if (admin.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه تولید کدهای VIP را دارد' });
      }

      const { title, count, vipDuration, isPublic, targetUserId, maxUses } = req.body;
      if (!title || !count || !vipDuration) {
        return res.status(400).json({ status: 'error', message: 'عنوان، تعداد و مدت الزامی هستند' });
      }
      if (count <= 0 || vipDuration <= 0) {
        return res.status(400).json({ status: 'error', message: 'تعداد و مدت باید بزرگتر از صفر باشند' });
      }
      if (!isPublic && !targetUserId) {
        return res.status(400).json({ status: 'error', message: 'برای کد اختصاصی، کاربر هدف مشخص شود' });
      }

      const result = await AdminVipService.generateVipCodes({ title, count, vipDuration, isPublic, targetUserId, maxUses });

      res.status(201).json({
        status: 'success',
        message: `${result.codes.length} کد با موفقیت تولید شد`,
        data: { codes: result.codes },
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message || 'خطا در تولید کدها' });
    }
  },

  activate: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' });
      if (admin.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه فعال‌سازی کد را دارد' });
      }

      const id = toStr(req.params.id);
      if (!id) return res.status(400).json({ status: 'error', message: 'شناسه کد الزامی است' });

      const result = await AdminVipService.activateVipCode(id);
      res.status(200).json({ status: 'success', message: 'کد با موفقیت فعال شد', data: result });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message || 'خطا در فعال‌سازی کد' });
    }
  },

  deactivate: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' });
      if (admin.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه غیرفعال‌سازی کد را دارد' });
      }

      const id = toStr(req.params.id);
      if (!id) return res.status(400).json({ status: 'error', message: 'شناسه کد الزامی است' });

      const result = await AdminVipService.deactivateVipCode(id);
      res.status(200).json({ status: 'success', message: 'کد با موفقیت غیرفعال شد', data: result });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message || 'خطا در غیرفعال‌سازی کد' });
    }
  },

  list: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' });
      if (admin.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه دیدن لیست کدها را دارد' });
      }

      const { status } = req.query;
      const filter = status === 'all' ? undefined : (status as 'active' | 'inactive' | undefined);
      const codes = await AdminVipService.getVipCodes(filter);

      res.status(200).json({ status: 'success', data: codes });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message || 'خطا در دریافت لیست کدها' });
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' });
      if (admin.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه حذف کد را دارد' });
      }

      const id = toStr(req.params.id);
      if (!id) return res.status(400).json({ status: 'error', message: 'شناسه کد الزامی است' });

      const result = await AdminVipService.deleteVipCode(id);
      res.status(200).json({ status: 'success', message: result.message });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message || 'خطا در حذف کد' });
    }
  },

  revokeUserVip: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' });
      if (admin.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه لغو VIP کاربر را دارد' });
      }

      const userId = toStr(req.params.userId);
      if (!userId) return res.status(400).json({ status: 'error', message: 'شناسه کاربر الزامی است' });

      const result = await AdminVipService.revokeUserVip(userId);
      res.status(200).json({ status: 'success', message: result.message, data: { userId: result.userId } });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message || 'خطا در لغو VIP کاربر' });
    }
  },

  unrevokeUserVip: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: 'error', message: 'احراز هویت نشده' });
      if (admin.role !== 'OWNER') {
        return res.status(403).json({ status: 'error', message: 'فقط OWNER اجازه بازگرداندن VIP کاربر را دارد' });
      }

      const userId = toStr(req.params.userId);
      if (!userId) return res.status(400).json({ status: 'error', message: 'شناسه کاربر الزامی است' });

      const result = await AdminVipService.unrevokeUserVip(userId);
      res.status(200).json({ status: 'success', message: result.message, data: { userId: result.userId } });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message || 'خطا در بازگرداندن VIP کاربر' });
    }
  },
};

export default AdminVipCtrl;