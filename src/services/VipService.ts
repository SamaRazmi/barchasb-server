import prisma from "../config/prisma";

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
    throw new Error("این کد قبلاً به حداکثر تعداد استفاده رسیده است");
  }

  if (!vipCode.isPublic && vipCode.targetUserId && vipCode.targetUserId !== userId) {
    throw new Error("این کد برای شما نیست");
  }

  const existingUsage = await prisma.vipCodeUsage.findFirst({
    where: {
      vipCodeId: vipCode.id,
      userId: userId,
    },
  });

  if (existingUsage) {
    throw new Error("شما قبلاً از این کد استفاده کرده‌اید");
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