import prisma from "../config/prisma";
import { VipCode, VipCodeUsage } from "@prisma/client";


interface GenerateVipCodesInput {
  title: string;
  count: number;
  maxUses?: number;
  vipDuration: number; // days
  isPublic: boolean;
  targetUserId?: string;
}

export async function generateVipCodes(input: GenerateVipCodesInput) {
  const { title, count, vipDuration, isPublic, targetUserId, maxUses} = input;

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


export async function applyVipCode(userId: string, code: string) {
  const vipCode = await prisma.vipCode.findUnique({
    where: { code },
  });

  if (!vipCode) {
    throw new Error("کد نامعتبر است");
  }

  if (!vipCode.isActive) {
    throw new Error("این کد غیرفعال شده است");
  }

  if (vipCode.usedCount >= vipCode.maxUses) {
    throw new Error("این کد قبلاً استفاده شده است");
  }

  if (!vipCode.isPublic && vipCode.targetUserId && vipCode.targetUserId !== userId) {
    throw new Error("این کد برای شما نیست");
  }

  const result = await prisma.$transaction(async (tx) => {
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + vipCode.vipDuration);

    const usage = await tx.vipCodeUsage.create({
      data: {
        vipCodeId: vipCode.id,
        userId,
        expiresAt: newExpiry,
      },
    });

    await tx.vipCode.update({
      where: { id: vipCode.id },
      data: {
        usedCount: { increment: 1 },
      },
    });

    const currentUser = await tx.user.findUnique({
      where: { id: userId },
      select: { vipExpiresAt: true },
    });

    let finalExpiry = newExpiry;
    if (currentUser?.vipExpiresAt && currentUser.vipExpiresAt > newExpiry) {
      finalExpiry = new Date(currentUser.vipExpiresAt);
      finalExpiry.setDate(finalExpiry.getDate() + vipCode.vipDuration);
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        vipExpiresAt: finalExpiry,
      },
    });

    return { usage, newExpiry: finalExpiry };
  });

  return result;
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

  return prisma.vipCode.update({
    where: { id: codeId },
    data: { isActive: true },
  });
}

export async function deactivateVipCode(codeId: string) {
  const vipCode = await prisma.vipCode.findUnique({
    where: { id: codeId },
  });

  if (!vipCode) {
    throw new Error("کد یافت نشد");
  }

  return prisma.vipCode.update({
    where: { id: codeId },
    data: { isActive: false },
  });
}

export async function getVipCodes(filter?: "active" | "inactive" | "all") {
  let where: any = {};
  if (filter === "active") {
    where.isActive = true;
  } else if (filter === "inactive") {
    where.isActive = false;
  }

  return prisma.vipCode.findMany({
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
}

export async function isUserVip(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { vipExpiresAt: true },
  });

  if (!user || !user.vipExpiresAt) {
    return false;
  }

  return new Date() < user.vipExpiresAt;
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

  await prisma.user.update({
    where: { id: userId },
    data: {
      vipExpiresAt: null,
    },
  });

  return { message: "VIP کاربر با موفقیت لغو شد", userId };
}

function generateUniqueCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "VIP-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}