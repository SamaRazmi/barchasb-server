type TestType = {
  name: string;
  scoringMethod: string;
  categoryId?: { name: string };
};

type Question = {
  isCorrect?: boolean;
  userAnswer?: string;
  subject?: string;
  level?: string;
};

export const generateQuickResult = (
  session: any,
  testType: TestType,
  levelResults: any,
): string => {
  const testName = testType.name;
  const method = testType.scoringMethod;
  const category = testType.categoryId?.name;

  let quickResult = "مشاهده جزئیات";

  if (method === "weighted_level") {
    quickResult = session.assignedLevel || "بدون سطح";
  } else if (method === "mbti_polar") {
    const type = levelResults?.type;
    const title = levelResults?.report?.title;
    quickResult = type
      ? title
        ? `تیپ: ${type} - ${title}`
        : `تیپ: ${type}`
      : "تحلیل MBTI";
  } else if (testName.includes("گاردنر")) {
    const strengths = levelResults?.topStrengths;
    if (strengths?.length) {
      quickResult = strengths
        .map((st: any) => `${st.label} (${st.percentage}٪)`)
        .join("، ");
    }
  } else if (testName.includes("Bar-On") || testName.includes("بار-آن")) {
    if (levelResults) {
      quickResult = Object.entries(levelResults)
        .filter(([key]) => key !== "totalScore")
        .map(([key, value]: any) => `${key} (${value.level || "نامشخص"})`)
        .join("، ");
    }
  } else if (
    method === "trait_accumulation" ||
    testName.toUpperCase().includes("NEO")
  ) {
    if (levelResults) {
      const firstValue = Object.values(levelResults)[0] as any;
      if (firstValue?.level) {
        quickResult = Object.entries(levelResults)
          .map(([key, value]: any) => `${key} (${value.level})`)
          .join("، ");
      } else {
        const traits = Object.values(levelResults) as any[];
        const dominant = traits.sort(
          (a, b) => (b.score || 0) - (a.score || 0),
        )[0];
        quickResult = dominant ? `ویژگی بارز: ${dominant.name}` : "تحلیل شخصیت";
      }
    }
  } else if (testName.includes("هالند") || method === "likert_sum") {
    const code = levelResults?.topThreeCode;
    if (code && levelResults.fullBreakdown) {
      const labels = levelResults.fullBreakdown
        .slice(0, 3)
        .map((item: any) => item.label.split(" (")[0])
        .join(" - ");
      quickResult = `کد: ${code} (${labels})`;
    } else {
      quickResult = code ? `کد شغلی: ${code}` : "تحلیل هالند";
    }
  }

  return quickResult;
};

export const generateDetailData = (
  session: any,
  testType: TestType,
  levelResults: any,
) => {
  const stats = {
    total: session.questions.length,
    correct: session.questions.filter((q: Question) => q.isCorrect === true)
      .length,
    wrong: session.questions.filter(
      (q: Question) => q.isCorrect === false && q.userAnswer,
    ).length,
    unanswered: session.questions.filter((q: Question) => !q.userAnswer).length,
  };

  let detailData: any = {
    baseInfo: {
      testName: testType.name,
      category: testType.categoryId?.name,
      score: session.score?.toFixed(1),
      date: session.finishedAt,
      stats,
    },
  };

  if (testType.scoringMethod === "weighted_level") {
    const topicStats: any = {};
    session.questions.forEach((q: Question, index: number) => {
      const topic = q.subject || "General";
      if (!topicStats[topic]) {
        topicStats[topic] = { correct: 0, total: 0 };
      }
      topicStats[topic].total += 1;
      if (q.isCorrect) {
        topicStats[topic].correct += 1;
      }
    });
    const topicBreakdown = Object.entries(topicStats).map(
      ([name, data]: any) => ({
        topic: name,
        correct: data.correct,
        total: data.total,
        percentage: ((data.correct / data.total) * 100).toFixed(0),
      }),
    );
    detailData.analysis = {
      topicAnalysis: topicBreakdown,
      strengths: topicBreakdown
        .filter((t: any) => t.percentage >= 80)
        .map((t: any) => t.topic),
      weaknesses: topicBreakdown
        .filter((t: any) => t.percentage < 60)
        .map((t: any) => t.topic),
    };
  } else {
    let metrics: any[] = [];

    if (testType.name.includes("MBTI") || levelResults?.type) {
      const p = levelResults.percentages || {};
      const pairs = [
        { key: "EI", l1: "برون‌گرا", l2: "درون‌گرا", v1: p.EI?.E, v2: p.EI?.I },
        { key: "SN", l1: "حسی", l2: "شهودی", v1: p.SN?.S, v2: p.SN?.N },
        { key: "TF", l1: "منطقی", l2: "احساسی", v1: p.TF?.T, v2: p.TF?.F },
        { key: "JP", l1: "قضاوت‌گر", l2: "ادراکی", v1: p.JP?.J, v2: p.JP?.P },
      ];
      metrics = pairs.map((pair) => ({
        key: pair.key,
        label1: pair.l2,
        score1: `${pair.v2}%`,
        label2: pair.l1,
        score2: `${pair.v1}%`,
      }));
      detailData.analysis = { metrics };
    } else if (testType.name.includes("هالند")) {
      metrics = (levelResults.fullBreakdown || []).map((item: any) => ({
        key: item.trait,
        label: item.label,
        score: item.score,
        status: item.title,
      }));
      detailData.analysis = {
        metrics,
        topThreeCode: levelResults.topThreeCode,
        suggestedJobs: levelResults.suggestedJobs,
      };
    } else if (testType.name.includes("گاردنر") || levelResults.profile) {
      const profileData = levelResults.profile || {};
      metrics = Object.entries(profileData).map(([key, val]: any) => ({
        key: key,
        label: val.label,
        score: val.percentage,
        status:
          val.percentage >= 70
            ? "بالا"
            : val.percentage >= 40
              ? "متوسط"
              : "نیاز به تقویت",
      }));
      detailData.analysis = { metrics };
    } else {
      // BAR-ON , NEO
      metrics = Object.entries(levelResults)
        .filter(
          ([key, val]) =>
            typeof val === "object" &&
            !Array.isArray(val) &&
            key !== "topThreeCode" &&
            key !== "radarChartData",
        )
        .map(([key, val]: any) => ({
          key: key,
          label: val.name || val.label || key,
          score: val.score || val.percentage,
          status: val.status || val.title,
        }));
      detailData.analysis = { metrics };
    }
  }

  return { detailData };
};
