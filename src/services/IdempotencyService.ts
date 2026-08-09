import prisma from "../config/prisma";
import { IdempotencyStatus } from "@prisma/client";

export async function checkAndCreateIdempotency(
  key: string,
  userId: string,
  action: string,
  referenceId?: string
) {
  const existing = await prisma.idempotency.findUnique({
    where: { key },
  });

  if (existing) {
    if (existing.status === IdempotencyStatus.COMPLETED) {
      return {
        success: true,
        status: "DUPLICATE",
        message: "این درخواست قبلاً با موفقیت انجام شده است",
        data: existing.response,
      };
    }

    if (existing.status === IdempotencyStatus.PENDING) {
      const elapsed = Date.now() - existing.createdAt.getTime();
      const TIMEOUT_MS = 30_000;
      if (elapsed > TIMEOUT_MS) {
        await prisma.idempotency.update({
          where: { key },
          data: { status: IdempotencyStatus.FAILED, response: { error: "Timeout" } },
        });
        return {
          success: false,
          status: "EXPIRED",
          message: "زمان پردازش قبلی منقضی شده است، لطفاً دوباره تلاش کنید",
        };
      }
      throw new Error("این درخواست در حال پردازش است، لطفاً منتظر بمانید");
    }

    if (existing.status === IdempotencyStatus.FAILED) {
      await prisma.idempotency.delete({ where: { key } });
    }
  }

  const idempotency = await prisma.idempotency.create({
    data: {
      key,
      userId,
      action,
      referenceId,
      status: IdempotencyStatus.PENDING,
    },
  });

  return {
    success: false,
    idempotency,
    status: "NEW",
  };
}

export async function completeIdempotency(
  key: string,
  response: any,
  status: IdempotencyStatus = IdempotencyStatus.COMPLETED
) {
  await prisma.idempotency.update({
    where: { key },
    data: {
      status,
      response,
    },
  });
}

export async function failIdempotency(key: string, error: string) {
  await prisma.idempotency.update({
    where: { key },
    data: {
      status: IdempotencyStatus.FAILED,
      response: { error },
    },
  });
}