import prisma from "../../config/prisma";

export async function getAllArticleCategories() {
  return prisma.articleCategory.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  });
}

interface CreateCategoryInput {
  name: string;
  slug: string;
}

export async function createArticleCategory(input: CreateCategoryInput) {
  const { name, slug } = input;

  const existing = await prisma.articleCategory.findFirst({
    where: {
      OR: [{ name }, { slug }],
    },
  });
  if (existing) throw new Error("نام یا اسلاگ تکراری است");

  return prisma.articleCategory.create({
    data: {
      name,
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

interface UpdateCategoryInput {
  id: string;
  name?: string;
  slug?: string;
}

export async function updateArticleCategory(input: UpdateCategoryInput) {
  const { id, name, slug } = input;

  const existing = await prisma.articleCategory.findUnique({
    where: { id },
  });
  if (!existing) throw new Error("دسته‌بندی یافت نشد");

  if (name || slug) {
    const duplicate = await prisma.articleCategory.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              ...(name ? [{ name }] : []),
              ...(slug ? [{ slug }] : []),
            ],
          },
        ],
      },
    });
    if (duplicate) throw new Error("نام یا اسلاگ تکراری است");
  }

  const data: any = {};
  if (name !== undefined) data.name = name;
  if (slug !== undefined) data.slug = slug;

  return prisma.articleCategory.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

export async function deleteArticleCategory(id: string) {
  const articlesCount = await prisma.article.count({
    where: { categoryId: id },
  });

  if (articlesCount > 0) {
    throw new Error(`این دسته‌بندی دارای ${articlesCount} مقاله است. ابتدا مقالات را حذف یا منتقل کنید.`);
  }

  return prisma.articleCategory.delete({
    where: { id },
  });
}