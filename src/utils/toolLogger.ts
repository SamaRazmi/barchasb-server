import prisma from "../config/prisma";

interface ToolLogData {
  userId: string;
  toolName: string;
  status: string;
  errorMessage?: string | null;
  metadata?: {
    inputSize?: number | null;
    outputSize?: number | null;
    inputFormat?: string | null;
    outputFormat?: string | null;
  };
  durationMs?: number | null;
  ip?: string | null;
  userAgent?: string | null;
}

export async function logToolUsage({
  userId,
  toolName,
  status,
  errorMessage,
  metadata,
  durationMs,
  ip,
  userAgent,
}: ToolLogData): Promise<void> {
  try {
    await prisma.toolUsageLog.create({
      data: {
        userId,
        toolName,
        status,
        errorMessage: errorMessage || null,
        metadata: {
          inputSize: metadata?.inputSize || null,
          outputSize: metadata?.outputSize || null,
          inputFormat: metadata?.inputFormat || null,
          outputFormat: metadata?.outputFormat || null,
        },
        durationMs: durationMs || null,
        ip: ip || null,
        userAgent: userAgent || null,
      },
    });
  } catch (logError) {
    console.error("خطا در ذخیره لاگ:", logError);
  }
}
