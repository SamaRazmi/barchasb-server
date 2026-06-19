const Question = require('../../../models/Question');

const SqlQuestions = async (typeId) => {
    const rawQuestions = [
        // ==========================================
        // A1: Basic Syntax (5) & Filtering (5)
        // ==========================================
        { text: "SQL چیست؟", subject: "BasicSyntax", level: "A1", opts: ["زبان پرس‌وجوی ساخت‌یافته برای مدیریت پایگاه داده", "زبان برنامه‌نویسی سمت سرور", "سیستم عامل دیتابیس", "فریم‌ورک جاوااسکریپت"], ans: 0 },
        { text: "تفاوت DDL و DML در SQL چیست؟", subject: "BasicSyntax", level: "A1", opts: ["DDL برای تعریف ساختار (مثل Create) و DML برای مدیریت داده‌ها (مثل Insert) است", "هر دو یکی هستند", "DDL برای حذف داده و DML برای ایجاد است", "DDL فقط در MySQL استفاده می‌شود"], ans: 0 },
        { text: "کدام دستور برای تغییر ساختار یک جدول (مثل اضافه کردن ستون) به کار می‌رود؟", subject: "BasicSyntax", level: "A1", opts: ["ALTER TABLE", "UPDATE TABLE", "CHANGE TABLE", "MODIFY TABLE"], ans: 0 },
        { text: "دستور DISTINCT چه کاربردی در SELECT دارد؟", subject: "BasicSyntax", level: "A1", opts: ["حذف مقادیر تکراری از نتایج", "مرتب‌سازی نتایج", "فیلتر کردن بر اساس شرط", "جمع زدن مقادیر"], ans: 0 },
        { text: "تفاوت DROP و TRUNCATE چیست؟", subject: "BasicSyntax", level: "A1", opts: ["DROP جدول و ساختار را حذف می‌کند، TRUNCATE فقط داده‌ها را پاک می‌کند", "هر دو یکی هستند", "TRUNCATE سرعت کمتری دارد", "DROP فقط رکوردها را پاک می‌کند"], ans: 0 },

        { text: "عملگر WHERE در SQL چه وظیفه‌ای دارد؟", subject: "Filtering", level: "A1", opts: ["فیلتر کردن رکوردها بر اساس یک شرط خاص", "مرتب‌سازی داده‌ها", "گروه‌بندی داده‌ها", "اتصال دو جدول"], ans: 0 },
        { text: "برای جستجوی یک الگو در متن (مثلاً نام‌هایی که با 'A' شروع می‌شوند) از کدام عملگر استفاده می‌شود؟", subject: "Filtering", level: "A1", opts: ["LIKE", "IN", "BETWEEN", "EXISTS"], ans: 0 },
        { text: "تفاوت عملگر BETWEEN و IN چیست؟", subject: "Filtering", level: "A1", opts: ["BETWEEN برای بازه عددی/تاریخی و IN برای چک کردن در یک لیست مشخص است", "تفاوتی ندارند", "IN فقط برای اعداد است", "BETWEEN فقط برای متن است"], ans: 0 },
        { text: "برای چک کردن مقادیری که مقدار ندارند (خالی هستند) از چه عبارتی استفاده می‌شود؟", subject: "Filtering", level: "A1", opts: ["IS NULL", "= NULL", "EMPTY", "IS NOT DEFINED"], ans: 0 },
        { text: "عملگر AND نسبت به OR در اولویت اجرا چگونه است؟", subject: "Filtering", level: "A1", opts: ["AND اولویت بالاتری دارد", "OR اولویت بالاتری دارد", "هر دو هم‌زمان اجرا می‌شوند", "بستگی به تنظیمات دیتابیس دارد"], ans: 0 },

        // ==========================================
        // A2: Joins (5) & Aggregations (5)
        // ==========================================
        
        { text: "INNER JOIN چه رکوردهایی را بازمی‌گرداند؟", subject: "Joins", level: "A2", opts: ["فقط رکوردهایی که در هر دو جدول مطابقت دارند", "تمام رکوردهای جدول سمت چپ", "تمام رکوردهای هر دو جدول", "رکوردهایی که مطابقت ندارند"], ans: 0 },
        { text: "تفاوت LEFT JOIN و RIGHT JOIN چیست؟", subject: "Joins", level: "A2", opts: ["LEFT تمام داده‌های جدول چپ را می‌آورد، RIGHT تمام داده‌های جدول راست را", "تفاوتی در نتیجه نهایی ندارند", "LEFT فقط داده‌های مشترک را می‌آورد", "RIGHT سریع‌تر از LEFT است"], ans: 0 },
        { text: "FULL OUTER JOIN چه زمانی استفاده می‌شود؟", subject: "Joins", level: "A2", opts: ["وقتی بخواهیم تمام رکوردهای هر دو جدول (چه با مطابقت و چه بدون آن) را داشته باشیم", "برای ترکیب دو جدول کاملاً متفاوت", "فقط برای جداول دارای کلید خارجی", "برای حذف رکوردهای تکراری"], ans: 0 },
        { text: "Self Join به چه معناست؟", subject: "Joins", level: "A2", opts: ["اتصال یک جدول به خودش (مثلاً برای ساختار سلسله مراتبی)", "اتصال دیتابیس به اپلیکیشن", "جوین کردن دو نسخه از یک دیتابیس", "استفاده از چندین JOIN در یک کوئری"], ans: 0 },
        { text: "CROSS JOIN (حاصل‌ضرب دکارتی) چه خروجی‌ای تولید می‌کند؟", subject: "Joins", level: "A2", opts: ["ترکیب تمام ردیف‌های جدول اول با تمام ردیف‌های جدول دوم", "فقط ردیف‌های مشترک", "ترکیب ستون‌های هم‌نام", "خطا می‌دهد"], ans: 0 },

        { text: "توابع تجمعی (Aggregate Functions) مثل SUM و AVG روی چه چیزی عمل می‌کنند؟", subject: "Aggregations", level: "A2", opts: ["روی مجموعه‌ای از مقادیر و بازگرداندن یک مقدار واحد", "روی هر ردیف به صورت مجزا", "فقط روی کلیدهای اصلی", "برای تغییر ساختار جدول"], ans: 0 },
        { text: "تفاوت COUNT(*) و COUNT(column_name) چیست؟", subject: "Aggregations", level: "A2", opts: ["(*) تمام ردیف‌ها را می‌شمارد، اما ذکر ستون فقط مقادیر غیر NULL را می‌شمارد", "تفاوتی ندارند", "(*) سریع‌تر است", "ذکر ستون فقط مقادیر تکراری را می‌شمارد"], ans: 0 },
        { text: "شرط روی توابع تجمعی (بعد از GROUP BY) با کدام دستور اعمال می‌شود؟", subject: "Aggregations", level: "A2", opts: ["HAVING", "WHERE", "ORDER BY", "LIMIT"], ans: 0 },
        { text: "GROUP BY چه زمانی استفاده می‌شود؟", subject: "Aggregations", level: "A2", opts: ["برای دسته‌بندی سطرها بر اساس یک یا چند ستون جهت محاسبات تجمعی", "برای مرتب کردن حروف الفبا", "برای حذف ردیف‌های تکراری", "برای ایجاد ایندکس"], ans: 0 },
        { text: "اگر در SELECT از تابع تجمعی استفاده شود، تکلیف ستون‌های معمولی چیست؟", subject: "Aggregations", level: "A2", opts: ["باید حتماً در بخش GROUP BY ذکر شوند", "نیازی به ذکر آن‌ها نیست", "باید حذف شوند", "باید به رشته تبدیل شوند"], ans: 0 },

        // ==========================================
        // B1: CRUD (5) & Subqueries (5)
        // ==========================================
        { text: "در دستور UPDATE، اگر WHERE فراموش شود چه اتفاقی می‌افتد؟", subject: "CRUD", level: "B1", opts: ["تمام رکوردهای آن ستون در جدول تغییر می‌کنند", "هیچ اتفاقی نمی‌افتد", "فقط رکورد اول تغییر می‌کند", "دیتابیس خطا می‌دهد"], ans: 0 },
        { text: "تفاوت INSERT INTO ... SELECT با INSERT معمولی چیست؟", subject: "CRUD", level: "B1", opts: ["داده‌ها را از یک جدول دیگر خوانده و در جدول فعلی درج می‌کند", "فقط برای جداول موقت است", "امنیت بالاتری دارد", "داده‌ها را به صورت تصادفی درج می‌کند"], ans: 0 },
        { text: "دستور DELETE FROM بدون شرط WHERE چه عملکردی دارد؟", subject: "CRUD", level: "B1", opts: ["تمام رکوردهای جدول را حذف می‌کند اما ساختار جدول باقی می‌ماند", "جدول را کاملاً حذف می‌کند", "خطای سینتکس می‌دهد", "فقط رکوردهای تکراری را پاک می‌کند"], ans: 0 },
        { text: "COALESCE چه کاربردی در مدیریت داده‌ها دارد؟", subject: "CRUD", level: "B1", opts: ["بازگرداندن اولین مقدار غیر NULL از لیست ورودی‌ها", "جمع زدن مقادیر NULL", "تغییر مقدار NULL به صفر در کل دیتابیس", "مقایسه دو رشته متنی"], ans: 0 },
        { text: "دستور CASE در SQL مشابه کدام ساختار در برنامه‌نویسی است؟", subject: "CRUD", level: "B1", opts: ["if-else یا switch-case", "for loop", "try-catch", "while loop"], ans: 0 },

        { text: "Subquery (پرس‌وجوی تودرتو) چیست؟", subject: "Subqueries", level: "B1", opts: ["یک دستور SELECT که داخل یک دستور دیگر (مثل WHERE یا FROM) قرار دارد", "یک دیتابیس کوچک داخل دیتابیس اصلی", "یک تابع از پیش تعریف شده", "یک نوع ایندکس"], ans: 0 },
        { text: "تفاوت Scalar Subquery با Table Subquery چیست؟", subject: "Subqueries", level: "B1", opts: ["Scalar فقط یک مقدار واحد و Table یک مجموعه از ردیف‌ها را برمی‌گرداند", "تفاوتی ندارند", "Scalar سریع‌تر است", "Table فقط در JOIN استفاده می‌شود"], ans: 0 },
        { text: "عملگر EXISTS در Subqueryها چه وظیفه‌ای دارد؟", subject: "Subqueries", level: "B1", opts: ["بررسی وجود حداقل یک رکورد در خروجی Subquery (بدون بازگرداندن داده)", "جستجوی متن", "حذف رکوردهای مشابه", "جمع مقادیر"], ans: 0 },
        { text: "Correlated Subquery به چه معناست؟", subject: "Subqueries", level: "B1", opts: ["پرس‌وجوی داخلی که برای اجرا به مقادیر پرس‌وجوی بیرونی وابسته است", "پرس‌وجویی که مستقل اجرا می‌شود", "یک Subquery که در بخش FROM است", "پرس‌وجویی که نتایج را کش می‌کند"], ans: 0 },
        { text: "چه زمانی استفاده از JOIN بهتر از Subquery است؟", subject: "Subqueries", level: "B1", opts: ["معمولاً برای حجم داده بالا، JOIN بهینه تر عمل می‌کند (توسط Optimizer)", "همیشه Subquery بهتر است", "وقتی داده‌ها NULL باشند", "وقتی نخواهیم از Primary Key استفاده کنیم"], ans: 0 },

        // ==========================================
        // B2: Schema Design (5) & Constraints (5)
        // ==========================================
        
        { text: "هدف اصلی از نرمال‌سازی (Normalization) چیست؟", subject: "SchemaDesign", level: "B2", opts: ["کاهش تکرار داده‌ها (Redundancy) و حفظ یکپارچگی", "افزایش حجم دیتابیس", "سخت‌تر کردن کوئری‌ها", "فشرده‌سازی فایل‌های دیتابیس"], ans: 0 },
        { text: "قاعده 1NF (فرم اول نرمال) بر چه چیزی تاکید دارد؟", subject: "SchemaDesign", level: "B2", opts: ["اتمیک بودن مقادیر (هر سلول فقط یک مقدار) و نبود گروه‌های تکراری", "داشتن کلید خارجی", "نبود وابستگی انتقالی", "سرعت بالای جستجو"], ans: 0 },
        { text: "Denormalization در چه شرایطی انجام می‌شود؟", subject: "SchemaDesign", level: "B2", opts: ["برای افزایش سرعت خواندن (Read) در سیستم‌های OLAP با قبول تکرار داده", "برای کاهش فضای دیسک", "در ابتدای طراحی دیتابیس", "برای امنیت بیشتر"], ans: 0 },
        { text: "تفاوت پایگاه داده‌های OLTP و OLAP در طراحی چیست؟", subject: "SchemaDesign", level: "B2", opts: ["OLTP برای تراکنش‌های سریع و روزمره، OLAP برای تحلیل داده‌های حجیم", "تفاوتی ندارند", "OLAP فقط برای SQL Server است", "OLTP بدون ایندکس کار می‌کند"], ans: 0 },
        { text: "در مدل‌سازی داده، رابطه Many-to-Many چگونه پیاده‌سازی می‌شود؟", subject: "SchemaDesign", level: "B2", opts: ["از طریق یک جدول واسط (Junction Table) شامل کلیدهای اصلی هر دو جدول", "با اضافه کردن ستون در هر دو جدول", "از طریق کلید خارجی مستقیم", "امکان‌پذیر نیست"], ans: 0 },

        { text: "Primary Key چه ویژگی‌هایی باید داشته باشد؟", subject: "Constraints", level: "B2", opts: ["یکتا (Unique) و غیر تهی (Not Null)", "فقط عددی باشد", "می‌تواند تکراری باشد", "باید حتماً از دو ستون تشکیل شود"], ans: 0 },
        { text: "وظیفه Foreign Key در دیتابیس چیست؟", subject: "Constraints", level: "B2", opts: ["ایجاد ارتباط بین دو جدول و حفظ یکپارچگی مرجع (Referential Integrity)", "افزایش سرعت جستجو", "جلوگیری از ورود اعداد منفی", "تولید خودکار کد ID"], ans: 0 },
        { text: "قید CHECK چه کاربردی دارد؟", subject: "Constraints", level: "B2", opts: ["اعمال محدودیت روی مقادیر یک ستون (مثلاً سن نباید کمتر از ۱۸ باشد)", "چک کردن وضعیت سرور", "بررسی اتصال دیتابیس", "بررسی یکتا بودن نام جدول"], ans: 0 },
        { text: "تفاوت UNIQUE و PRIMARY KEY چیست؟", subject: "Constraints", level: "B2", opts: ["یک جدول فقط یک PK دارد اما می‌تواند چندین UNIQUE داشته باشد؛ ضمناً UNIQUE می‌تواند NULL بپذیرد", "فرقی ندارند", "UNIQUE فقط برای متن است", "PK سرعت کمتری دارد"], ans: 0 },
        { text: "گزینه ON DELETE CASCADE در کلید خارجی چه می‌کند؟", subject: "Constraints", level: "B2", opts: ["با حذف رکورد در جدول والد، تمام رکوردهای مرتبط در جدول فرزند هم حذف می‌شوند", "مانع حذف رکورد والد می‌شود", "فقط رکورد فرزند را NULL می‌کند", "خطا می‌دهد"], ans: 0 },

        // ==========================================
        // C1: Transactions (5) & StoredProcedures (5)
        // ==========================================
        { text: "مفهوم ACID در تراکنش‌ها مخفف چیست؟", subject: "Transactions", level: "C1", opts: ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Index, Data", "Automated, Common, Integrated, Distributed", "Action, Commit, Input, Delete"], ans: 0 },
        { text: "دستور ROLLBACK چه زمانی استفاده می‌شود؟", subject: "Transactions", level: "C1", opts: ["برای لغو تمام تغییرات تراکنشی که هنوز Commit نشده‌اند در صورت بروز خطا", "برای پاک کردن کش دیتابیس", "برای بازگرداندن جدول حذف شده", "برای بستن کانکشن"], ans: 0 },
        { text: "سطح جداسازی (Isolation Level) 'Read Committed' چه مشکلی را حل می‌کند؟", subject: "Transactions", level: "C1", opts: ["Dirty Read (خواندن داده‌های تایید نشده تراکنش‌های دیگر)", "سرعت پایین کوئری", "حذف تصادفی داده‌ها", "تکرار کدها"], ans: 0 },
        { text: "تفاوت تراکنش‌های Implicit و Explicit چیست؟", subject: "Transactions", level: "C1", opts: ["Explicit با دستور BEGIN شروع می‌شود، Implicit توسط خود دیتابیس مدیریت می‌شود", "تفاوتی ندارند", "Explicit فقط برای SELECT است", "Implicit امنیت کمتری دارد"], ans: 0 },
        { text: "Deadlock در تراکنش‌ها به چه معناست؟", subject: "Transactions", level: "C1", opts: ["وقتی دو تراکنش منتظر آزادسازی منابع توسط یکدیگر هستند و متوقف می‌شوند", "وقتی دیتابیس آفلاین می‌شود", "وقتی پسورد اشتباه است", "وقتی هارد دیسک پر است"], ans: 0 },

        { text: "Stored Procedure چیست؟", subject: "StoredProcedures", level: "C1", opts: ["مجموعه‌ای از دستورات SQL ذخیره شده در دیتابیس که با نام فراخوانی می‌شوند", "یک نوع جدول مجازی", "یک اسکریپت در سمت کلاینت", "یک نوع بک‌آپ"], ans: 0 },
        { text: "تفاوت Stored Procedure و Function چیست؟", subject: "StoredProcedures", level: "C1", opts: ["Function باید حتماً مقدار برگرداند و در SELECT قابل استفاده است، اما Procedure لزوماً این‌طور نیست", "Procedure سریع‌تر است", "Function نمی‌تواند ورودی داشته باشد", "تفاوتی ندارند"], ans: 0 },
        { text: "Trigger در SQL چه زمانی اجرا می‌شود؟", subject: "StoredProcedures", level: "C1", opts: ["به صورت خودکار در پاسخ به رویدادهای DML (مثل Insert یا Update)", "فقط وقتی کاربر بخواهد", "در زمان لود شدن دیتابیس", "فقط در محیط ترمینال"], ans: 0 },
        { text: "مزیت اصلی استفاده از Stored Procedure از نظر امنیت چیست؟", subject: "StoredProcedures", level: "C1", opts: ["جلوگیری از SQL Injection و مدیریت سطح دسترسی بدون دسترسی مستقیم به جداول", "کاهش حجم دیتابیس", "رمزنگاری خودکار داده‌ها", "پنهان کردن نام ستون‌ها"], ans: 0 },
        { text: "تفاوت BEFORE Trigger و AFTER Trigger چیست؟", subject: "StoredProcedures", level: "C1", opts: ["BEFORE قبل از اعمال تغییرات (برای ولیدیشن) و AFTER بعد از ثبت تغییرات اجرا می‌شود", "BEFORE فقط برای INSERT است", "AFTER سرعت بیشتری دارد", "هر دو هم‌زمان اجرا می‌شوند"], ans: 0 },

        // ==========================================
        // C2: Indexing (5) & Optimization (5)
        // ==========================================
        
        { text: "Clustered Index در دیتابیس چه کاری انجام می‌دهد؟", subject: "Indexing", level: "C2", opts: ["ترتیب فیزیکی ذخیره‌سازی داده‌ها در جدول را بر اساس کلید ایندکس تغییر می‌دهد", "یک کپی جداگانه از داده‌ها می‌سازد", "فقط برای ستون‌های متنی است", "تعداد ستون‌ها را کم می‌کند"], ans: 0 },
        { text: "چرا تعداد زیاد ایندکس روی یک جدول مضر است؟", subject: "Indexing", level: "C2", opts: ["باعث کند شدن عملیات Insert و Update می‌شود (به دلیل نیاز به آپدیت ایندکس‌ها)", "حجم کوئری‌ها را زیاد می‌کند", "امنیت را کاهش می‌دهد", "باعث حذف داده‌ها می‌شود"], ans: 0 },
        { text: "Non-Clustered Index چگونه کار می‌کند؟", subject: "Indexing", level: "C2", opts: ["یک ساختار جداگانه از جدول دارد که به مکان فیزیکی داده‌ها اشاره می‌کند (Pointer)", "داده‌ها را فیزیکی جابجا می‌کند", "فقط در حافظه RAM است", "مانع تغییر داده‌ها می‌شود"], ans: 0 },
        { text: "Composite Index چیست؟", subject: "Indexing", level: "C2", opts: ["ایندکسی که روی ترکیبی از دو یا چند ستون ساخته می‌شود", "ایندکسی که هم‌زمان در دو دیتابیس است", "ایندکسی که شامل عکس است", "ایندکسی که خودکار حذف می‌شود"], ans: 0 },
        { text: "تفاوت Index Seek و Index Scan در کارایی چیست؟", subject: "Indexing", level: "C2", opts: ["Seek مستقیم به داده می‌رسد (سریع)، Scan تمام ایندکس را پیمایش می‌کند (کند)", "تفاوتی ندارند", "Scan همیشه سریع‌تر است", "Seek فقط برای متن است"], ans: 0 },

        { text: "دستور EXPLAIN (یا Execution Plan) چه کاربردی دارد؟", subject: "Optimization", level: "C2", opts: ["نمایش نحوه اجرای کوئری توسط دیتابیس برای شناسایی گلوگاه‌ها (Bottlenecks)", "توضیح کد به زبان ساده برای برنامه‌نویس", "تغییر کدهای SQL به بهینه‌ترین حالت", "بستن کوئری‌های طولانی"], ans: 0 },
        { text: "Window Functions (مثل ROW_NUMBER) چه تفاوتی با GROUP BY دارند؟", subject: "Optimization", level: "C2", opts: ["محاسبات را بدون فشرده کردن (Collapse) سطرها انجام می‌دهند", "فقط برای شمارش هستند", "سرعت کمتری دارند", "فقط در SQL Server هستند"], ans: 0 },
        { text: "CTE (Common Table Expression) با دستور WITH چه مزیتی دارد؟", subject: "Optimization", level: "C2", opts: ["بهبود خوانایی کوئری‌های پیچیده و امکان نوشتن کوئری‌های بازگشتی (Recursive)", "افزایش حجم دیتابیس", "جایگزین دائم جداول اصلی", "حذف نیاز به JOIN"], ans: 0 },
        { text: "در بهینه‌سازی، چرا استفاده از SELECT * توصیه نمی‌شود؟", subject: "Optimization", level: "C2", opts: ["باعث انتقال دیتای غیرضروری، افزایش ترافیک شبکه و استفاده نادرست از ایندکس‌ها می‌شود", "چون خطا می‌دهد", "چون نام ستون‌ها فاش می‌شود", "چون ترتیب ستون‌ها عوض می‌شود"], ans: 0 },
        { text: "SARGable بودن یک کوئری به چه معناست؟", subject: "Optimization", level: "C2", opts: ["کوئری به گونه‌ای نوشته شده که دیتابیس بتواند از ایندکس‌ها به درستی استفاده کند", "کوئری که در تمام دیتابیس‌ها کار می‌کند", "کوئری که فقط مخصوص جستجو است", "کوئری که هیچ دیتایی برنمی‌گرداند"], ans: 0 }
    ];

    try{
        const formattedQuestions = rawQuestions.map(q => ({
        questionText: q.text,
        subject: q.subject,
        level: q.level,
        typeId: typeId,
        options: q.opts.map((o, i) => ({
            text: o,
            value: i,
            isCorrect: i === q.ans
        }))
    }));

    await Question.insertMany(formattedQuestions);
    console.log(`Successfully imported ${formattedQuestions.length} SQL questions!`);
    } catch (err) {
        console.error("SQL Import failed:", err);
    }
};

module.exports = SqlQuestions;