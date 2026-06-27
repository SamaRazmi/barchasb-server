import prisma from "../config/prisma";
import { TransactionType, TransactionStatus, PaymentMethod } from "@prisma/client";


export const createWalletForUser = async (userId: string) => {
  const existingWallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (existingWallet) {
    return existingWallet;
  }

  const wallet = await prisma.wallet.create({
    data: {
      userId,
      balance: 1000000,
      heldBalance: 0,
    },
  });

  await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      amount: 1000000,
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.COMPLETED,
      description: "شارژ اولیه کیف پول",
      paymentMethod: PaymentMethod.Wallet,
      metadata: { reason: "welcome_bonus" },
    },
  });

  return wallet;
};

export const getAvailableBalance = async (userId: string) => {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    select: {
      balance: true,
      heldBalance: true,
    },
  });

  if (!wallet) {
    throw new Error("کیف پول یافت نشد");
  }

  return {
    available: wallet.balance - wallet.heldBalance,
    total: wallet.balance,
    held: wallet.heldBalance,
  };
};

// mock 
export const depositWallet = async (
  userId: string,
  amount: number,
  metadata?: any
) => {
  if (amount <= 0) {
    throw new Error("مبلغ شارژ باید بزرگتر از صفر باشد");
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    throw new Error("کیف پول یافت نشد");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        walletId: wallet.id,
        amount: amount,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
        description: "شارژ کیف پول از طریق درگاه بانکی",
        paymentMethod: PaymentMethod.Bank_card,
        metadata: metadata || { gateway: "mock" },
      },
    });

    return { wallet: updatedWallet, transaction };
  });

  return result;
};

export const holdBalance = async (
  userId: string,
  amount: number,
  description: string,
  referenceId?: string,
  metadata?: any
) => {
  if (amount <= 0) {
    throw new Error("مبلغ فریز باید بزرگتر از صفر باشد");
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    throw new Error("کیف پول یافت نشد");
  }

  const available = wallet.balance - wallet.heldBalance;
  if (available < amount) {
    throw new Error(`موجودی کافی نیست. موجودی قابل استفاده: ${available} تومان`);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          decrement: amount,
        },
        heldBalance: {
          increment: amount,
        },
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        walletId: wallet.id,
        amount: amount,
        type: TransactionType.HOLD,
        status: TransactionStatus.PENDING,
        description: description,
        referenceId: referenceId,
        paymentMethod: PaymentMethod.Wallet,
        metadata: metadata || {},
      },
    });

    return { wallet: updatedWallet, transaction };
  });

  return result;
};

// use in admin approve
export const releaseHold = async (
  transactionId: string,
  metadata?: any
) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { wallet: true },
  });

  if (!transaction) {
    throw new Error("تراکنش یافت نشد");
  }

  if (transaction.type !== TransactionType.HOLD) {
    throw new Error("این تراکنش از نوع HOLD نیست");
  }

  if (transaction.status !== TransactionStatus.PENDING) {
    throw new Error("وضعیت تراکنش باید PENDING باشد");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: transaction.walletId },
      data: {
        heldBalance: {
          decrement: transaction.amount,
        },
      },
    });

    const updatedTransaction = await tx.transaction.update({
      where: { id: transactionId },
      data: {
        status: TransactionStatus.COMPLETED,
        metadata: { ...(transaction.metadata as any), ...metadata, releasedAt: new Date() },
      },
    });

    return updatedTransaction;
  });

  return result;
};

// use it in admin reject
export const refundHold = async (
  transactionId: string,
  reason: string,
  metadata?: any
) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { wallet: true },
  });

  if (!transaction) {
    throw new Error("تراکنش یافت نشد");
  }

  if (transaction.type !== TransactionType.HOLD) {
    throw new Error("این تراکنش از نوع HOLD نیست");
  }

  if (transaction.status !== TransactionStatus.PENDING) {
    throw new Error("وضعیت تراکنش باید PENDING باشد");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: transaction.walletId },
      data: {
        balance: {
          increment: transaction.amount,
        },
        heldBalance: {
          decrement: transaction.amount,
        },
      },
    });

    await tx.transaction.update({
      where: { id: transactionId },
      data: {
        status: TransactionStatus.CANCELED,
        metadata: { ...(transaction.metadata as any), ...metadata, refundReason: reason, refundedAt: new Date() },
      },
    });

    const refundTransaction = await tx.transaction.create({
      data: {
        walletId: transaction.walletId,
        amount: transaction.amount,
        type: TransactionType.REFUND,
        status: TransactionStatus.COMPLETED,
        description: `برگشت وجه - ${reason}`,
        referenceId: transaction.id,
        paymentMethod: PaymentMethod.Wallet,
        metadata: { originalTransaction: transactionId, reason },
      },
    });

    return refundTransaction;
  });

  return result;
};