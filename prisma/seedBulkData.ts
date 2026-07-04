import prisma from "../src/config/prisma";
import { faker } from "@faker-js/faker/locale/fa";
import bcrypt from "bcrypt";
import {
  AdType,
  MarkType,
  PersonType,
  AdStatus,
  PaymentMethod,
  Gender,
  ReportType,
  ReportStatus,
  TicketStatus,
  TestSessionStatus,
  ScoringMethod,
  TimeUnit,
} from "@prisma/client";

// ============================================
// ایمپورت داده‌های استاتیک
// ============================================
import provincesData from "../src/data/ostan.json";
import citiesData from "../src/data/shahr.json";
import jobCategoriesData from "../src/data/jobCategoriesData";
import adCategoriesData from "../src/data/adCategoriesData";
import additionalAdCategoriesData from "../src/data/adAdditionalAttributes";

// ============================================
// تنظیمات تعداد رکوردها
// ============================================
const CONFIG = {
  USERS: 1000,
  ADS_PER_TYPE: 200,
  MARKS: 500,
  VIEWS: 300,
  RECENT_VIEWS: 400,
  CONVERSATIONS: 150,
  CHATS_PER_CONV: 5,
  TICKETS: 100,
  TICKET_REPLIES: 200,
  RESUMES: 300,
  REPORTS: 150,
  TOOL_LOGS: 500,
  TEST_CATEGORIES: 3,
  TEST_TYPES_PER_CAT: 2,
  QUESTIONS_PER_TYPE: 10,
  TEST_SESSIONS: 200,
  AD_ENHANCEMENTS: 100,
  SUGGESTION_VIEWS: 400,
  SUGGESTION_PREFS: 200,
  DAILY_LIMITS: 300,
  CACHED_SUGGESTIONS: 150,
};

// ============================================
// ساختار داده‌های استان و شهر
// ============================================
type Province = { id: number; name: string };
type City = { id: number; name: string; ostan: number };

const provinces: Province[] = provincesData;
const cities: City[] = citiesData;

// ============================================
// توابع کمکی
// ============================================
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return faker.number.int({ min, max });
}

function randomDateRecent(days: number): Date {
  return faker.date.recent({ days });
}

function randomDatePast(years: number): Date {
  return faker.date.past({ years });
}

function randomDateFuture(years: number): Date {
  return faker.date.future({ years });
}

// تولید استان و شهر معتبر
function getRandomProvinceAndCity(): { province: string; city: string } {
  const province = randomItem(provinces);
  const cityList = cities.filter((c) => c.ostan === province.id);
  const city =
    cityList.length > 0 ? randomItem(cityList) : { name: province.name };
  return { province: province.name, city: city.name };
}

// انتخاب دسته‌بندی شغلی (با سطح والد)
function getRandomJobCategory() {
  const mainCats = jobCategoriesData.filter((c) => c.parent === null);
  const main = randomItem(mainCats);
  const subCats = jobCategoriesData.filter((c) => c.parent === main.id);
  const sub = subCats.length > 0 ? randomItem(subCats) : main;
  return { main: main.name, sub: sub.name };
}

// انتخاب دسته‌بندی آگهی (با سطح والد)
function getRandomAdCategory() {
  const allCats = [...adCategoriesData, ...additionalAdCategoriesData];
  const mainCats = allCats.filter(
    (c) => c.parent === null || c.parent === undefined,
  );
  const main = randomItem(mainCats);
  const subCats = allCats.filter((c) => c.parent === main.id);
  const sub = subCats.length > 0 ? randomItem(subCats) : main;
  return { main: main.name, sub: sub.name };
}

// ============================================
// تابع اصلی
// ============================================
async function seedBulkData() {
  console.log("🚀 شروع تولید داده‌های حجیم و کامل (فارسی، بدون نقش)...");

  const BATCH_SIZE = 500;

  // ---------- مرحله ۱: تولید کاربران ----------
  console.log("👤 تولید کاربران...");
  const users = [];
  for (let i = 0; i < CONFIG.USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const phone = faker.phone
      .number({ style: "national" })
      .replace(/\D/g, "")
      .slice(0, 11);
    const nationalCode = faker.string.numeric(10);
    const password = await bcrypt.hash("Test@123", 10);
    const { province, city } = getRandomProvinceAndCity();

    users.push({
      name: firstName,
      lastName,
      username:
        faker.internet.username({ firstName, lastName }) +
        faker.string.alphanumeric(3),
      nationalCode,
      phone,
      password,
      birthDate: faker.date
        .birthdate({ min: 18, max: 60, mode: "age" })
        .toLocaleDateString("fa-IR"),
      gender: randomItem([Gender.male, Gender.female]),
      province,
      city,
      acceptTerms: true,
      joinedAt: faker.date.past({ years: 2 }).toLocaleDateString("fa-IR"),
      email: faker.internet.email({ firstName, lastName }),
      email_confirmed: faker.datatype.boolean(0.8),
      phone_confirmed: faker.datatype.boolean(0.9),
      referralCode: faker.string.alphanumeric(8),
      online: faker.datatype.boolean(0.3),
      lastSeen: faker.date.recent({ days: 7 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: new Date(),
    });
  }

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);
    await prisma.user.createMany({ data: batch, skipDuplicates: true });
    console.log(`   ${i + batch.length} کاربر ایجاد شد.`);
  }
  console.log(`✅ ${users.length} کاربر ایجاد شد.`);

  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const userIds = allUsers.map((u) => u.id);

  // ---------- مرحله ۲: ایجاد کیف پول و پروفایل ----------
  console.log("👛 ایجاد کیف پول و پروفایل برای کاربران...");
  const wallets = [];
  const profiles = [];
  for (const user of allUsers) {
    wallets.push({
      userId: user.id,
      balance: faker.number.int({ min: 100000, max: 5000000 }),
      heldBalance: faker.number.int({ min: 0, max: 500000 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: new Date(),
    });
    profiles.push({
      user: user.id,
      profileImage: faker.image.avatar(),
      address: faker.location.streetAddress(),
      educationLevel: faker.helpers.arrayElement([
        "دیپلم",
        "لیسانس",
        "فوق لیسانس",
        "دکتری",
      ]),
      aboutMe: faker.lorem.paragraph(),
      interests: [faker.person.jobArea(), faker.person.jobArea()],
      skills: [faker.person.jobArea(), faker.person.jobType()],
      resumeFile: faker.internet.url(),
      portfolioFiles: [faker.internet.url(), faker.internet.url()],
      documents: [{ title: faker.lorem.word(), file: faker.internet.url() }],
      completed: faker.datatype.boolean(0.7),
      updatedAt: faker.date.recent({ days: 30 }),
    });
  }

  for (let i = 0; i < wallets.length; i += BATCH_SIZE) {
    await prisma.wallet.createMany({
      data: wallets.slice(i, i + BATCH_SIZE),
      skipDuplicates: true,
    });
  }
  for (let i = 0; i < profiles.length; i += BATCH_SIZE) {
    await prisma.userProfile.createMany({
      data: profiles.slice(i, i + BATCH_SIZE),
      skipDuplicates: true,
    });
  }
  console.log(
    `✅ ${wallets.length} کیف پول و ${profiles.length} پروفایل ایجاد شد.`,
  );

  // ---------- مرحله ۳: تولید آگهی‌ها ----------
  // ۳-۱: آگهی کارفرما
  console.log("🏢 تولید آگهی‌های کارفرما...");
  const employerAds = [];
  for (let i = 0; i < CONFIG.ADS_PER_TYPE; i++) {
    const owner = randomItem(userIds);
    const { province, city } = getRandomProvinceAndCity();
    const jobCat = getRandomJobCategory();
    employerAds.push({
      owner,
      images: [{ url: faker.image.url(), isMain: true }],
      name: faker.company.name(),
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      categories: [{ name: jobCat.main, subCategories: [jobCat.sub] }],
      state: province,
      city,
      cooperationType: randomItem([
        "تمام وقت",
        "پاره وقت",
        "دورکاری",
        "پروژه‌ای",
      ]),
      gender: randomItem(["male", "female", "none"]),
      militaryStatus: randomItem(["done", "exempt", "none"]),
      experience: randomItem([
        "کمتر از ۱ سال",
        "۱ تا ۳ سال",
        "۳ تا ۵ سال",
        "بیش از ۵ سال",
      ]),
      paymentMethod: randomItem(["Bank_card", "Subscription", "Wallet"]),
      isRemote: faker.datatype.boolean(0.6),
      thursdayUntilNoon: faker.datatype.boolean(0.5),
      startTime: randomItem(["08:00", "09:00", "10:00"]),
      endTime: randomItem(["17:00", "18:00", "19:00"]),
      minSalary: faker.number.int({ min: 10, max: 100 }).toString(),
      maxSalary: faker.number.int({ min: 100, max: 500 }).toString(),
      companyName: faker.company.name(),
      companyType: randomItem(["خصوصی", "دولتی", "استارتاپ", "خوداشتغالی"]),
      benefits: faker.lorem.sentence(),
      insurance: faker.datatype.boolean(0.8) ? "دارد" : "ندارد",
      education: randomItem(["دیپلم", "لیسانس", "فوق لیسانس", "دکتری"]),
      companyDescription: faker.lorem.paragraph(),
      jobDetails: [
        { title: faker.lorem.word(), description: faker.lorem.sentence() },
      ],
      rating: {
        average: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
        count: faker.number.int({ min: 0, max: 50 }),
      },
      person: randomItem([PersonType.self, PersonType.other]),
      isVerified: faker.datatype.boolean(0.7),
      enableChat: faker.datatype.boolean(0.8),
      enablePhone: faker.datatype.boolean(0.5),
      adPaymentMethod: randomItem([
        PaymentMethod.Bank_card,
        PaymentMethod.Wallet,
      ]),
      adStatus: randomItem([
        AdStatus.pending,
        AdStatus.approved,
        AdStatus.rejected,
        AdStatus.expired,
      ]),
      approvedAt: faker.date.recent({ days: 30 }),
      expiresAt: faker.date.future({ years: 1 }),
      createdAt: faker.date.past({ years: 1 }),
    });
  }
  for (let i = 0; i < employerAds.length; i += BATCH_SIZE) {
    await prisma.employerAd.createMany({
      data: employerAds.slice(i, i + BATCH_SIZE),
    });
  }
  console.log(`✅ ${employerAds.length} آگهی کارفرما ایجاد شد.`);

  // ۳-۲: آگهی کاریابی
  console.log("👨‍💼 تولید آگهی‌های کاریابی...");
  const jobSeekerAds = [];
  for (let i = 0; i < CONFIG.ADS_PER_TYPE; i++) {
    const owner = randomItem(userIds);
    const { province, city } = getRandomProvinceAndCity();
    const jobCat = getRandomJobCategory();
    jobSeekerAds.push({
      owner,
      images: [{ url: faker.image.avatar(), isMain: true }],
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 60 }).toString(),
      gender: randomItem(["male", "female"]),
      maritalStatus: randomItem(["single", "married", "divorced"]),
      militaryStatus: randomItem(["done", "exempt", "none"]),
      phoneNumber: faker.phone.number({ style: "national" }),
      state: province,
      city,
      category: jobCat.sub,
      resumeFile: faker.internet.url(),
      workSampleFile: faker.internet.url(),
      education: randomItem(["دیپلم", "لیسانس", "فوق لیسانس"]),
      skills: [faker.person.jobArea(), faker.person.jobArea()],
      suggestedSalaryIRT: faker.number.int({ min: 30, max: 300 }).toString(),
      aboutMe: faker.lorem.paragraph(),
      instagram: faker.internet.username(),
      linkedIn: faker.internet.username(),
      gitHub: faker.internet.username(),
      careerHistory: [
        { title: faker.person.jobTitle(), description: faker.lorem.sentence() },
      ],
      rating: {
        average: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
        count: faker.number.int({ min: 0, max: 30 }),
      },
      person: randomItem([PersonType.self, PersonType.other]),
      isVerified: faker.datatype.boolean(0.6),
      enableChat: faker.datatype.boolean(0.9),
      enablePhone: faker.datatype.boolean(0.4),
      paymentMethod: randomItem([
        PaymentMethod.Bank_card,
        PaymentMethod.Wallet,
      ]),
      adStatus: randomItem([
        AdStatus.pending,
        AdStatus.approved,
        AdStatus.rejected,
        AdStatus.expired,
      ]),
      userDesc: faker.lorem.sentence(),
      approvedAt: faker.date.recent({ days: 30 }),
      expiresAt: faker.date.future({ years: 1 }),
      createdAt: faker.date.past({ years: 1 }),
    });
  }
  for (let i = 0; i < jobSeekerAds.length; i += BATCH_SIZE) {
    await prisma.jobSeekerAd.createMany({
      data: jobSeekerAds.slice(i, i + BATCH_SIZE),
    });
  }
  console.log(`✅ ${jobSeekerAds.length} آگهی کاریابی ایجاد شد.`);

  // ۳-۳: آگهی فروشنده
  console.log("🛍️ تولید آگهی‌های فروشنده...");
  const sellerAds = [];
  for (let i = 0; i < CONFIG.ADS_PER_TYPE; i++) {
    const owner = randomItem(userIds);
    const { province, city } = getRandomProvinceAndCity();
    const adCat = getRandomAdCategory();
    sellerAds.push({
      owner,
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: adCat.sub,
      state: province,
      city,
      application: randomItem(["نو", "کارکرده", "بازسازی"]),
      status: randomItem(["موجود", "ناموجود", "در حال بررسی"]),
      images: [{ url: faker.image.url(), isMain: true }],
      priceIRT: faker.number.int({ min: 100000, max: 10000000 }),
      isFixedPrice: faker.datatype.boolean(0.7),
      isNegotiable: faker.datatype.boolean(0.5),
      hasWarranty: faker.datatype.boolean(0.6),
      isShippable: faker.datatype.boolean(0.8),
      extraFeatures: {
        color: faker.color.human(),
        weight: faker.number.int({ min: 1, max: 10 }),
      },
      rating: {
        average: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
        count: faker.number.int({ min: 0, max: 40 }),
      },
      person: randomItem([PersonType.self, PersonType.other]),
      isVerified: faker.datatype.boolean(0.7),
      enableChat: faker.datatype.boolean(0.7),
      enablePhone: faker.datatype.boolean(0.6),
      paymentMethod: randomItem([
        PaymentMethod.Bank_card,
        PaymentMethod.Wallet,
      ]),
      adStatus: randomItem([
        AdStatus.pending,
        AdStatus.approved,
        AdStatus.rejected,
        AdStatus.expired,
      ]),
      approvedAt: faker.date.recent({ days: 30 }),
      expiresAt: faker.date.future({ years: 1 }),
      createdAt: faker.date.past({ years: 1 }),
    });
  }
  for (let i = 0; i < sellerAds.length; i += BATCH_SIZE) {
    await prisma.sellerAd.createMany({
      data: sellerAds.slice(i, i + BATCH_SIZE),
    });
  }
  console.log(`✅ ${sellerAds.length} آگهی فروشنده ایجاد شد.`);

  // ۳-۴: آگهی دیجیتال
  console.log("💻 تولید آگهی‌های دیجیتال...");
  const digitalAds = [];
  for (let i = 0; i < CONFIG.ADS_PER_TYPE; i++) {
    const owner = randomItem(userIds);
    const { province, city } = getRandomProvinceAndCity();
    digitalAds.push({
      owner,
      images: [{ url: faker.image.url(), isMain: true }],
      title: faker.lorem.sentence({ min: 2, max: 5 }),
      description: faker.lorem.paragraph(),
      digitalTotalDesc: faker.lorem.paragraph(),
      projectNames: [faker.lorem.word(), faker.lorem.word()],
      projectDescriptions: [faker.lorem.sentence(), faker.lorem.sentence()],
      minBudget: faker.number.int({ min: 10, max: 100 }).toString(),
      maxBudget: faker.number.int({ min: 100, max: 500 }).toString(),
      requiredSkills: [
        { name: faker.person.jobArea() },
        { name: faker.person.jobArea() },
      ],
      person: randomItem([PersonType.self, PersonType.other]),
      remote: faker.datatype.boolean(0.8),
      thursdayHalf: faker.datatype.boolean(0.5),
      paymentMethod: randomItem([
        PaymentMethod.Bank_card,
        PaymentMethod.Wallet,
      ]),
      adStatus: randomItem([
        AdStatus.pending,
        AdStatus.approved,
        AdStatus.rejected,
        AdStatus.expired,
      ]),
      requestType: randomItem(["requester", "provider"]),
      durationUnit: randomItem([TimeUnit.day, TimeUnit.month, TimeUnit.year]),
      durationAmount: faker.number.int({ min: 1, max: 12 }).toString(),
      approvedAt: faker.date.recent({ days: 30 }),
      expiresAt: faker.date.future({ years: 1 }),
      createdAt: faker.date.past({ years: 1 }),
    });
  }
  for (let i = 0; i < digitalAds.length; i += BATCH_SIZE) {
    await prisma.digitalAd.createMany({
      data: digitalAds.slice(i, i + BATCH_SIZE),
    });
  }
  console.log(`✅ ${digitalAds.length} آگهی دیجیتال ایجاد شد.`);

  // ---------- مرحله ۴: نشان‌ها، بازدیدها، نمایش‌های اخیر ----------
  console.log("⭐ تولید نشان‌ها، بازدیدها و نمایش‌های اخیر...");
  const allAdsEmployer = await prisma.employerAd.findMany({
    select: { id: true },
  });
  const allAdsJob = await prisma.jobSeekerAd.findMany({ select: { id: true } });
  const allAdsSeller = await prisma.sellerAd.findMany({ select: { id: true } });
  const allAdsDigital = await prisma.digitalAd.findMany({
    select: { id: true },
  });
  const adMap = {
    EmployerAd: allAdsEmployer,
    JobSeekerAd: allAdsJob,
    SellerAd: allAdsSeller,
    DigitalAd: allAdsDigital,
  };
  function getRandomAdId(adType: keyof typeof adMap): string | undefined {
    const list = adMap[adType];
    if (!list || list.length === 0) return undefined;
    return randomItem(list).id;
  }

  // نشان‌ها
  const marks = [];
  for (let i = 0; i < CONFIG.MARKS; i++) {
    const user = randomItem(allUsers);
    const adType = randomItem([
      "EmployerAd",
      "JobSeekerAd",
      "SellerAd",
      "DigitalAd",
    ]) as keyof typeof adMap;
    const adId = getRandomAdId(adType);
    if (!adId) continue;
    marks.push({
      userId: user.id,
      adId,
      adType: adType as AdType,
      type: randomItem([MarkType.favorite, MarkType.suspicious, MarkType.seen]),
      createdAt: faker.date.recent({ days: 60 }),
    });
  }
  if (marks.length) {
    for (let i = 0; i < marks.length; i += BATCH_SIZE) {
      await prisma.adMark.createMany({
        data: marks.slice(i, i + BATCH_SIZE),
        skipDuplicates: true,
      });
    }
    console.log(`✅ ${marks.length} نشان ایجاد شد.`);
  }

  // بازدیدها
  const views = [];
  for (let i = 0; i < CONFIG.VIEWS; i++) {
    const user = randomItem(allUsers);
    const adType = randomItem([
      "EmployerAd",
      "JobSeekerAd",
      "SellerAd",
      "DigitalAd",
    ]) as keyof typeof adMap;
    const adId = getRandomAdId(adType);
    if (!adId) continue;
    views.push({
      ownerId: user.id,
      adId,
      adType: adType as AdType,
      viewedAt: faker.date.recent({ days: 30 }),
    });
  }
  if (views.length) {
    for (let i = 0; i < views.length; i += BATCH_SIZE) {
      await prisma.adView.createMany({
        data: views.slice(i, i + BATCH_SIZE),
        skipDuplicates: true,
      });
    }
    console.log(`✅ ${views.length} بازدید ایجاد شد.`);
  }

  // نمایش‌های اخیر
  const recentViews = [];
  for (let i = 0; i < CONFIG.RECENT_VIEWS; i++) {
    const user = randomItem(allUsers);
    const adType = randomItem([
      "EmployerAd",
      "JobSeekerAd",
      "SellerAd",
      "DigitalAd",
    ]) as keyof typeof adMap;
    const adId = getRandomAdId(adType);
    if (!adId) continue;
    recentViews.push({
      user: user.id,
      ad: adId,
      adType: adType as AdType,
      viewedAt: faker.date.recent({ days: 7 }),
    });
  }
  if (recentViews.length) {
    for (let i = 0; i < recentViews.length; i += BATCH_SIZE) {
      await prisma.recentView.createMany({
        data: recentViews.slice(i, i + BATCH_SIZE),
        skipDuplicates: true,
      });
    }
    console.log(`✅ ${recentViews.length} نمایش اخیر ایجاد شد.`);
  }

  // ---------- مرحله ۵: مکالمات و پیام‌ها ----------
  console.log("💬 تولید مکالمات و پیام‌ها...");
  const conversations = [];
  for (let i = 0; i < CONFIG.CONVERSATIONS; i++) {
    const participants = faker.helpers
      .arrayElements(allUsers, faker.number.int({ min: 2, max: 4 }))
      .map((u) => u.id);
    const adType = randomItem([
      "EmployerAd",
      "JobSeekerAd",
      "SellerAd",
      "DigitalAd",
    ]) as keyof typeof adMap;
    const adId = getRandomAdId(adType);
    if (!adId) continue;
    conversations.push({
      participants,
      adId,
      adType,
      lastMessage: faker.lorem.sentence(),
      updatedAt: faker.date.recent({ days: 10 }),
      isBlocked: faker.datatype.boolean(0.1),
    });
  }
  const createdConversations = [];
  for (const conv of conversations) {
    const created = await prisma.conversation.create({ data: conv });
    createdConversations.push(created);
  }
  console.log(`✅ ${createdConversations.length} مکالمه ایجاد شد.`);

  const chats = [];
  for (const conv of createdConversations) {
    const participants = conv.participants;
    if (participants.length < 2) continue;
    const numMessages = faker.number.int({
      min: 1,
      max: CONFIG.CHATS_PER_CONV,
    });
    for (let i = 0; i < numMessages; i++) {
      const [from, to] = faker.helpers.shuffle(participants);
      chats.push({
        from,
        to,
        adId: conv.adId,
        adType: conv.adType as AdType,
        conversationId: conv.id,
        content: faker.lorem.sentence({ min: 3, max: 12 }),
        type: randomItem(["text", "image", "file"]),
        read: faker.datatype.boolean(0.7),
        createdAt: faker.date.between({ from: conv.updatedAt, to: new Date() }),
      });
    }
  }
  if (chats.length) {
    for (let i = 0; i < chats.length; i += BATCH_SIZE) {
      await prisma.chat.createMany({ data: chats.slice(i, i + BATCH_SIZE) });
    }
    console.log(`✅ ${chats.length} پیام ایجاد شد.`);
  }

  // ---------- مرحله ۶: تیکت‌ها و پاسخ‌ها ----------
  console.log("🎫 تولید تیکت‌های پشتیبانی...");
  const tickets = [];
  for (let i = 0; i < CONFIG.TICKETS; i++) {
    const user = randomItem(allUsers);
    tickets.push({
      user: user.id,
      email: faker.internet.email(),
      phone: faker.phone.number({ style: "national" }),
      title: faker.lorem.sentence({ min: 2, max: 5 }),
      description: faker.lorem.paragraph(),
      status: randomItem([
        TicketStatus.open,
        TicketStatus.in_progress,
        TicketStatus.closed,
      ]),
      statusHistory: [
        {
          status: TicketStatus.open,
          changedAt: faker.date.recent({ days: 5 }).toISOString(),
        },
      ],
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      updatedAt: faker.date.recent({ days: 5 }).toISOString(),
    });
  }
  for (let i = 0; i < tickets.length; i += BATCH_SIZE) {
    await prisma.ticket.createMany({ data: tickets.slice(i, i + BATCH_SIZE) });
  }
  console.log(`✅ ${tickets.length} تیکت ایجاد شد.`);

  const createdTickets = await prisma.ticket.findMany({
    select: { id: true, user: true },
  });
  const ticketReplies = [];
  for (let i = 0; i < CONFIG.TICKET_REPLIES; i++) {
    const ticket = randomItem(createdTickets);
    const user = randomItem(allUsers);
    ticketReplies.push({
      ticketId: ticket.id,
      userId: user.id,
      message: faker.lorem.paragraph(),
      isAdmin: faker.datatype.boolean(0.3),
      createdAt: faker.date.recent({ days: 3 }),
    });
  }
  if (ticketReplies.length) {
    for (let i = 0; i < ticketReplies.length; i += BATCH_SIZE) {
      await prisma.ticketReply.createMany({
        data: ticketReplies.slice(i, i + BATCH_SIZE),
      });
    }
    console.log(`✅ ${ticketReplies.length} پاسخ تیکت ایجاد شد.`);
  }

  // ---------- مرحله ۷: رزومه‌ها ----------
  console.log("📄 تولید رزومه‌ها...");
  const resumes = [];
  const usersForResume = faker.helpers.arrayElements(
    allUsers,
    Math.min(CONFIG.RESUMES, allUsers.length),
  );
  for (const user of usersForResume) {
    const { province, city } = getRandomProvinceAndCity();
    resumes.push({
      userId: user.id,
      updateCount: faker.number.int({ min: 0, max: 5 }),
      fullName: faker.person.fullName(),
      phoneNumber: faker.phone.number({ style: "national" }),
      birthDate: faker.date
        .birthdate({ min: 18, max: 60, mode: "age" })
        .toLocaleDateString("fa-IR"),
      gender: randomItem(["male", "female"]),
      maritalStatus: randomItem(["single", "married", "divorced"]),
      address: faker.location.streetAddress(),
      expectedSalary: faker.number.int({ min: 50, max: 500 }).toString(),
      cooperationType: randomItem(["تمام وقت", "پاره وقت", "دورکاری"]),
      hasInsuranceHistory: faker.datatype.boolean(0.6),
      willingToGoOnMission: faker.datatype.boolean(0.4),
      skills: [
        faker.person.jobArea(),
        faker.person.jobArea(),
        faker.person.jobArea(),
      ],
      education: [
        {
          major: faker.person.jobArea(),
          university: faker.company.name(),
          gpa: faker.number
            .float({ min: 12, max: 20, fractionDigits: 1 })
            .toString(),
        },
      ],
      workExperience: [
        {
          jobTitle: faker.person.jobTitle(),
          companyName: faker.company.name(),
          duration: "۲ سال",
        },
      ],
      certificates: [
        {
          title: faker.lorem.word(),
          provider: faker.company.name(),
          date: faker.date.past({ years: 2 }).toISOString(),
        },
      ],
      fileUrl: faker.internet.url(),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
    });
  }
  if (resumes.length) {
    for (let i = 0; i < resumes.length; i += BATCH_SIZE) {
      await prisma.resume.createMany({
        data: resumes.slice(i, i + BATCH_SIZE),
      });
    }
    console.log(`✅ ${resumes.length} رزومه ایجاد شد.`);
  }

  // ---------- مرحله ۸: گزارش‌ها ----------
  console.log("📢 تولید گزارش‌ها...");
  const reportReasons = await prisma.reportReason.findMany({
    select: { id: true, key: true, type: true },
  });
  let reports: any[] = [];
  if (reportReasons.length === 0) {
    console.warn(
      "⚠️ هیچ دلیلی برای گزارش یافت نشد. لطفاً ابتدا seedReportReasons را اجرا کنید.",
    );
  } else {
    for (let i = 0; i < CONFIG.REPORTS; i++) {
      const reporter = randomItem(allUsers);
      const reason = randomItem(reportReasons);
      const targetType = randomItem([
        ReportType.employerAd,
        ReportType.jobSeekerAd,
        ReportType.sellerAd,
        ReportType.DigitalAd,
        ReportType.chat,
      ]);
      let targetId = "";
      if (targetType === ReportType.chat) {
        const chat = await prisma.chat.findFirst({ select: { id: true } });
        if (chat) targetId = chat.id;
        else continue;
      } else {
        const adTypeMap = {
          [ReportType.employerAd]: "EmployerAd",
          [ReportType.jobSeekerAd]: "JobSeekerAd",
          [ReportType.sellerAd]: "SellerAd",
          [ReportType.DigitalAd]: "DigitalAd",
        } as const;
        const adType = adTypeMap[targetType] as keyof typeof adMap;
        const adId = getRandomAdId(adType);
        if (!adId) continue;
        targetId = adId;
      }
      reports.push({
        reporterUserId: reporter.id,
        targetId,
        reportType: targetType,
        reason: reason.key,
        description: faker.lorem.paragraph(),
        status: randomItem([
          ReportStatus.pending,
          ReportStatus.reviewed,
          ReportStatus.rejected,
        ]),
        createdAt: faker.date.recent({ days: 20 }),
        updatedAt: faker.date.recent({ days: 5 }),
      });
    }
    if (reports.length) {
      for (let i = 0; i < reports.length; i += BATCH_SIZE) {
        await prisma.report.createMany({
          data: reports.slice(i, i + BATCH_SIZE),
        });
      }
      console.log(`✅ ${reports.length} گزارش ایجاد شد.`);
    }
  }

  // ---------- مرحله ۹: لاگ‌های ابزار ----------
  console.log("🛠️ تولید لاگ‌های ابزار...");
  const toolLogs = [];
  for (let i = 0; i < CONFIG.TOOL_LOGS; i++) {
    const user = randomItem(allUsers);
    toolLogs.push({
      userId: user.id,
      toolName: randomItem([
        "convert-image",
        "merge-pdf",
        "compress-pdf",
        "resize-image",
        "watermark",
      ]),
      status: randomItem(["success", "failed"]),
      errorMessage: faker.datatype.boolean(0.2) ? faker.lorem.sentence() : null,
      metadata: {
        inputSize: faker.number.int({ min: 100, max: 5000 }),
        outputSize: faker.number.int({ min: 50, max: 2000 }),
      },
      durationMs: faker.number.int({ min: 100, max: 5000 }),
      ip: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      createdAt: faker.date.recent({ days: 10 }),
      updatedAt: faker.date.recent({ days: 5 }),
    });
  }
  if (toolLogs.length) {
    for (let i = 0; i < toolLogs.length; i += BATCH_SIZE) {
      await prisma.toolUsageLog.createMany({
        data: toolLogs.slice(i, i + BATCH_SIZE),
      });
    }
    console.log(`✅ ${toolLogs.length} لاگ ابزار ایجاد شد.`);
  }

  // ---------- مرحله ۱۰: داده‌های آزمون ----------
  console.log("🧪 تولید داده‌های آزمون...");
  // ۱۰-۱: دسته‌بندی تست
  const testCategories = [];
  for (let i = 0; i < CONFIG.TEST_CATEGORIES; i++) {
    testCategories.push({
      name: faker.lorem.word() + " " + i,
      description: faker.lorem.sentence(),
      icon: faker.internet.emoji(),
      isActive: faker.datatype.boolean(0.9),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
    });
  }
  await prisma.testCategory.createMany({ data: testCategories });
  console.log(`✅ ${testCategories.length} دسته‌بندی تست ایجاد شد.`);

  const createdTestCategories = await prisma.testCategory.findMany({
    select: { id: true },
  });

  // ۱۰-۲: نوع تست
  const testTypes = [];
  for (const cat of createdTestCategories) {
    for (let j = 0; j < CONFIG.TEST_TYPES_PER_CAT; j++) {
      testTypes.push({
        categoryId: cat.id,
        name: faker.lorem.words(2) + " " + j,
        tags: [faker.lorem.word(), faker.lorem.word()],
        description: faker.lorem.sentence(),
        scoringMethod: randomItem([
          ScoringMethod.weighted_level,
          ScoringMethod.trait_accumulation,
          ScoringMethod.forced_choice_mbti,
          ScoringMethod.likert_sum,
          ScoringMethod.mbti_polar,
        ]),
        dimensions: [faker.lorem.word(), faker.lorem.word()],
        blueprint: {
          structure: { a: 1, b: 2 },
          levelWeights: { beginner: 0.3, intermediate: 0.5, advanced: 0.2 },
          totalQuestions: 10,
          timeLimit: 600,
        },
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent({ days: 30 }),
      });
    }
  }
  await prisma.testType.createMany({ data: testTypes });
  console.log(`✅ ${testTypes.length} نوع تست ایجاد شد.`);

  const createdTestTypes = await prisma.testType.findMany({
    select: { id: true },
  });

  // ۱۰-۳: سوالات
  const questionsData = [];
  for (const type of createdTestTypes) {
    for (let i = 0; i < CONFIG.QUESTIONS_PER_TYPE; i++) {
      questionsData.push({
        typeId: type.id,
        subject: faker.lorem.word(),
        level: randomItem(["beginner", "intermediate", "advanced"]),
        questionText: faker.lorem.sentence({ min: 5, max: 15 }),
        options: [
          {
            text: faker.lorem.word(),
            value: faker.number.int({ min: 0, max: 5 }),
            isCorrect: faker.datatype.boolean(0.25),
            traitPoints: { a: 1 },
          },
          {
            text: faker.lorem.word(),
            value: faker.number.int({ min: 0, max: 5 }),
            isCorrect: faker.datatype.boolean(0.25),
            traitPoints: { b: 2 },
          },
          {
            text: faker.lorem.word(),
            value: faker.number.int({ min: 0, max: 5 }),
            isCorrect: faker.datatype.boolean(0.25),
            traitPoints: { c: 3 },
          },
          {
            text: faker.lorem.word(),
            value: faker.number.int({ min: 0, max: 5 }),
            isCorrect: faker.datatype.boolean(0.25),
            traitPoints: { d: 4 },
          },
        ],
        dimension: randomItem([
          "introvert",
          "extrovert",
          "thinking",
          "feeling",
        ]),
        isReverseScored: faker.datatype.boolean(0.2),
        explanation: faker.lorem.paragraph(),
        createdAt: faker.date.past({ years: 1 }),
        metadata: { difficulty: faker.number.int({ min: 1, max: 5 }) },
      });
    }
  }
  if (questionsData.length) {
    for (let i = 0; i < questionsData.length; i += BATCH_SIZE) {
      await prisma.question.createMany({
        data: questionsData.slice(i, i + BATCH_SIZE),
      });
    }
    console.log(`✅ ${questionsData.length} سوال ایجاد شد.`);
  }

  // دریافت سوالات ایجادشده برای استفاده در جلسات تست
  const createdQuestions = await prisma.question.findMany({
    where: { typeId: { in: createdTestTypes.map((t) => t.id) } },
    select: { id: true, dimension: true, subject: true, level: true },
  });

  // ۱۰-۴: جلسات تست
  console.log("📝 تولید جلسات تست...");
  const testSessions = [];
  for (let i = 0; i < CONFIG.TEST_SESSIONS; i++) {
    const user = randomItem(allUsers);
    const type = randomItem(createdTestTypes);
    const questionsForSession = faker.helpers.arrayElements(
      createdQuestions,
      faker.number.int({ min: 3, max: 6 }),
    );
    testSessions.push({
      userId: user.id,
      typeId: type.id,
      questions: questionsForSession.map((q) => ({
        questionId: q.id,
        userAnswer: faker.number.int({ min: 0, max: 3 }),
        isCorrect: faker.datatype.boolean(0.5),
        pointsEarned: faker.number.int({ min: 0, max: 5 }),
        dimension: q.dimension,
        subject: q.subject,
        level: q.level,
      })),
      score: faker.number.int({ min: 0, max: 100 }),
      assignedLevel: randomItem(["A", "B", "C"]),
      levelResults: { beginner: faker.number.int({ min: 0, max: 10 }) },
      status: randomItem([
        TestSessionStatus.in_progress,
        TestSessionStatus.completed,
      ]),
      startedAt: faker.date.past({ years: 1 }),
      finishedAt: faker.date.recent({ days: 3 }),
      quickResult: { summary: faker.lorem.sentence() },
      detailedResult: { details: faker.lorem.paragraph() },
    });
  }
  if (testSessions.length) {
    for (let i = 0; i < testSessions.length; i += BATCH_SIZE) {
      await prisma.testSession.createMany({
        data: testSessions.slice(i, i + BATCH_SIZE),
      });
    }
    console.log(`✅ ${testSessions.length} جلسه تست ایجاد شد.`);
  }

  // ---------- مرحله ۱۱: ارتقاء آگهی ----------
  console.log("⭐ تولید ارتقاء آگهی...");
  const allAdIds = [
    ...allAdsEmployer.map((a) => ({ id: a.id, type: AdType.EmployerAd })),
    ...allAdsJob.map((a) => ({ id: a.id, type: AdType.JobSeekerAd })),
    ...allAdsSeller.map((a) => ({ id: a.id, type: AdType.SellerAd })),
    ...allAdsDigital.map((a) => ({ id: a.id, type: AdType.DigitalAd })),
  ];
  const enhancements = [];
  for (let i = 0; i < CONFIG.AD_ENHANCEMENTS; i++) {
    const ad = randomItem(allAdIds);
    if (!ad) continue;
    enhancements.push({
      adId: ad.id,
      adType: ad.type,
      isSpecial: faker.datatype.boolean(0.3),
      specialStartDate: faker.date.recent({ days: 30 }),
      specialEndDate: faker.date.future({ years: 1 }),
      isStepped: faker.datatype.boolean(0.2),
      stepScheduledAt: faker.date.future({ years: 1 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 10 }),
    });
  }
  if (enhancements.length) {
    for (let i = 0; i < enhancements.length; i += BATCH_SIZE) {
      await prisma.adEnhancement.createMany({
        data: enhancements.slice(i, i + BATCH_SIZE),
      });
    }
    console.log(`✅ ${enhancements.length} ارتقاء آگهی ایجاد شد.`);
  }

  // ---------- مرحله ۱۲: داده‌های پیشنهادات ----------
  console.log("💡 تولید داده‌های پیشنهادات...");
  // ۱۲-۱: نمایش پیشنهادات
  const suggestionViews = [];
  for (let i = 0; i < CONFIG.SUGGESTION_VIEWS; i++) {
    const user = randomItem(allUsers);
    const adType = randomItem([
      "EmployerAd",
      "JobSeekerAd",
      "SellerAd",
      "DigitalAd",
    ]) as keyof typeof adMap;
    const adId = getRandomAdId(adType);
    if (!adId) continue;
    suggestionViews.push({
      userId: user.id,
      adId,
      adType: adType as AdType,
      viewedAt: faker.date.recent({ days: 5 }),
    });
  }
  if (suggestionViews.length) {
    for (let i = 0; i < suggestionViews.length; i += BATCH_SIZE) {
      await prisma.suggestionView.createMany({
        data: suggestionViews.slice(i, i + BATCH_SIZE),
        skipDuplicates: true,
      });
    }
    console.log(`✅ ${suggestionViews.length} نمایش پیشنهاد ایجاد شد.`);
  }

  // ۱۲-۲: تنظیمات پیشنهاد کاربر
  const suggestionPrefs = [];
  const usersForPref = faker.helpers.arrayElements(
    allUsers,
    Math.min(CONFIG.SUGGESTION_PREFS, allUsers.length),
  );
  for (const user of usersForPref) {
    suggestionPrefs.push({
      userId: user.id,
      totalAllowed: faker.number.int({ min: 50, max: 200 }),
      resetPeriod: randomItem(["daily", "weekly", "monthly", "never"]),
      lastResetDate: faker.date.recent({ days: 10 }),
      preferredAdTypes: faker.helpers.arrayElements(
        [
          AdType.EmployerAd,
          AdType.JobSeekerAd,
          AdType.SellerAd,
          AdType.DigitalAd,
        ],
        faker.number.int({ min: 0, max: 3 }),
      ),
      preferredCategories: faker.helpers.arrayElements(
        ["برنامه‌نویسی", "طراحی", "بازاریابی", "مدیریت"],
        faker.number.int({ min: 0, max: 2 }),
      ),
      filterWeights: {
        location: faker.number.float({ min: 0, max: 1, fractionDigits: 1 }),
        skills: faker.number.float({ min: 0, max: 1, fractionDigits: 1 }),
      },
      isActive: faker.datatype.boolean(0.9),
    });
  }
  if (suggestionPrefs.length) {
    for (let i = 0; i < suggestionPrefs.length; i += BATCH_SIZE) {
      await prisma.userSuggestionPreference.createMany({
        data: suggestionPrefs.slice(i, i + BATCH_SIZE),
        skipDuplicates: true,
      });
    }
    console.log(`✅ ${suggestionPrefs.length} تنظیمات پیشنهاد ایجاد شد.`);
  }

  // ۱۲-۳: محدودیت روزانه
  const dailyLimits = [];
  const usersForLimit = faker.helpers.arrayElements(
    allUsers,
    Math.min(CONFIG.DAILY_LIMITS, allUsers.length),
  );
  for (const user of usersForLimit) {
    dailyLimits.push({
      userId: user.id,
      date: faker.date.recent({ days: 7 }),
      countUsed: faker.number.int({ min: 0, max: 20 }),
      dailyLimit: faker.number.int({ min: 10, max: 30 }),
    });
  }
  if (dailyLimits.length) {
    for (let i = 0; i < dailyLimits.length; i += BATCH_SIZE) {
      await prisma.suggestionDailyLimit.createMany({
        data: dailyLimits.slice(i, i + BATCH_SIZE),
        skipDuplicates: true,
      });
    }
    console.log(`✅ ${dailyLimits.length} محدودیت روزانه ایجاد شد.`);
  }

  // ۱۲-۴: کش پیشنهادات
  const cachedSuggestions = [];
  const usersForCache = faker.helpers.arrayElements(
    allUsers,
    Math.min(CONFIG.CACHED_SUGGESTIONS, allUsers.length),
  );
  for (const user of usersForCache) {
    const adIds = faker.helpers.arrayElements(
      allAdIds,
      faker.number.int({ min: 2, max: 10 }),
    );
    cachedSuggestions.push({
      userId: user.id,
      suggestionIds: adIds.map((a) => ({ adId: a.id, adType: a.type })),
      generatedAt: faker.date.recent({ days: 1 }),
      expiresAt: faker.date.future({ years: 1 }),
    });
  }
  if (cachedSuggestions.length) {
    for (let i = 0; i < cachedSuggestions.length; i += BATCH_SIZE) {
      await prisma.cachedUserSuggestions.createMany({
        data: cachedSuggestions.slice(i, i + BATCH_SIZE),
        skipDuplicates: true,
      });
    }
    console.log(`✅ ${cachedSuggestions.length} کش پیشنهادات ایجاد شد.`);
  }

  // ---------- خلاصه نهایی ----------
  console.log("🎉 تولید داده‌های حجیم کامل با موفقیت انجام شد!");
  console.log(`📊 خلاصه نهایی:
    - کاربران: ${CONFIG.USERS}
    - کیف پول: ${wallets.length}
    - پروفایل: ${profiles.length}
    - آگهی‌ها: کارفرما ${employerAds.length}, کاریابی ${jobSeekerAds.length}, فروشنده ${sellerAds.length}, دیجیتال ${digitalAds.length}
    - نشان‌ها: ${marks.length}
    - بازدیدها: ${views.length}
    - نمایش‌های اخیر: ${recentViews.length}
    - مکالمات: ${createdConversations.length}
    - پیام‌ها: ${chats.length}
    - تیکت‌ها: ${tickets.length}
    - پاسخ تیکت: ${ticketReplies.length}
    - رزومه: ${resumes.length}
    - گزارش‌ها: ${reports.length}
    - لاگ ابزار: ${toolLogs.length}
    - دسته‌بندی تست: ${testCategories.length}
    - نوع تست: ${testTypes.length}
    - سوالات: ${questionsData.length}
    - جلسات تست: ${testSessions.length}
    - ارتقاء آگهی: ${enhancements.length}
    - نمایش پیشنهاد: ${suggestionViews.length}
    - تنظیمات پیشنهاد: ${suggestionPrefs.length}
    - محدودیت روزانه: ${dailyLimits.length}
    - کش پیشنهادات: ${cachedSuggestions.length}
  `);
}

// ============================================
// اجرا و مدیریت خطا
// ============================================
seedBulkData()
  .catch((e) => {
    console.error("❌ خطا در اجرای seed حجیم:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 اتصال دیتابیس بسته شد.");
  });
