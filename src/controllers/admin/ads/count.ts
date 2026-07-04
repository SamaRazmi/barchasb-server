import type { Request, Response } from "express";
import prisma from "../../../config/prisma";
import { AdStatus } from "@prisma/client";

const VALID_PARAMETERS = ['approved', 'rejected', 'pending'] as const
type adStatusType = typeof VALID_PARAMETERS[number]

export async function AdsCount(req: Request, res: Response) {
  const adStatus = req.query.adStatus as adStatusType | undefined

  // validating the PARAMETER
  if (adStatus && !VALID_PARAMETERS.includes(adStatus as adStatusType)) {
    return res.status(400).json({
      error: "Invalid adStatus parameter",
      message: `The value '${adStatus}' is not a valid ad status.`,
      validOptions: VALID_PARAMETERS,
    });
  }

  const condition = adStatus ? { adStatus: adStatus as AdStatus } : {};

  const [digitalCount, sellerCount, employerCount, jobSeekerCount] = await Promise.all([
    prisma.digitalAd.count({ where: condition }),
    prisma.sellerAd.count({ where: condition }),
    prisma.employerAd.count({ where: condition }),
    prisma.jobSeekerAd.count({ where: condition })
  ]);

  const total = digitalCount + sellerCount + employerCount + jobSeekerCount;

  const responseStatus = adStatus || 'all';

  return res.status(200).json({
    adStatus: responseStatus,
    total
  });
}
