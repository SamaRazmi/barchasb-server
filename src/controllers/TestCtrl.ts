import { Request, Response } from "express";
import prisma from "../config/prisma";
import { pickQuestions } from "../utils/testHelper";
import ScoringLogic from "../utils/scoringLogic";
import {
  generateQuickResult,
  generateDetailData,
} from "../utils/tesrResultAnalyzer";
import * as dateFormatter from "../utils/dateFormatter";

// ====== تابع کمکی برای تبدیل params به string ======
const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

// ====== تابع کمکی برای CEFR Level ======
const getCEFRLevel = (score: number): string => {
  if (score >= 91) return "C2 (تسلط کامل)";
  if (score >= 76) return "C1 (پیشرفته)";
  if (score >= 56) return "B2 (بالاتر از متوسط)";
  if (score >= 36) return "B1 (متوسط)";
  if (score >= 16) return "A2 (پیش متوسط)";
  return "A1 (مبتدی)";
};

// =================== START TEST ===================
export const startTest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "احراز هویت نشده" });

    const { typeId } = req.body;
    if (!typeId) {
      return res.status(400).json({ message: "شناسه نوع تست الزامی است" });
    }

    const testType = await prisma.testType.findUnique({
      where: { id: typeId },
      include: { category: true },
    });
    if (!testType) {
      return res.status(404).json({ message: "عنوان تست یافت نشد." });
    }

    const allQuestions = await prisma.question.findMany({
      where: { typeId },
    });

    const selectedQuestions = pickQuestions(allQuestions, testType.blueprint);

    const sessionQuestions = selectedQuestions.map((q: any) => ({
      questionId: q.id,
      userAnswer: null,
      isCorrect: false,
      subject: q.subject,
      level: q.level,
      questionText: q.questionText,
    }));

    const newSession = await prisma.testSession.create({
      data: {
        userId,
        typeId,
        questions: sessionQuestions,
        status: "in_progress",
        startedAt: new Date(),
      },
    });

    const questionsForFrontend = selectedQuestions.map((q: any) => {
      const { options, ...rest } = q;
      const safeOptions = options.map(({ isCorrect, ...opt }: any) => opt);
      return { ...rest, options: safeOptions };
    });

    res.status(201).json({
      sessionId: newSession.id,
      timeLimitM: (testType.blueprint as any)?.timeLimit || null,
      questions: questionsForFrontend,
      jalaliStartedAt: dateFormatter.toJalali(newSession.startedAt),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =================== SUBMIT TEST ===================
export const submitTest = async (req: Request, res: Response) => {
  try {
    const { sessionId, answers } = req.body;
    const userIdFromToken = (req as any).user?.id;

    if (!userIdFromToken) {
      return res.status(401).json({ message: "احراز هویت نشده" });
    }

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
        type: {
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
      },
    });

    if (!session) {
      return res.status(404).json({ message: "جلسه یافت نشد." });
    }

    if (session.userId !== userIdFromToken) {
      return res.status(403).json({
        message:
          "شما مجاز به ثبت این تست نیستید. این جلسه متعلق به کاربر دیگری است.",
      });
    }

    if (session.status === "completed") {
      return res.status(403).json({ message: "این تست قبلا ثبت شده‌است." });
    }

    // Cast to any to avoid TypeScript issues with nested select
    const testType = (session as any).type;
    const categoryName = testType?.category?.name || "";
    const method = testType?.scoringMethod;
    const testName = testType?.name || "";
    let calculatedData: any;

    if (method === "likert_sum" && testName.includes("گاردنر")) {
      calculatedData = ScoringLogic.processGardner(session, answers);
    } else if (method === "likert_sum" && testName.includes("هالند")) {
      calculatedData = ScoringLogic.processHolland(session, answers);
    } else if (method === "mbti_polar") {
      calculatedData = ScoringLogic.processMBTI(session, answers);
    } else if (method === "trait_accumulation") {
      if (testName.toUpperCase().includes("NEO")) {
        calculatedData = ScoringLogic.processNEO(session, answers);
      } else {
        calculatedData = ScoringLogic.processPsych(session, answers);
      }
    } else if (method === "weighted_level") {
      if (categoryName === "زبان‌های خارجه") {
        calculatedData = ScoringLogic.processLanguage(
          session,
          answers,
          testType,
        );
        (session as any).assignedLevel = getCEFRLevel(
          calculatedData.totalScore,
        );
      } else {
        calculatedData = ScoringLogic.processTechnical(
          session,
          answers,
          testType,
        );
        (session as any).assignedLevel =
          `${calculatedData.summary.levelFa} (${calculatedData.summary.levelEn})`;
      }
    }

    const questionsToSave = calculatedData.questions.map((q: any) => {
      const originalQuestion = (session.questions as any[]).find(
        (sq: any) =>
          sq.questionId.id?.toString() ===
          (q.questionId._id || q.questionId).toString(),
      );

      return {
        questionId: q.questionId._id || q.questionId,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect,
        pointsEarned: q.pointsEarned,
        dimension: q.dimension,
        subject:
          q.subject ||
          q.questionId?.subject ||
          originalQuestion?.subject ||
          "General",
        level:
          q.level ||
          q.questionId?.level ||
          originalQuestion?.level ||
          "Unknown",
      };
    });

    const quickResult = generateQuickResult(
      session,
      testType,
      calculatedData.levelResults,
    );

    const { detailData } = generateDetailData(
      session,
      testType,
      calculatedData.levelResults,
    );

    const updatedSession = await prisma.testSession.update({
      where: { id: sessionId },
      data: {
        score: calculatedData.totalScore,
        levelResults: calculatedData.levelResults,
        status: "completed",
        finishedAt: new Date(),
        quickResult: quickResult,
        detailedResult: detailData,
        assignedLevel: (session as any).assignedLevel,
        questions: questionsToSave,
      },
    });

    if (method === "weighted_level") {
      return res.status(200).json({
        message: "تست با موفقیت ثبت شد.",
        results: {
          weightedScore: updatedSession.score?.toFixed(2),
          assignedLevel: updatedSession.assignedLevel,
          summary: calculatedData.summary,
          detailedResult: updatedSession.detailedResult,
          levelBreakdown: updatedSession.levelResults,
        },
      });
    }

    res.status(200).json({
      message: "تست با موفقیت ثبت شد.",
      totalScore: updatedSession.score,
      results: updatedSession.levelResults,
    });
  } catch (error: any) {
    const statusCode = error.message.includes("کافی نیست") ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

// =================== GET CATEGORIES ===================
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.testCategory.findMany({
      where: { isActive: true },
    });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =================== GET TYPES BY CATEGORY ===================
export const getTypesByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = toStr(req.params.categoryId);
    if (!categoryId) {
      return res.status(400).json({ error: "شناسه دسته‌بندی نامعتبر است" });
    }

    const types = await prisma.testType.findMany({
      where: { categoryId },
      select: {
        id: true,
        name: true,
        tags: true,
        description: true,
        scoringMethod: true,
        dimensions: true,
        createdAt: true,
        updatedAt: true,
        blueprint: true,
      },
    });

    const sanitizedTypes = types.map((type) => ({
      ...type,
      blueprint: {
        ...(type.blueprint as any),
        structure: undefined,
        levelWeights: undefined,
      },
    }));

    res.json(sanitizedTypes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =================== RESUME SESSION ===================
export const resumeSession = async (req: Request, res: Response) => {
  try {
    const sessionId = toStr(req.params.sessionId);
    if (!sessionId) {
      return res.status(400).json({ message: "شناسه جلسه نامعتبر است" });
    }

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
      },
    });

    if (!session) {
      return res.status(404).json({ message: "جلسه یافت نشد." });
    }

    const jalaliDates = {
      startedAt: dateFormatter.toJalali(session.startedAt),
      finishedAt: session.finishedAt
        ? dateFormatter.toJalali(session.finishedAt)
        : null,
    };

    if (session.status === "completed") {
      return res.json({
        status: "completed",
        score: session.score,
        levelResults: session.levelResults,
        jalaliDates,
        message: "این آزمون به پایان رسیده است.",
      });
    }

    const questionsForFrontend = (session.questions as any[]).map((sq: any) => {
      const q = sq.questionId;
      const safeOptions = q.options.map(({ isCorrect, ...opt }: any) => opt);
      return { ...q, options: safeOptions };
    });

    res.json({
      status: "in_progress",
      session: {
        ...session,
        jalaliDates,
      },
      questions: questionsForFrontend,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =================== ADMIN: USER TESTS SUMMARY ===================
export const getUserTestsSummary = async (req: Request, res: Response) => {
  try {
    const userId = toStr(req.params.userId);
    if (!userId) {
      return res.status(400).json({ message: "شناسه کاربر نامعتبر است" });
    }

    const sessions = await prisma.testSession.findMany({
      where: { userId, status: "completed" },
      select: {
        id: true,
        score: true,
        quickResult: true,
        finishedAt: true,
        type: {
          select: {
            name: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { finishedAt: "desc" },
    });

    const summary = sessions.map((s) => ({
      sessionId: s.id,
      testName: (s as any).type?.name,
      category: (s as any).type?.category?.name,
      date: dateFormatter.toJalali(s.finishedAt),
      result: s.quickResult || "مشاهده جزئیات",
      score: s.score?.toFixed(1),
    }));

    res.status(200).json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =================== ADMIN: TEST RESULT DETAIL ===================
export const getTestResultDetail = async (req: Request, res: Response) => {
  try {
    const sessionId = toStr(req.params.sessionId);
    if (!sessionId) {
      return res.status(400).json({ message: "شناسه جلسه نامعتبر است" });
    }

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
        type: {
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
      },
    });

    if (!session) {
      return res.status(404).json({ message: "جلسه یافت نشد." });
    }

    const jalaliDates = {
      startedAt: dateFormatter.toJalali(session.startedAt),
      finishedAt: dateFormatter.toJalali(session.finishedAt),
    };

    const testType = (session as any).type;
    const method = testType?.scoringMethod;

    if (session.detailedResult) {
      const detailed = session.detailedResult as any;
      if (detailed.baseInfo) {
        detailed.baseInfo.jalaliDate = dateFormatter.toJalali(
          session.finishedAt,
        );
      }
      if (method === "weighted_level") {
        return res.status(200).json({
          message: "نتیجه تست",
          results: {
            weightedScore: session.score?.toFixed(2),
            assignedLevel: session.assignedLevel,
            detailedResult: detailed,
            levelBreakdown: session.levelResults,
            jalaliDates,
          },
        });
      } else {
        return res.status(200).json({
          message: "نتیجه تست",
          totalScore: session.score,
          results: session.levelResults,
          detailedResult: detailed,
          jalaliDates,
        });
      }
    }

    const levelResults = session.levelResults || {};
    const { detailData } = generateDetailData(session, testType, levelResults);

    await prisma.testSession.update({
      where: { id: sessionId },
      data: { detailedResult: detailData },
    });

    if (method === "weighted_level") {
      return res.status(200).json({
        message: "نتیجه تست",
        results: {
          weightedScore: session.score?.toFixed(2),
          assignedLevel: session.assignedLevel,
          summary: (session.levelResults as any)?.summary || {},
          detailedResult: detailData,
          levelBreakdown: session.levelResults,
        },
      });
    } else {
      return res.status(200).json({
        message: "نتیجه تست",
        totalScore: session.score,
        results: session.levelResults,
        detailedResult: detailData,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =================== ADMIN: GET ALL CATEGORIES ===================
export const getCategoriesAdmin = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.testCategory.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: "خطا در سرور", error: error.message });
  }
};

// =================== ADMIN: GET ALL TEST TYPES ===================
export const getTypes = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    const filter: any = {};
    if (categoryId && typeof categoryId === "string") {
      filter.categoryId = categoryId;
    }

    const types = await prisma.testType.findMany({
      where: filter,
      select: {
        id: true,
        name: true,
        tags: true,
        description: true,
        scoringMethod: true,
        dimensions: true,
        createdAt: true,
        updatedAt: true,
        blueprint: true,
        category: {
          select: {
            name: true,
            icon: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const sanitizedTypes = types.map((type) => ({
      ...type,
      blueprint: {
        ...(type.blueprint as any),
        structure: undefined,
        levelWeights: undefined,
      },
    }));

    res.status(200).json(sanitizedTypes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =================== ADMIN: USERS WITH SESSIONS ===================
export const getUsersWithSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.testSession.findMany({
      select: {
        userId: true,
      },
      distinct: ["userId"],
    });

    const uniqueUserIds = sessions.map((s) => s.userId);
    res.status(200).json(uniqueUserIds);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =================== ADMIN: ALL SESSIONS INFO ===================
export const getAllTestSessionsInfo = async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.testSession.findMany({
      select: {
        id: true,
        userId: true,
        status: true,
        startedAt: true,
        type: {
          select: {
            name: true,
            tags: true,
          },
        },
      },
      orderBy: { startedAt: "desc" },
    });

    const formattedSessions = sessions.map((session) => ({
      sessionId: session.id,
      userId: session.userId,
      status: session.status,
      startedAt: dateFormatter.toJalali(session.startedAt),
      testName: (session as any).type?.name || "نامشخص",
      testTags: (session as any).type?.tags || [],
    }));

    res.status(200).json(formattedSessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =================== USER: MY TESTS SUMMARY ===================
export const getMyTestsSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "احراز هویت نشده" });
    }

    const sessions = await prisma.testSession.findMany({
      where: { userId, status: "completed" },
      select: {
        id: true,
        score: true,
        quickResult: true,
        finishedAt: true,
        type: {
          select: {
            name: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { finishedAt: "desc" },
    });

    const summary = sessions.map((s) => ({
      sessionId: s.id,
      testName: (s as any).type?.name || "نامشخص",
      category: (s as any).type?.category?.name || "بدون دسته‌بندی",
      date: dateFormatter.toJalali(s.finishedAt),
      result: s.quickResult || "مشاهده جزئیات",
      score: s.score?.toFixed(1),
    }));

    res.status(200).json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =================== USER: MY TEST DETAIL ===================
export const getMyTestDetail = async (req: Request, res: Response) => {
  try {
    const sessionId = toStr(req.params.sessionId);
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "احراز هویت نشده" });
    }

    if (!sessionId) {
      return res.status(400).json({ message: "شناسه جلسه نامعتبر است" });
    }

    const session = await prisma.testSession.findFirst({
      where: { id: sessionId, userId },
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
        type: {
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
      },
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "نتیجه تست یافت نشد یا دسترسی غیرمجاز است." });
    }

    if (session.status !== "completed") {
      return res.status(400).json({ message: "این تست هنوز تکمیل نشده است." });
    }

    const jalaliDates = {
      startedAt: dateFormatter.toJalali(session.startedAt),
      finishedAt: dateFormatter.toJalali(session.finishedAt),
    };

    const testType = (session as any).type;
    const method = testType?.scoringMethod;

    if (session.detailedResult) {
      const detailed = session.detailedResult as any;
      if (detailed.baseInfo) {
        detailed.baseInfo.jalaliDate = dateFormatter.toJalali(
          session.finishedAt,
        );
      }
      if (method === "weighted_level") {
        const summary =
          (session.levelResults as any)?.summary ||
          (detailed.baseInfo?.stats
            ? {
                totalQuestions: detailed.baseInfo.stats.total,
                correctAnswers: detailed.baseInfo.stats.correct,
                wrongAnswers: detailed.baseInfo.stats.wrong,
                unanswered: detailed.baseInfo.stats.unanswered,
                rawPoints: (((session.score ?? 0) / 100) * 20).toFixed(2),
                maxPoints: 20,
              }
            : {});

        return res.status(200).json({
          message: "نتیجه تست",
          results: {
            weightedScore: session.score?.toFixed(2),
            assignedLevel: session.assignedLevel,
            summary: summary,
            detailedResult: detailed,
            levelBreakdown: session.levelResults,
            jalaliDates,
          },
        });
      } else {
        return res.status(200).json({
          message: "نتیجه تست",
          totalScore: session.score,
          results: session.levelResults,
          detailedResult: detailed,
          jalaliDates,
        });
      }
    }

    if (method === "weighted_level") {
      const questions = session.questions as any[];
      const stats = {
        total: questions.length,
        correct: questions.filter((q: any) => q.isCorrect === true).length,
        wrong: questions.filter(
          (q: any) => q.isCorrect === false && q.userAnswer,
        ).length,
        unanswered: questions.filter((q: any) => !q.userAnswer).length,
      };

      const summary = {
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        wrongAnswers: stats.wrong,
        unanswered: stats.unanswered,
        rawPoints: (((session.score ?? 0) / 100) * 20).toFixed(2),
        maxPoints: 20,
      };

      return res.status(200).json({
        message: "نتیجه تست",
        results: {
          weightedScore: session.score?.toFixed(2),
          assignedLevel: session.assignedLevel,
          summary: summary,
          levelBreakdown: session.levelResults,
        },
      });
    }

    res.status(200).json({
      message: "نتیجه تست",
      totalScore: session.score,
      results: session.levelResults,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =================== EXPORT DEFAULT ===================
const testController = {
  startTest,
  submitTest,
  getCategories,
  getTypesByCategory,
  resumeSession,
  getUserTestsSummary,
  getTestResultDetail,
  getCategoriesAdmin,
  getTypes,
  getUsersWithSessions,
  getAllTestSessionsInfo,
  getMyTestsSummary,
  getMyTestDetail,
};

export default testController;
