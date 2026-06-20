import prisma from "../../../config/prisma";
import { Prisma } from "@prisma/client";

const SQLTypeData = async (categoryId: string) => {
  try {
    const existing = await prisma.testType.findFirst({
      where: { name: "SQL" },
    });

    const data: Prisma.TestTypeUncheckedCreateInput = {
      categoryId,
      name: "SQL",
      description: "سنجش مهارت در طراحی دیتابیس، کوئری‌نویسی",
      tags: ["Database", "SQL", "Backend", "Data Analysis", "Queries"],
      scoringMethod: "weighted_level", // در enum موجود است
      dimensions: [
        "Data Manipulation",
        "Joins & Relations",
        "Database Design",
        "Functions & Aggregates",
        "Transactions & Concurrency",
        "Optimization & Indexing",
      ],
      blueprint: {
        structure: {
          A1: { BasicSyntax: 1, Filtering: 1 },
          A2: { Joins: 1, Aggregations: 2 },
          B1: { CRUD: 2, Subqueries: 3 },
          B2: { SchemaDesign: 3, Constraints: 2 },
          C1: { Transactions: 2, StoredProcedures: 1 },
          C2: { Indexing: 1, Optimization: 1 },
        },
        levelWeights: {
          A1: 1,
          A2: 1.5,
          B1: 2.5,
          B2: 4,
          C1: 6,
          C2: 8,
        },
        totalQuestions: 20,
        timeLimit: 25,
      },
    };

    let sqlType;
    if (existing) {
      sqlType = await prisma.testType.update({
        where: { id: existing.id },
        data,
      });
    } else {
      sqlType = await prisma.testType.create({
        data,
      });
    }

    console.log("SQL Test Type Ready.");
    return sqlType;
  } catch (err) {
    console.error("SQL Type Error:", err);
    throw err;
  }
};

export default SQLTypeData;
