import prisma from "../config/prisma";

export const ArticlesService = {
  /**
   * دریافت همه دسته‌بندی‌ها (فقط id و name)
   */
  async getCategories() {
    return prisma.articleCategory.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  },

  /**
   * دریافت خلاصه مقالات منتشر شده (برای صفحه اصلی و لیست)
   */
  async getArticlesSummary() {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        plaintext: true,
        categoryId: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      slugArticle: article.slug,
      mainImageUrl: article.featuredImage || "",
      summary: article.plaintext || "",
      categoryId: article.categoryId,
    }));
  },

  /**
   * دریافت مقالات کامل یک دسته خاص (همراه نویسنده و نام دسته)
   */
  async getArticlesByCategory(categoryId: string) {
    const articles = await prisma.article.findMany({
      where: {
        categoryId,
        status: "PUBLISHED",
      },
      include: {
        category: {
          select: { name: true },
        },
        author: {
          select: { fullName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return articles.map((article) => {
      const fullName = article.author?.fullName || "";
      const [firstName, ...lastNameParts] = fullName.split(" ");
      return {
        id: article.id,
        title: article.title,
        slugArticle: article.slug,
        mainImageUrl: article.featuredImage || "",
        summary: article.plaintext || "",
        categoryId: article.categoryId,
        text:
          typeof article.content === "string"
            ? article.content
            : JSON.stringify(article.content),
        insideImageUrl: null, // در صورت وجود فیلد جداگانه، جایگزین کنید
        firstName: firstName || "",
        lastName: lastNameParts.join(" ") || "",
        category: article.category
          ? { name: article.category.name }
          : undefined,
      };
    });
  },
};