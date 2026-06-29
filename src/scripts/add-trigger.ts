import prisma from "../config/prisma";

async function main() {
  console.log("🚀 در حال اجرای اسکریپت تنظیم تریگر...");

  const sql = `
    CREATE OR REPLACE FUNCTION set_approval_dates()
    RETURNS TRIGGER AS $$
    BEGIN
        IF NEW."adStatus" = 'approved' AND OLD."adStatus" != 'approved' THEN
            NEW."approvedAt" = NOW();
            NEW."expiresAt" = NOW() + INTERVAL '37 days';
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trigger_jobseeker_ad_approval ON "JobSeekerAd";
    CREATE TRIGGER trigger_jobseeker_ad_approval
    BEFORE UPDATE ON "JobSeekerAd"
    FOR EACH ROW
    EXECUTE FUNCTION set_approval_dates();

    DROP TRIGGER IF EXISTS trigger_employer_ad_approval ON "EmployerAd";
    CREATE TRIGGER trigger_employer_ad_approval
    BEFORE UPDATE ON "EmployerAd"
    FOR EACH ROW
    EXECUTE FUNCTION set_approval_dates();

    DROP TRIGGER IF EXISTS trigger_seller_ad_approval ON "SellerAd";
    CREATE TRIGGER trigger_seller_ad_approval
    BEFORE UPDATE ON "SellerAd"
    FOR EACH ROW
    EXECUTE FUNCTION set_approval_dates();

    DROP TRIGGER IF EXISTS trigger_digital_ad_approval ON "DigitalAd";
    CREATE TRIGGER trigger_digital_ad_approval
    BEFORE UPDATE ON "DigitalAd"
    FOR EACH ROW
    EXECUTE FUNCTION set_approval_dates();
  `;

  await prisma.$executeRawUnsafe(sql);
  console.log("✅ تریگر با موفقیت روی دیتابیس اعمال شد.");
}

// اجرا با مدیریت خطا
main()
  .then(() => {
    console.log("✅ اسکریپت با موفقیت پایان یافت.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ خطا در اجرای اسکریپت:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
