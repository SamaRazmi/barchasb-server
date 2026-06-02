const mongoose = require("mongoose");
const TestType = require("../models/TestType");
const Question = require("../models/Question");
const TestSession = require("../models/TestSession");
const TestCategory = require("../models/TestCategory");
const { pickQuestions } = require("../utils/testHelper");
const ScoringLogic = require("../utils/scoringLogic");
const {
  generateQuickResult,
  generateDetailData,
} = require("../utils/tesrResultAnalyzer");
const dateFormatter = require("../utils/dateFormatter");

// Start Test
exports.startTest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { typeId } = req.body;

    // Get the Blueprint
    const testType = await TestType.findById(typeId);
    if (!testType)
      return res.status(404).json({ message: "عنوان تست یافت نشد." });

    // Get all possible questions for this type
    const allQuestions = await Question.find({ typeId: typeId });

    // Apply Normalization Utility
    const selectedQuestions = pickQuestions(allQuestions, testType.blueprint);

    // Create the Session
    const sessionQuestions = selectedQuestions.map((q) => ({
      questionId: q._id,
      userAnswer: null,
      isCorrect: false,
      subject: q.subject,
      level: q.level,
      questionText: q.questionText,
    }));

    const newSession = new TestSession({
      userId,
      typeId,
      questions: sessionQuestions,
      status: "in-progress",
    });

    await newSession.save();

    // Return the session and the questions
    const questionsForFrontend = selectedQuestions.map((q) => {
      const { options, ...rest } = q.toObject();
      // Remove 'isCorrect' from options
      const safeOptions = options.map(({ isCorrect, ...opt }) => opt);
      return { ...rest, options: safeOptions };
    });

    res.status(201).json({
      sessionId: newSession._id,
      timeLimitM:
        testType.blueprint && testType.blueprint.timeLimit
          ? testType.blueprint.timeLimit
          : null,
      questions: questionsForFrontend,
      jalaliStartedAt: dateFormatter.toJalali(newSession.startedAt),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit Test
exports.submitTest = async (req, res) => {
  try {
    const { sessionId, answers } = req.body;
    const userIdFromToken = req.user.id;

    const session = await TestSession.findById(sessionId)
      .populate({ path: "typeId", populate: { path: "categoryId" } })
      .populate("questions.questionId");

    if (!session) return res.status(404).json({ message: "جلسه یافت نشد." });

    if (session.userId !== userIdFromToken) {
      return res.status(403).json({
        message:
          "شما مجاز به ثبت این تست نیستید. این جلسه متعلق به کاربر دیگری است.",
      });
    }
    if (session.status === "completed")
      return res.status(403).json({ message: "این تست قبلا ثبت شده‌است." });

    const testType = session.typeId;
    const categoryName = testType.categoryId ? testType.categoryId.name : "";
    const method = testType.scoringMethod;
    const testName = testType.name || "";
    let calculatedData;

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
        session.assignedLevel = getCEFRLevel(calculatedData.totalScore);
      } else {
        calculatedData = ScoringLogic.processTechnical(
          session,
          answers,
          testType,
        );
        session.assignedLevel = `${calculatedData.summary.levelFa} (${calculatedData.summary.levelEn})`;
      }
    }
    const questionsToSave = calculatedData.questions.map((q) => {
      const originalQuestion = session.questions.find(
        (sq) =>
          sq.questionId.toString() ===
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
    session.questions = questionsToSave;

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

    // --- SAVE TO DB ---
    session.score = calculatedData.totalScore;
    session.levelResults = calculatedData.levelResults;
    session.status = "completed";
    session.finishedAt = Date.now();

    session.quickResult = quickResult;
    session.detailedResult = detailData;

    await session.save();

    if (method === "weighted_level") {
      return res.status(200).json({
        message: "تست با موفقیت ثبت شد.",
        results: {
          weightedScore: session.score.toFixed(2),
          assignedLevel: session.assignedLevel,
          summary: calculatedData.summary,
          detailedResult: session.detailedResult,
          levelBreakdown: session.levelResults,
        },
      });
    }

    res.status(200).json({
      message: "تست با موفقیت ثبت شد.",
      totalScore: session.score,
      results: session.levelResults,
    });
  } catch (error) {
    const statusCode = error.message.includes("کافی نیست") ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

// Get all active categories
exports.getCategories = async (req, res) => {
  console.log("Mongoose Connection State:", mongoose.connection.readyState);
  console.log("STATE:", require("mongoose").connection.readyState);
  try {
    const categories = await TestCategory.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get types based on category selection
exports.getTypesByCategory = async (req, res) => {
  try {
    const types = await TestType.find({
      categoryId: req.params.categoryId,
    }).select("-blueprint.structure -blueprint.levelWeights -dimensions -__v");
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Resume logic
exports.resumeSession = async (req, res) => {
  try {
    const session = await TestSession.findById(req.params.sessionId).populate(
      "questions.questionId",
    );

    if (!session) return res.status(404).json({ message: "جلسه یافت نشد." });

    const jalaliDates = {
      startedAt: dateFormatter.toJalali(session.startedAt),
      finishedAt: session.finishedAt
        ? dateFormatter.toJalali(session.finishedAt)
        : null,
    };

    // If completed, return results and a flag to the frontend to disable inputs
    if (session.status === "completed") {
      return res.json({
        status: "completed",
        score: session.score,
        levelResults: session.levelResults,
        jalaliDates,
        message: "این آزمون به پایان رسیده است.",
      });
    }

    // Normal resume logic for in-progress tests
    const questionsForFrontend = session.questions.map((sq) => {
      const q = sq.questionId.toObject();
      q.options = q.options.map(({ isCorrect, ...opt }) => opt);
      return q;
    });

    res.json({
      status: "in-progress",
      session: {
        ...session.toObject(),
        jalaliDates,
      },
      questions: questionsForFrontend,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN
// -------------------------------------------------------------
// get user test summary(admin)
exports.getUserTestsSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await TestSession.find({ userId, status: "completed" })
      .populate({
        path: "typeId",
        populate: { path: "categoryId" },
      })
      .lean()
      .sort({ finishedAt: -1 });

    const summary = sessions.map((s) => ({
      sessionId: s._id,
      testName: s.typeId?.name,
      category: s.typeId?.categoryId?.name,
      date: dateFormatter.toJalali(s.finishedAt),
      result: s.quickResult || "مشاهده جزئیات",
      score: s.score?.toFixed(1),
    }));

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get detail of test result(admin)
exports.getTestResultDetail = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await TestSession.findById(sessionId)
      .populate({
        path: "typeId",
        populate: { path: "categoryId" },
      })
      .populate("questions.questionId")
      .lean();

    if (!session) return res.status(404).json({ message: "جلسه یافت نشد." });

    session.jalaliDates = {
      startedAt: dateFormatter.toJalali(session.startedAt),
      finishedAt: dateFormatter.toJalali(session.finishedAt),
    };

    const testType = session.typeId;
    const method = testType.scoringMethod;
    if (session.detailedResult) {
      if (session.detailedResult.baseInfo) {
        session.detailedResult.baseInfo.jalaliDate = dateFormatter.toJalali(
          session.finishedAt,
        );
      }
      if (method === "weighted_level") {
        return res.status(200).json({
          message: "نتیجه تست",
          results: {
            weightedScore: session.score?.toFixed(2),
            assignedLevel: session.assignedLevel,
            detailedResult: session.detailedResult,
            levelBreakdown: session.levelResults,
            jalaliDates: session.jalaliDates,
          },
        });
      } else {
        return res.status(200).json({
          message: "نتیجه تست",
          totalScore: session.score,
          results: session.levelResults,
          detailedResult: session.detailedResult,
          jalaliDates: session.jalaliDates,
        });
      }
    }

    const levelResults = session.levelResults || {};
    const { detailData } = ResultAnalyzer.generateDetailData(
      session,
      testType,
      levelResults,
    );
    await TestSession.findByIdAndUpdate(sessionId, {
      detailedResult: detailData,
    });

    if (method === "weighted_level") {
      return res.status(200).json({
        message: "نتیجه تست",
        results: {
          weightedScore: session.score?.toFixed(2),
          assignedLevel: session.assignedLevel,
          summary: session.levelResults?.summary || {},
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all categories(admin)
exports.getCategories = async (req, res) => {
  try {
    const categories = await TestCategory.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "خطا در سرور", error: error.message });
  }
};

// get all test types
exports.getTypes = async (req, res) => {
  try {
    const { categoryId } = req.query; 
    const filter = categoryId ? { categoryId } : {};

    const types = await TestType.find(filter)
      .populate("categoryId", "name icon") 
      .select("-blueprint.structure -blueprint.levelWeights -dimensions -__v")
      .sort({ createdAt: -1 });

    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all users id that has at lest one session test
exports.getUsersWithSessions = async (req, res) => {
  try {
    const uniqueUserIds = await TestSession.distinct("userId");
    
    res.status(200).json(uniqueUserIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTestSessionsInfo = async (req, res) => {
  try {
    const sessions = await TestSession.find()
      .select("_id userId status startedAt typeId")
      .populate("typeId", "name tags") 
      .sort({ startedAt: -1 })
      .lean(); 

    const formattedSessions = sessions.map(session => ({
      sessionId: session._id,
      userId: session.userId,
      status: session.status,
      startedAt: dateFormatter.toJalali(session.startedAt),
      testName: session.typeId ? session.typeId.name : "نامشخص",
      testTags: session.typeId ? session.typeId.tags : []
    }));

    res.status(200).json(formattedSessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// USER PROFILE
// ---------------------------------------------------------------
// get user test summary(user)
exports.getMyTestsSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await TestSession.find({ userId, status: "completed" })
      .populate({
        path: "typeId",
        populate: { path: "categoryId" },
      })
      .lean()
      .sort({ finishedAt: -1 });

    const summary = sessions.map((s) => ({
      sessionId: s._id,
      testName: s.typeId?.name || "نامشخص",
      category: s.typeId?.categoryId?.name || "بدون دسته‌بندی",
      date: dateFormatter.toJalali(s.finishedAt),
      result: s.quickResult || "مشاهده جزئیات",
      score: s.score?.toFixed(1),
    }));

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get detail of test result(user)
exports.getMyTestDetail = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await TestSession.findOne({ _id: sessionId, userId })
      .populate({
        path: "typeId",
        populate: { path: "categoryId" },
      })
      .populate("questions.questionId")
      .lean();

    if (!session) {
      return res
        .status(404)
        .json({ message: "نتیجه تست یافت نشد یا دسترسی غیرمجاز است." });
    }

    if (session.status !== "completed") {
      return res.status(400).json({ message: "این تست هنوز تکمیل نشده است." });
    }

    session.jalaliDates = {
      startedAt: dateFormatter.toJalali(session.startedAt),
      finishedAt: dateFormatter.toJalali(session.finishedAt),
    };

    const testType = session.typeId;
    const method = testType.scoringMethod;

    if (session.detailedResult) {
      if (session.detailedResult.baseInfo) {
        session.detailedResult.baseInfo.jalaliDate = dateFormatter.toJalali(
          session.finishedAt,
        );
      }
      if (method === "weighted_level") {
        const summary =
          session.levelResults?.summary ||
          (session.detailedResult.baseInfo?.stats
            ? {
                totalQuestions: session.detailedResult.baseInfo.stats.total,
                correctAnswers: session.detailedResult.baseInfo.stats.correct,
                wrongAnswers: session.detailedResult.baseInfo.stats.wrong,
                unanswered: session.detailedResult.baseInfo.stats.unanswered,
                rawPoints: ((session.score / 100) * 20).toFixed(2), // محاسبه مجدد
                maxPoints: 20,
              }
            : {});

        return res.status(200).json({
          message: "نتیجه تست",
          results: {
            weightedScore: session.score?.toFixed(2),
            assignedLevel: session.assignedLevel,
            summary: summary,
            detailedResult: session.detailedResult,
            levelBreakdown: session.levelResults,
            jalaliDates: session.jalaliDates,
          },
        });
      } else {
        return res.status(200).json({
          message: "نتیجه تست",
          totalScore: session.score,
          results: session.levelResults,
          detailedResult: session.detailedResult,
          jalaliDates: session.jalaliDates,
        });
      }
    }

    if (method === "weighted_level") {
      const stats = {
        total: session.questions.length,
        correct: session.questions.filter((q) => q.isCorrect === true).length,
        wrong: session.questions.filter(
          (q) => q.isCorrect === false && q.userAnswer,
        ).length,
        unanswered: session.questions.filter((q) => !q.userAnswer).length,
      };

      const summary = {
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        wrongAnswers: stats.wrong,
        unanswered: stats.unanswered,
        rawPoints: ((session.score / 100) * 20).toFixed(2),
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCEFRLevel = (score) => {
  if (score >= 91) return "C2 (تسلط کامل)";
  if (score >= 76) return "C1 (پیشرفته)";
  if (score >= 56) return "B2 (بالاتر از متوسط)";
  if (score >= 36) return "B1 (متوسط)";
  if (score >= 16) return "A2 (پیش متوسط)";
  return "A1 (مبتدی)";
};
