import type { Request, Response } from 'express'
import prisma from '../../../../config/prisma'

export async function AdCategoriesTree(req: Request, res: Response) {
  const trees = await prisma.adCategory.findMany()

  // converts id to _id 
  // adds children which is a empty list
  const updatedTrees = trees.map(({ id, ...rest }) => ({
    _id: id,
    children: [],
    ...rest
  }));

  return res.status(200).json(updatedTrees)
}


export async function AdCategoriesDescendants(req: Request, res: Response) {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "Id are required" });
  }

  const specificAd = await prisma.adCategory.findUnique({
    where: {
      id: id as string
    }
  })

  if (!specificAd) {
    return res.status(404).json({
      message: 'دسته بندی با این مشخصات پیدا نشد',
    })
  }
  return res.status(200).json(specificAd)
}
