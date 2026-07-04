import type { Request, Response } from "express";
import prisma from "../../../config/prisma";

export async function AllAdsChart(req: Request, res: Response) {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    const [digitals, employers, sellers, jobSeekers] = await Promise.all([
      prisma.digitalAd.findMany({ select: { createdAt: true }, where: { createdAt: { gte: threeMonthsAgo } } }),
      prisma.employerAd.findMany({ select: { createdAt: true } }),
      prisma.sellerAd.findMany({ select: { createdAt: true } }),
      prisma.jobSeekerAd.findMany({ select: { createdAt: true } }),
    ]);


    const allAds = [
      ...digitals.map(ad => ({ createdAt: ad.createdAt, type: 'digital' })),
      ...employers.map(ad => ({ createdAt: ad.createdAt, type: 'employer' })),
      ...sellers.map(ad => ({ createdAt: ad.createdAt, type: 'seller' })),
      ...jobSeekers.map(ad => ({ createdAt: ad.createdAt, type: 'job_seeker' })),
    ];

    const grouped: Record<string, Record<string, number>> = {};

    allAds.forEach((ad) => {
      const dateStr = ad.createdAt.toISOString().split('T')[0];

      if (!grouped[dateStr]) {
        grouped[dateStr] = {
          digital: 0,
          employer: 0,
          seller: 0,
          job_seeker: 0,
        };
      }
      grouped[dateStr][ad.type] += 1;
    });

    const chartData = Object.entries(grouped)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return res.status(200).json(chartData);

  } catch (error) {
    console.error('Error generating chart data:', error);
    return res.status(500).json({ error: 'Failed to generate chart data' });
  }
}