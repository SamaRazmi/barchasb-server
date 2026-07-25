import prisma from "../../config/prisma";
import { ArticleStatus } from "@prisma/client";
import { toJalali } from "../../utils/dateFormatter";

const ALLOWED_FIELDS = [
  "title",
  "slug",
  "categoryId",
  "featuredImage",
  "content",
  "plaintext",
  "status",
  "authorId",
  "publishedAt",
] as const;

function filterArticleData(data: any): any {
  const filtered: any = {};
  for (const key of ALLOWED_FIELDS) {
    if (data[key] !== undefined) {
      filtered[key] = data[key];
    }
  }
  return filtered;
}

interface GetArticlesInput {
  status?: ArticleStatus;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getArticles(input: GetArticlesInput) {
  const { status, categoryId, search, page = 1, limit = 10 } = input;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { plaintext: { contains: search, mode: "insensitive" } },
    ];
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        plaintext: true,
        status: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return {
    data: articles.map((article) => ({
      ...article,
      createdAt: toJalali(article.createdAt),
      updatedAt: toJalali(article.updatedAt),
      publishedAt: article.publishedAt ? toJalali(article.publishedAt) : null,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getArticleById(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      author: {
        select: { id: true, fullName: true, username: true },
      },
    },
  });

  if (!article) throw new Error("مقاله یافت نشد");

  return {
    ...article,
    createdAt: toJalali(article.createdAt),
    updatedAt: toJalali(article.updatedAt),
    publishedAt: article.publishedAt ? toJalali(article.publishedAt) : null,
  };
}

interface CreateArticleInput {
  title: string;
  slug: string;
  categoryId: string;
  featuredImage?: string;
  content: any;
  plaintext?: string;
  status?: ArticleStatus;
  authorId: string;
}

export async function createArticle(input: CreateArticleInput) {
  const { title, slug, categoryId, featuredImage, content, plaintext, status, authorId } = input;

  const existing = await prisma.article.findUnique({
    where: { slug },
  });
  if (existing) throw new Error("اسلاگ تکراری است");

  const data = filterArticleData({
    title,
    slug,
    categoryId,
    featuredImage,
    content,
    plaintext,
    status: status || ArticleStatus.DRAFT,
    authorId,
  });

  const article = await prisma.article.create({
    data,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      author: {
        select: { id: true, fullName: true, username: true },
      },
    },
  });

  return {
    ...article,
    createdAt: toJalali(article.createdAt),
    updatedAt: toJalali(article.updatedAt),
    publishedAt: article.publishedAt ? toJalali(article.publishedAt) : null,
  };
}

interface UpdateArticleInput {
  id: string;
  title?: string;
  slug?: string;
  categoryId?: string;
  featuredImage?: string;
  content?: any;
  plaintext?: string;
  status?: ArticleStatus;
}

export async function updateArticle(input: UpdateArticleInput) {
  const { id, title, slug, categoryId, featuredImage, content, plaintext, status } = input;

  const existing = await prisma.article.findUnique({
    where: { id },
  });
  if (!existing) throw new Error("مقاله یافت نشد");

  if (slug && slug.trim() !== "") {
    if (slug !== existing.slug) {
      const duplicate = await prisma.article.findUnique({
        where: { slug },
      });
      if (duplicate) throw new Error("اسلاگ تکراری است");
    }
  }
  const data: any = {};

  if (title !== undefined && title.trim() !== "") {
    data.title = title.trim();
  }
  if (slug !== undefined && slug.trim() !== "") {
    data.slug = slug.trim();
  }
  if (categoryId !== undefined && categoryId.trim() !== "") {
    const categoryExists = await prisma.articleCategory.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) throw new Error("دسته‌بندی نامعتبر است");
    data.categoryId = categoryId;
  }
  if (featuredImage !== undefined && featuredImage.trim() !== "") {
    data.featuredImage = featuredImage;
  }
  if (content !== undefined) {
    data.content = typeof content === "string" ? JSON.parse(content) : content;
  }
  if (plaintext !== undefined && plaintext.trim() !== "") {
    data.plaintext = plaintext.trim();
  }
  if (status !== undefined) {
    data.status = status;
    if (status === ArticleStatus.PUBLISHED && existing.status !== ArticleStatus.PUBLISHED) {
      data.publishedAt = new Date();
    }
  }

  if (Object.keys(data).length === 0) {
    throw new Error("هیچ فیلد معتبری برای ویرایش ارسال نشده است");
  }

  const article = await prisma.article.update({
    where: { id },
    data,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      author: {
        select: { id: true, fullName: true, username: true },
      },
    },
  });

  return {
    ...article,
    createdAt: toJalali(article.createdAt),
    updatedAt: toJalali(article.updatedAt),
    publishedAt: article.publishedAt ? toJalali(article.publishedAt) : null,
  };
}

export async function deleteArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
  });
  if (!article) throw new Error("مقاله یافت نشد");

  await prisma.article.delete({
    where: { id },
  });

  return { message: "مقاله با موفقیت حذف شد" };
}