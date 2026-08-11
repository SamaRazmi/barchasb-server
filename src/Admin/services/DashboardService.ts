import prisma from "../../config/prisma";
import { TransactionType, TransactionStatus } from "@prisma/client";
import * as UserManagementService from "./UserManagementService";
import * as dateFormatter from "../../utils/dateFormatter";

export async function getDashboardStats() {
  const userStats = await UserManagementService.getUserStats();

  const totalUsers = userStats.totalUsers;
  const userDistribution = [
    { platform: "MAIN", count: totalUsers, percentage: totalUsers ? Number(((totalUsers / totalUsers) * 100).toFixed(2)) : 0 },
    { platform: "SHOP", count: 0, percentage: 0 },
    { platform: "CLUB", count: 0, percentage: 0 },
    { platform: "EDUCATION", count: 0, percentage: 0 },
  ];

  const [employerCount, digitalCount, jobSeekerCount, sellerCount] = await Promise.all([
    prisma.employerAd.count(),
    prisma.digitalAd.count(),
    prisma.jobSeekerAd.count(),
    prisma.sellerAd.count(),
  ]);

  const totalAds = employerCount + digitalCount + jobSeekerCount + sellerCount;
  const adDistribution = [
    { type: "EmployerAd", count: employerCount, percentage: totalAds ? Number(((employerCount / totalAds) * 100).toFixed(2)) : 0 },
    { type: "DigitalAd", count: digitalCount, percentage: totalAds ? Number(((digitalCount / totalAds) * 100).toFixed(2)) : 0 },
    { type: "JobSeekerAd", count: jobSeekerCount, percentage: totalAds ? Number(((jobSeekerCount / totalAds) * 100).toFixed(2)) : 0 },
    { type: "SellerAd", count: sellerCount, percentage: totalAds ? Number(((sellerCount / totalAds) * 100).toFixed(2)) : 0 },
  ];

  const totalResumes = await prisma.resume.count();

  const totalCompletedTests = await prisma.testSession.count({
    where: { status: "completed" },
  });

  const revenueAggregate = await prisma.transaction.aggregate({
    where: {
      type: {
        in: [TransactionType.WITHDRAWAL, TransactionType.HOLD],
      },
      status: TransactionStatus.COMPLETED,
    },
    _sum: {
      amount: true,
    },
  });

  const totalRevenue = revenueAggregate._sum.amount || 0n;

  const availableYears = getAvailableYears();
  const currentYear = getCurrentJalaliYear();
  const monthlyRevenue = await getMonthlyRevenue(currentYear);

  return {
    users: userStats,
    userDistribution,
    adDistribution,
    totalResumes,
    totalCompletedTests,
    totalAds,
    totalRevenue: totalRevenue.toString(), // BigInt → string
    availableYears,
    monthlyRevenue,
  };
}

export function getAvailableYears(): number[] {
  const startYear = 1405;
  const currentYear = getCurrentJalaliYear();
  const years: number[] = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
}

export function getCurrentJalaliYear(): number {
  const now = new Date();
  const jalaliDate = dateFormatter.toJalali(now); // "1404/02/15 14:30"
  const parts = jalaliDate.split("/");
  return parseInt(parts[0]); 
}

export async function getMonthlyRevenue(year: number) {
  const startOfYear = dateFormatter.convertJalaliToGregorian(year, 1, 1);
  const endOfYear = dateFormatter.convertJalaliToGregorian(year, 12, 30);

  const dailyRevenues = await prisma.transaction.groupBy({
    by: ["createdAt"],
    where: {
      type: {
        in: [TransactionType.WITHDRAWAL, TransactionType.HOLD],
      },
      status: TransactionStatus.COMPLETED,
      createdAt: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const monthlyData: Record<number, number> = {};
  for (let i = 1; i <= 12; i++) {
    monthlyData[i] = 0;
  }

  for (const item of dailyRevenues) {
    const jalaliDate = dateFormatter.toJalali(item.createdAt, "jYYYY/jMM/jDD");
    const parts = jalaliDate.split("/");
    const month = parseInt(parts[1]); // ماه شمسی (1-12)
    monthlyData[month] += Number(item._sum.amount || 0);
  }

  const monthNames = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد",
    "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];

  return Object.keys(monthlyData).map((key) => ({
    month: parseInt(key),
    monthName: monthNames[parseInt(key) - 1],
    revenue: monthlyData[parseInt(key)],
  }));
}