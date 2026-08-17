import { Request, Response } from "express";
import prisma from "../config/prisma";
import { pickQuestions } from "../utils/testHelper";
import ScoringLogic from "../utils/scoringLogic";
import * as dateFormatter from "../utils/dateFormatter";
import {
  generateQuickResult,
  generateDetailData,
} from "../utils/tesrResultAnalyzer";

const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

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
    const testType = (session as any).testType;
    const categoryName = testType?.category?.name || "";
    const method = testType?.scoringMethod;
    const testName = testType?.name || "";

    const allQuestions = await prisma.question.findMany({
      where: { typeId: testType.id },
    });
    const questionMap = new Map(allQuestions.map(q => [q.id, q]));

    const fullQuestions = session.questions.map((sq: any) => {
      const qId = typeof sq.questionId === 'object'
        ? (sq.questionId.id || sq.questionId._id)
        : sq.questionId;
      const fullQ = questionMap.get(qId);
      if (!fullQ) {
        throw new Error(`سوال با شناسه ${qId} یافت نشد`);
      }
      return {
        ...sq,
        questionId: {
          ...fullQ,
          _id: fullQ.id,
          options: fullQ.options.map((opt: any) => ({
            ...opt,
            _id: opt._id,
          })),
        },
      };
    });

    const modifiedSession = { ...session, questions: fullQuestions };

    let calculatedData: any;

    if (method === "likert_sum" && testName.includes("گاردنر")) {
      calculatedData = ScoringLogic.processGardner(modifiedSession, answers);
    } else if (method === "likert_sum" && testName.includes("هالند")) {
      calculatedData = ScoringLogic.processHolland(modifiedSession, answers);
    } else if (method === "mbti_polar") {
      calculatedData = ScoringLogic.processMBTI(modifiedSession, answers);
    } else if (method === "trait_accumulation") {
      if (testName.toUpperCase().includes("NEO")) {
        calculatedData = ScoringLogic.processNEO(modifiedSession, answers);
      } else {
        calculatedData = ScoringLogic.processPsych(modifiedSession, answers);
      }
    } else if (method === "weighted_level") {
      if (categoryName === "زبان‌های خارجه") {
        calculatedData = ScoringLogic.processLanguage(modifiedSession, answers, testType);
        (session as any).assignedLevel = getCEFRLevel(calculatedData.totalScore);
      } else {
        calculatedData = ScoringLogic.processTechnical(modifiedSession, answers, testType);
        (session as any).assignedLevel =
          `${calculatedData.summary.levelFa} (${calculatedData.summary.levelEn})`;
      }
    }

    const sessionWithAnswers = {
      ...session,
      questions: calculatedData.questions.map((q: any) => ({
        ...q,
        questionId: typeof q.questionId === 'object' ? q.questionId._id : q.questionId,
        subject: q.subject || "General",
        level: q.level || "Unknown",
      })),
    };

    const quickResult = generateQuickResult(
      sessionWithAnswers,
      testType,
      calculatedData.levelResults
    );

    const { detailData } = generateDetailData(
      sessionWithAnswers,
      testType,
      calculatedData.levelResults
    );

    const questionsToSave = session.questions.map((sq: any) => {
      const questionId = typeof sq.questionId === 'object'
        ? (sq.questionId.id || sq.questionId._id || sq.questionId)
        : sq.questionId;
      const processed = calculatedData.questions.find((q: any) => {
        const qId = typeof q.questionId === 'object' ? q.questionId?._id : q.questionId;
        return qId === questionId;
      });
      return {
        questionId: questionId,
        userAnswer: processed?.userAnswer ?? null,
        isCorrect: processed?.isCorrect ?? false,
        pointsEarned: processed?.pointsEarned ?? 0,
        dimension: processed?.dimension ?? null,
        subject: processed?.subject || sq.subject || "General",
        level: processed?.level || sq.level || "Unknown",
      };
    });

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
        testType: {
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
      testName: (s as any).testType?.name || "نامشخص",
      category: (s as any).testType?.category?.name || "بدون دسته‌بندی",
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

    const testType = (session as any).testType;
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
  getMyTestsSummary,
  getMyTestDetail,
};

export default testController;
