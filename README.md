# 🚀 Barchasb Server

> **سیستم جامع مدیریت آگهی‌های استخدام، فروش و خدمات**  
> با معماری مدرن **Node.js + TypeScript + Prisma + PostgreSQL**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-20.10-blue)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📖 معرفی پروژه

**Barchasb** یک پلتفرم چندمنظوره برای مدیریت آگهی‌های استخدام، فروش کالا، خدمات و محتوای دیجیتال است. این پروژه با تمرکز بر **عملکرد بالا**، **امنیت** و **قابلیت توسعه** طراحی شده است.

### ✨ ویژگی‌های کلیدی

- ✅ احراز هویت با JWT و کوکی (HttpOnly, Secure)
- ✅ مدیریت کاربران، جلسات و دستگاه‌ها
- ✅ دسته‌بندی‌های درختی برای آگهی‌ها و مشاغل
- ✅ سیستم گزارش‌گیری و تیکتینگ
- ✅ آزمون‌های روانشناسی، زبان و مهارت
- ✅ آمار و تحلیل بازدیدها
- ✅ مستندات Swagger (OpenAPI)
- ✅ وب‌سوکت برای چت آنلاین
- ✅ آپلود فایل در فضای ابری (Liara S3)
- ✅ ارسال پیامک (Payamak)
- ✅ ارسال ایمیل (SMTP)

---

## 📁 ساختار پروژه


---

## 🗄️ جدول روابط بین مدل‌ها

| رابطه | نوع | سمت چپ | سمت راست | فیلد کلید خارجی | توضیح |
|--------|------|--------|---------|----------------|--------|
| **User → UserProfile** | One‑to‑One | `User` | `UserProfile` | `user` | هر کاربر یک پروفایل دارد (یکتا) |
| **User → Session** | One‑to‑Many | `User` | `Session` | `user` | هر کاربر می‌تواند چندین جلسه فعال داشته باشد |
| **User → AdMark** | One‑to‑Many | `User` | `AdMark` | `userId` | هر کاربر می‌تواند چندین آگهی را نشان کند |
| **User → AdView** | One‑to‑Many | `User` | `AdView` | `ownerId` | هر کاربر چندین بازدید از آگهی‌ها دارد |
| **User → Chat (از طرف from)** | One‑to‑Many | `User` | `Chat` | `from` | هر کاربر می‌تواند فرستنده پیام‌های متعدد باشد |
| **User → Chat (از طرف to)** | One‑to‑Many | `User` | `Chat` | `to` | هر کاربر می‌تواند گیرنده پیام‌های متعدد باشد |
| **User → DigitalAd** | One‑to‑Many | `User` | `DigitalAd` | `owner` | هر کاربر مالک چندین آگهی دیجیتال است |
| **User → EmployerAd** | One‑to‑Many | `User` | `EmployerAd` | `owner` | هر کاربر مالک چندین آگهی کارفرما است |
| **User → JobSeekerAd** | One‑to‑Many | `User` | `JobSeekerAd` | `owner` | هر کاربر مالک چندین آگهی کارجو است |
| **User → SellerAd** | One‑to‑Many | `User` | `SellerAd` | `owner` | هر کاربر مالک چندین آگهی فروش است |
| **User → Notification (گیرنده)** | One‑to‑Many | `User` | `Notification` | `userId` | هر کاربر چندین اعلان دریافت می‌کند |
| **User → Notification (فرستنده)** | One‑to‑Many | `User` | `Notification` | `fromUserId` | هر کاربر چندین اعلان ارسال می‌کند |
| **User → Report (گزارش‌دهنده)** | One‑to‑Many | `User` | `Report` | `reporterUserId` | هر کاربر می‌تواند چندین گزارش ثبت کند |
| **User → ReportReason (ایجادکننده)** | One‑to‑Many | `User` | `ReportReason` | `createdById` | هر کاربر می‌تواند چندین دلیل گزارش ایجاد کند |
| **User → Resume** | One‑to‑Many | `User` | `Resume` | `userId` | هر کاربر می‌تواند چندین رزومه داشته باشد |
| **User → Ticket** | One‑to‑Many | `User` | `Ticket` | `user` | هر کاربر می‌تواند چندین تیکت ایجاد کند |
| **User → TicketReply** | One‑to‑Many | `User` | `TicketReply` | `userId` | هر کاربر می‌تواند چندین پاسخ تیکت بدهد |
| **User → ToolUsageLog** | One‑to‑Many | `User` | `ToolUsageLog` | `userId` | هر کاربر چندین لاگ استفاده از ابزار دارد |
| **User → RecentView** | One‑to‑Many | `User` | `RecentView` | `user` | هر کاربر چندین بازدید اخیر دارد |
| **User → TestSession** | One‑to‑Many | `User` | `TestSession` | `userId` | هر کاربر می‌تواند در چندین آزمون شرکت کند |
| **User → Conversation** | Many‑to‑Many | `User` | `Conversation` | `participants` (آرایه‌ای) | هر کاربر می‌تواند در چندین مکالمه شرکت داشته باشد |
| **AdCategory → AdCategoryAttributes** | One‑to‑Many | `AdCategory` | `AdCategoryAttributes` | `adCategoryId` | هر دسته‌بندی می‌تواند چندین ویژگی داشته باشد |
| **AdCategory → AdCategory (خودارجاعی)** | Self‑referencing | `AdCategory` | `AdCategory` | `parent` | هر دسته‌بندی می‌تواند زیردسته داشته باشد |
| **JobCategory → JobCategory (خودارجاعی)** | Self‑referencing | `JobCategory` | `JobCategory` | `parent` | هر دسته‌بندی شغلی می‌تواند زیردسته داشته باشد |
| **Chat → Conversation** | Many‑to‑One | `Chat` | `Conversation` | `conversationId` | هر پیام متعلق به یک مکالمه است |
| **Conversation → Chat** | One‑to‑Many | `Conversation` | `Chat` | `conversationId` | هر مکالمه شامل چندین پیام است |
| **DigitalAd → User** | Many‑to‑One | `DigitalAd` | `User` | `owner` | هر آگهی دیجیتال به یک کاربر تعلق دارد |
| **EmployerAd → User** | Many‑to‑One | `EmployerAd` | `User` | `owner` | هر آگهی کارفرما به یک کاربر تعلق دارد |
| **JobSeekerAd → User** | Many‑to‑One | `JobSeekerAd` | `User` | `owner` | هر آگهی کارجو به یک کاربر تعلق دارد |
| **SellerAd → User** | Many‑to‑One | `SellerAd` | `User` | `owner` | هر آگهی فروش به یک کاربر تعلق دارد |
| **Question → TestType** | Many‑to‑One | `Question` | `TestType` | `typeId` | هر سوال به یک نوع آزمون تعلق دارد |
| **TestSession → User** | Many‑to‑One | `TestSession` | `User` | `userId` | هر جلسه آزمون به یک کاربر تعلق دارد |
| **TestSession → TestType** | Many‑to‑One | `TestSession` | `TestType` | `typeId` | هر جلسه آزمون به یک نوع آزمون تعلق دارد |
| **TestType → TestCategory** | Many‑to‑One | `TestType` | `TestCategory` | `categoryId` | هر نوع آزمون به یک دسته‌بندی تعلق دارد |
| **Ticket → TicketReply** | One‑to‑Many | `Ticket` | `TicketReply` | `ticketId` | هر تیکت شامل چندین پاسخ است |
| **TicketReply → Ticket** | Many‑to‑One | `TicketReply` | `Ticket` | `ticketId` | هر پاسخ به یک تیکت تعلق دارد |
| **TicketReply → User** | Many‑to‑One | `TicketReply` | `User` | `userId` | هر پاسخ توسط یک کاربر نوشته شده است |
| **ReportReason → User** | Many‑to‑One | `ReportReason` | `User` | `createdById` | هر دلیل گزارش توسط یک کاربر ایجاد شده است |
| **AdMark → User** | Many‑to‑One | `AdMark` | `User` | `userId` | هر نشان به یک کاربر تعلق دارد |
| **AdView → User** | Many‑to‑One | `AdView` | `User` | `ownerId` | هر بازدید به یک کاربر تعلق دارد |

---

## 🐳 دستورات کامل Docker

| دستور | توضیح |
|-------|--------|
| `docker-compose up -d` | اجرای PostgreSQL در پس‌زمینه |
| `docker-compose down` | توقف و حذف کانتینرها |
| `docker-compose down -v` | توقف و حذف کانتینرها + حذف volumeها |
| `docker ps` | مشاهده کانتینرهای در حال اجرا |
| `docker logs -f postgres-barchasb` | مشاهده لاگ‌های PostgreSQL |
| `docker exec -it postgres-barchasb psql -U postgres -d barchasb` | ورود به محیط psql |

---

## 🗄️ دستورات کامل Prisma

| دستور | توضیح |
|-------|--------|
| `npx prisma generate` | تولید Prisma Client (اجباری پس از هر تغییر) |
| `npx prisma db push` | اعمال مستقیم schema به دیتابیس |
| `npx prisma migrate dev --name <name>` | ایجاد و اعمال migration در محیط توسعه |
| `npx prisma migrate reset` | ریست کامل دیتابیس + اعمال migration + اجرای seed |
| `npx prisma studio` | باز کردن رابط گرافیکی مدیریت داده‌ها (http://localhost:5555) |
| `npx prisma db seed` | اجرای فایل‌های seed |
| `npx prisma validate` | اعتبارسنجی فایل `schema.prisma` |
| `npx prisma format` | فرمت کردن `schema.prisma` |

---

## 🌱 Seed کردن دیتابیس

### فایل‌های Seed موجود در `prisma/`

| فایل | توضیح |
|------|--------|
| `seedAdCategories.ts` | دسته‌بندی آگهی‌ها (املاک، وسایل نقلیه، ...) |
| `seedProvinces.ts` | استان‌ها و شهرهای ایران |
| `seedReportReasons.ts` | دلایل گزارش‌دهی |
| `seedJobCategories.ts` | دسته‌بندی مشاغل (IT، پزشکی، مهندسی، ...) |

**اجرای همه seedها یکجا:**
```bash
npx prisma db seed


npx tsx prisma/seedAdCategories.ts
npx tsx prisma/seedProvinces.ts
npx tsx prisma/seedReportReasons.ts
npx tsx prisma/seedJobCategories.ts



### 🚀 اجرای سرور

```markdown
## 🚀 اجرای سرور

### حالت توسعه (با نودمون)
```bash
npm run dev

npx tsx src/server.ts

http://localhost:5000

http://localhost:5000/api-docs