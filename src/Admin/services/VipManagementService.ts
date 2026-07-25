import prisma from "../../config/prisma";
import { VipCode, VipCodeUsage } from "@prisma/client";
import { toJalali } from "../../utils/dateFormatter";

interface GenerateVipCodesInput {
  title: string;
  count: number;
  maxUses?: number;
  vipDuration: number;
  isPublic: boolean;
  targetUserId?: string;
}

export async function generateVipCodes(input: GenerateVipCodesInput) {
  const { title, count, vipDuration, isPublic, targetUserId, maxUses } = input;

  if (count <= 0 || vipDuration <= 0) {
    throw new Error("تعداد و مدت باید بزرگتر از صفر باشند");
  }

  if (!isPublic && !targetUserId) {
    throw new Error("برای کد اختصاصی، کاربر هدف مشخص شود");
  }

  const codes: string[] = [];
  const createdCodes: VipCode[] = [];

  for (let i = 0; i < count; i++) {
    const code = generateUniqueCode();
    const newCode = await prisma.vipCode.create({
      data: {
        code,
        title,
        maxUses: maxUses || 1,
        vipDuration,
        isPublic,
        targetUserId: isPublic ? null : targetUserId,
      },
    });
    codes.push(code);
    createdCodes.push(newCode);
  }

  return { codes, createdCodes };
}

export async function activateVipCode(codeId: string) {
  const vipCode = await prisma.vipCode.findUnique({
    where: { id: codeId },
  });

  if (!vipCode) {
    throw new Error("کد یافت نشد");
  }

  if (vipCode.usedCount >= vipCode.maxUses) {
    throw new Error("این کد قبلاً به حداکثر تعداد استفاده رسیده است و قابل فعال‌سازی نیست");
  }

  await prisma.vipCode.update({
    where: { id: codeId },
    data: { isActive: true },
  });

  return { isActive: true };
}

export async function deactivateVipCode(codeId: string) {
  const vipCode = await prisma.vipCode.findUnique({
    where: { id: codeId },
  });

  if (!vipCode) {
    throw new Error("کد یافت نشد");
  }

  await prisma.vipCode.update({
    where: { id: codeId },
    data: { isActive: false },
  });

  return { isActive: false };
}

export async function getVipCodes(filter?: "active" | "inactive" | "all") {
  let where: any = {};
  if (filter === "active") {
    where.isActive = true;
  } else if (filter === "inactive") {
    where.isActive = false;
  }

  const rawCodes = await prisma.vipCode.findMany({
    where,
    include: {
      usages: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              lastName: true,
              phone: true,
            },
          },
        },
      },
      targetUser: {
        select: {
          id: true,
          name: true,
          lastName: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return rawCodes.map((code) => {
    const { createdAt, updatedAt, usages, targetUser, ...rest } = code;
    return {
      ...rest,
      createdAt: toJalali(createdAt),
      usages: usages.map((usage) => ({
        userId: usage.user.id,
        fullName: `${usage.user.name || ''} ${usage.user.lastName || ''}`.trim(),
        phone: usage.user.phone,
        usedAt: toJalali(usage.usedAt),
        expiresAt: usage.expiresAt ? toJalali(usage.expiresAt) : null,
        isRevoked: usage.isRevoked,
      })),
      targetUser: targetUser
        ? {
            id: targetUser.id,
            fullName: `${targetUser.name || ''} ${targetUser.lastName || ''}`.trim(),
            phone: targetUser.phone,
          }
        : null,
    };
  });
}

export async function deleteVipCode(codeId: string) {
  const vipCode = await prisma.vipCode.findUnique({
    where: { id: codeId },
    include: { usages: true },
  });

  if (!vipCode) {
    throw new Error("کد یافت نشد");
  }

  await prisma.vipCodeUsage.deleteMany({
    where: { vipCodeId: codeId },
  });

  await prisma.vipCode.delete({
    where: { id: codeId },
  });

  return { message: "کد و تاریخچه استفاده‌های آن با موفقیت حذف شد" };
}

export async function revokeUserVip(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { vipExpiresAt: true },
  });

  if (!user) {
    throw new Error("کاربر یافت نشد");
  }

  if (!user.vipExpiresAt) {
    throw new Error("این کاربر VIP نیست");
  }

  const lastUsage = await prisma.vipCodeUsage.findFirst({
    where: {
      userId,
      isRevoked: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: { usedAt: "desc" },
  });

  if (!lastUsage) {
    throw new Error("استفاده‌ای یافت نشد که قابل لغو باشد");
  }

  await prisma.$transaction([
    prisma.vipCodeUsage.update({
      where: { id: lastUsage.id },
      data: { isRevoked: true },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { vipExpiresAt: null },
    }),
  ]);

  return { message: "VIP کاربر با موفقیت لغو شد", userId };
}

export async function unrevokeUserVip(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { vipExpiresAt: true },
  });

  if (!user) {
    throw new Error("کاربر یافت نشد");
  }

  if (user.vipExpiresAt) {
    throw new Error("این کاربر در حال حاضر VIP است");
  }

  const lastRevokedUsage = await prisma.vipCodeUsage.findFirst({
    where: {
      userId,
      isRevoked: true,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: { usedAt: "desc" },
  });

  if (!lastRevokedUsage) {
    throw new Error("هیچ استفاده‌ای برای بازگرداندن یافت نشد");
  }

  await prisma.$transaction([
    prisma.vipCodeUsage.update({
      where: { id: lastRevokedUsage.id },
      data: { isRevoked: false },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { vipExpiresAt: lastRevokedUsage.expiresAt },
    }),
  ]);

  return { message: "VIP کاربر با موفقیت بازگردانده شد", userId };
}

function generateUniqueCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "VIP-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}