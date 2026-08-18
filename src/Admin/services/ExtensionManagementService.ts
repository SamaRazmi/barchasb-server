import prisma from "../../config/prisma";
import { toJalali } from "../../utils/dateFormatter";

// test section
export const getAllCategories = async () => {
  return await prisma.testCategory.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getTestTypesWithStats = async (categoryId: string) => {
  const types = await prisma.testType.findMany({
    where: { categoryId },
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (types.length === 0) {
    return [];
  }

  const results = await Promise.all(
    types.map(async (type) => {
      const [totalSessions, completedSessions] = await Promise.all([
        prisma.testSession.count({ where: { typeId: type.id } }),
        prisma.testSession.count({ where: { typeId: type.id, status: "completed" } }),
      ]);

      const blueprint = type.blueprint as any;
      const totalQuestions = blueprint?.totalQuestions || 0;
      const timeLimit = blueprint?.timeLimit || null;

      return {
        id: type.id,
        name: type.name,
        description: type.description,
        tags: type.tags,
        category: type.category?.name || "بدون دسته‌بندی",
        totalQuestions,
        timeLimit,
        totalSessions,
        completedSessions,
      };
    })
  );


  return results;
};

export const getTestSessionsByType = async (typeId: string) => {
  const sessions = await prisma.testSession.findMany({
    where: { typeId },
    select: {
      id: true,
      userId: true,
      status: true,
      startedAt: true,
      finishedAt: true,
      quickResult: true,
      score: true,
      user: {
        select: {
          id: true,
          name: true,
          lastName: true,
          phone: true,
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });

  return sessions.map((session) => ({
    sessionId: session.id,
    user: {
      id: session.user.id,
      fullName: `${session.user.name || ''} ${session.user.lastName || ''}`.trim(),
      phone: session.user.phone,
    },
    status: session.status,
    startedAt: toJalali(session.startedAt),
    finishedAt: session.finishedAt ? toJalali(session.finishedAt) : null,
    result: session.status === "completed"
      ? (session.quickResult || "مشاهده جزئیات")
      : "در حال انجام",
    score: session.score?.toFixed(1),
  }));
};

export const getTestSessionDetailById = async (sessionId: string) => {
  const session = await prisma.testSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      userId: true,
      status: true,
      typeId: true,
      questions: true,
      score: true,
      assignedLevel: true,
      levelResults: true,
      startedAt: true,
      finishedAt: true,
      quickResult: true,
      detailedResult: true,
      testType: {
        select: {
          id: true,
          name: true,
          scoringMethod: true,
          blueprint: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          lastName: true,
          phone: true,
          email: true,
        },
      },
    },
  });

  if (!session) {
    throw new Error("جلسه تست یافت نشد");
  }

  const testType = (session as any).testType;
  const method = testType?.scoringMethod;

  const result: any = {
    baseInfo: {
      testName: testType?.name || "نامشخص",
      category: testType?.category?.name || "بدون دسته‌بندی",
      score: session.score?.toFixed(1) || "۰",
      date: toJalali(session.finishedAt),
      startedAt: toJalali(session.startedAt),
      user: {
        fullName: `${session.user?.name || ''} ${session.user?.lastName || ''}`.trim(),
        phone: session.user?.phone || '',
        email: session.user?.email || '',
      },
      stats: {
        total: 0,
        correct: 0,
        wrong: 0,
        unanswered: 0,
      },
    },
    analysis: session.detailedResult || session.levelResults || {},
  };

  if (session.detailedResult) {
    const detailed = session.detailedResult as any;
    if (detailed.baseInfo?.stats) {
      result.baseInfo.stats = detailed.baseInfo.stats;
    }
  }

  if (method === "weighted_level") {
    result.assignedLevel = session.assignedLevel;
  }

  return result;
};

// resume section 
export const getUsersWithResumes = async () => {
  const resumes = await prisma.resume.findMany({
    select: {
      id: true,
      userId: true,
      updateCount: true,
      updatedAt: true,
      fileUrl: true,
      user: {
        select: {
          id: true,
          name: true,
          lastName: true,
          phone: true,
          email: true,
          province: true,
          city: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const userMap: Record<
    string,
    {
      totalResumes: number;
      lastUserUpdate: Date;
      resumes: Array<{
        resumeId: string;
        updateCount: number;
        updatedAt: Date;
        fileUrl: string | null;
      }>;
      user: {
        name: string;
        lastName: string;
        phone: string;
        email: string;
        province: string;
        city: string;
      };
    }
  > = {};

  for (const resume of resumes) {
    const userId = resume.userId;
    if (!userMap[userId]) {
      userMap[userId] = {
        totalResumes: 0,
        lastUserUpdate: resume.updatedAt,
        resumes: [],
        user: {
          name: resume.user?.name || "",
          lastName: resume.user?.lastName || "",
          phone: resume.user?.phone || "",
          email: resume.user?.email || "",
          province: resume.user?.province || "",
          city: resume.user?.city || "",
        },
      };
    }
    userMap[userId].totalResumes += 1;
    if (resume.updatedAt > userMap[userId].lastUserUpdate) {
      userMap[userId].lastUserUpdate = resume.updatedAt;
    }
    userMap[userId].resumes.push({
      resumeId: resume.id,
      updateCount: resume.updateCount,
      updatedAt: resume.updatedAt,
      fileUrl: resume.fileUrl,
    });
  }

  const result = Object.keys(userMap).map((userId) => ({
    userId,
    totalResumes: userMap[userId].totalResumes,
    lastUserUpdate: toJalali(userMap[userId].lastUserUpdate),
    resumes: userMap[userId].resumes.map((r) => ({
      resumeId: r.resumeId,
      updateCount: r.updateCount,
      updatedAt: toJalali(r.updatedAt),
      fileUrl: r.fileUrl,
    })),
    userInfo: {
      fullName: `${userMap[userId].user.name} ${userMap[userId].user.lastName}`.trim(),
      phone: userMap[userId].user.phone,
      email: userMap[userId].user.email,
      province: userMap[userId].user.province,
      city: userMap[userId].user.city,
    },
  }));

  result.sort(
    (a, b) =>
      new Date(b.lastUserUpdate).getTime() -
      new Date(a.lastUserUpdate).getTime(),
  );

  return {
    success: true,
    count: result.length,
    data: result,
  };
};

// converter section 
const toolNameMap: Record<string, string> = {
  "convert-image": "تبدیل و فشرده‌سازی تصویر",
  "merge-pdf": "ادغام PDF",
  "compress-pdf": "فشرده‌سازی PDF",
  "extract-pages": "استخراج صفحات PDF",
  "images-to-pdf": "تبدیل تصاویر به PDF",
};
const allTools = Object.keys(toolNameMap);

export const getUsersToolUsage = async () => {
  const groupData = await prisma.toolUsageLog.groupBy({
    by: ["userId", "toolName"],
    _count: { toolName: true },
  });

  const userMap: Record<string, Record<string, number>> = {};
  for (const item of groupData) {
    const userId = item.userId;
    const toolName = item.toolName;
    const count = item._count.toolName;
    if (!userMap[userId]) userMap[userId] = {};
    userMap[userId][toolName] = count;
  }

  const result = Object.keys(userMap).map((userId) => {
    const usage = allTools.map((tool) => ({
      toolName: tool,
      toolNameFa: toolNameMap[tool],
      count: userMap[userId][tool] || 0,
    }));
    return { userId, usage };
  });

  return result;
};

export const getToolPopularity = async () => {
  const totalCounts = await prisma.toolUsageLog.groupBy({
    by: ["toolName"],
    _count: { toolName: true },
  });

  const totalAll = totalCounts.reduce((sum, item) => sum + item._count.toolName, 0);

  const popularity = allTools.map((tool) => {
    const found = totalCounts.find((item) => item.toolName === tool);
    const count = found ? found._count.toolName : 0;
    const percent = totalAll === 0 ? 0 : parseFloat(((count / totalAll) * 100).toFixed(2));
    return {
      toolName: tool,
      toolNameFa: toolNameMap[tool],
      count,
      percent,
    };
  });
  popularity.sort((a, b) => b.count - a.count);

  return {
    totalUsage: totalAll,
    data: popularity,
  };
};

export const getToolPerformance = async () => {
  const allLogs = await prisma.toolUsageLog.findMany({
    select: {
      toolName: true,
      status: true,
      durationMs: true,
      metadata: true,
    },
  });

  const performanceMap: Record<
    string,
    {
      totalInputSize: number;
      totalOutputSize: number;
      totalDurationMs: number;
      successCount: number;
      failedCount: number;
    }
  > = {};

  for (const log of allLogs) {
    const tool = log.toolName;
    if (!performanceMap[tool]) {
      performanceMap[tool] = {
        totalInputSize: 0,
        totalOutputSize: 0,
        totalDurationMs: 0,
        successCount: 0,
        failedCount: 0,
      };
    }
    const meta = log.metadata as any;
    performanceMap[tool].totalInputSize += meta?.inputSize || 0;
    performanceMap[tool].totalOutputSize += meta?.outputSize || 0;
    performanceMap[tool].totalDurationMs += log.durationMs || 0;
    if (log.status === "success") {
      performanceMap[tool].successCount++;
    } else {
      performanceMap[tool].failedCount++;
    }
  }

  const result = allTools.map((tool) => {
    const found = performanceMap[tool];
    if (found) {
      const totalCalls = found.successCount + found.failedCount;
      const successRate =
        totalCalls === 0
          ? 0
          : parseFloat(((found.successCount / totalCalls) * 100).toFixed(2));
      return {
        toolName: tool,
        toolNameFa: toolNameMap[tool],
        totalInputSize: found.totalInputSize,
        totalOutputSize: found.totalOutputSize,
        totalDurationMs: found.totalDurationMs,
        successCount: found.successCount,
        failedCount: found.failedCount,
        totalCalls,
        successRate,
      };
    } else {
      return {
        toolName: tool,
        toolNameFa: toolNameMap[tool],
        totalInputSize: 0,
        totalOutputSize: 0,
        totalDurationMs: 0,
        successCount: 0,
        failedCount: 0,
        totalCalls: 0,
        successRate: 0,
      };
    }
  });
  result.sort((a, b) => b.totalCalls - a.totalCalls);

  return result;
};