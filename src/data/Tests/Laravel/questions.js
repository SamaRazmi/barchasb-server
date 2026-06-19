const Question = require('../../../models/Question');

const LaravelQuestions = async (typeId) => {
    const rawQuestions = [
        // ==========================================
        // A1: Basics (8 Questions)
        // ==========================================
        { text: "الگوی معماری اصلی لاراول چیست؟", subject: "Basics", level: "A1", opts: ["MVC (Model-View-Controller)", "MVVM", "Singleton", "Event-Driven"], ans: 0 },
        { text: "فایل اصلی برای تنظیمات محیطی (Environment) کدام است؟", subject: "Basics", level: "A1", opts: [".env", "config.php", "settings.json", "app.yaml"], ans: 0 },
        { text: "نقطه ورود تمام درخواست‌های HTTP در لاراول کجاست؟", subject: "Basics", level: "A1", opts: ["public/index.php", "routes/web.php", "app/Providers/AppServiceProvider.php", "bootstrap/app.php"], ans: 0 },
        { text: "دستور پیش‌فرض برای اجرای سرور داخلی لاراول چیست؟", subject: "Basics", level: "A1", opts: ["php artisan serve", "php -S localhost", "laravel run", "artisan start"], ans: 0 },
        { text: "دایرکتوری 'storage' برای چه منظوری استفاده می‌شود؟", subject: "Basics", level: "A1", opts: ["ذخیره فایل‌های کش، لاگ و فایل‌های آپلودی موقت", "ذخیره کدهای جاوااسکریپت", "نگهداری کدهای هسته لاراول", "ذخیره تصاویر اصلی قالب"], ans: 0 },
        { text: "کدام فایل برای تعریف مسیرهای وب (با پشتیبانی از سشن و کوکی) استفاده می‌شود؟", subject: "Basics", level: "A1", opts: ["routes/web.php", "routes/api.php", "routes/console.php", "app/Http/Kernel.php"], ans: 0 },
        { text: "موتور قالب‌ساز (Template Engine) اختصاصی لاراول چه نام دارد؟", subject: "Basics", level: "A1", opts: ["Blade", "Twig", "Smarty", "Jinja"], ans: 0 },
        { text: "کدام دستور تمام کش‌های مربوط به Config را پاک می‌کند؟", subject: "Basics", level: "A1", opts: ["php artisan config:clear", "php artisan cache:forget", "php artisan optimize:purge", "php artisan config:reset"], ans: 0 },

        // ==========================================
        // A1: Artisan (8 Questions)
        // ==========================================
        { text: "Artisan در لاراول به چه معناست؟", subject: "Artisan", level: "A1", opts: ["رابط خط فرمان (CLI) برای مدیریت و خودکارسازی وظایف", "نام موتور دیتابیس لاراول", "سیستم مدیریت پکیج‌ها", "نام مستعار برای فایل‌های Blade"], ans: 0 },
        { text: "دستور ساخت یک Model به همراه Migration آن چیست؟", subject: "Artisan", level: "A1", opts: ["php artisan make:model Name -m", "php artisan create:model Name --db", "php artisan make:table Name", "php artisan generate:model Name"], ans: 0 },
        { text: "چگونه لیست تمام روت‌های ثبت شده را در ترمینال ببینیم؟", subject: "Artisan", level: "A1", opts: ["php artisan route:list", "php artisan show:routes", "php artisan debug:routes", "php artisan list:web"], ans: 0 },
        { text: "دستور قرار دادن اپلیکیشن در حالت تعمیر (Maintenance Mode)؟", subject: "Artisan", level: "A1", opts: ["php artisan down", "php artisan stop", "php artisan maintenance:on", "php artisan off"], ans: 0 },
        { text: "برای خروج از حالت تعمیر از چه دستوری استفاده می‌شود؟", subject: "Artisan", level: "A1", opts: ["php artisan up", "php artisan start", "php artisan online", "php artisan resume"], ans: 0 },
        { text: "دستور ساخت یک Middleware جدید؟", subject: "Artisan", level: "A1", opts: ["php artisan make:middleware Name", "php artisan create:middleware Name", "php artisan artisan generate:middleware", "php artisan add:middleware"], ans: 0 },
        { text: "برای اجرای تعاملی کدهای PHP در محیط لاراول (REPL) از چه دستوری استفاده می‌شود؟", subject: "Artisan", level: "A1", opts: ["php artisan tinker", "php artisan shell", "php artisan interactive", "php artisan php"], ans: 0 },
        { text: "چگونه یک فرمان (Command) شخصی در Artisan بسازیم؟", subject: "Artisan", level: "A1", opts: ["php artisan make:command Name", "php artisan create:artisan Name", "php artisan build:cmd Name", "php artisan make:cli Name"], ans: 0 },

        // ==========================================
        // A2: Eloquent (8 Questions)
        // ==========================================
        { text: "Eloquent ORM بر پایه کدام الگوی طراحی ساخته شده است؟", subject: "Eloquent", level: "A2", opts: ["Active Record", "Data Mapper", "Repository Pattern", "Factory Pattern"], ans: 0 },
        { text: "برای تعریف یک رابطه یک‌به‌چند، در مدل 'والد' از چه متدی استفاده می‌شود؟", subject: "Eloquent", level: "A2", opts: ["hasMany()", "belongsTo()", "hasOne()", "belongsToMany()"], ans: 0 },
        { text: "در رابطه Many-to-Many، متد مورد استفاده در مدل‌ها چیست؟", subject: "Eloquent", level: "A2", opts: ["belongsToMany()", "hasManyThrough()", "hasMany()", "morphMany()"], ans: 0 },
        { text: "ویژگی 'Soft Deletes' در Eloquent چه کاری انجام می‌دهد؟", subject: "Eloquent", level: "A2", opts: ["رکورد را به جای حذف فیزیکی، فقط علامت‌گذاری (deleted_at) می‌کند", "داده را به یک دیتابیس آرشیو منتقل می‌کند", "فقط سوابق مربوط به فایل‌ها را پاک می‌کند", "رکورد را به صورت رمزنگاری شده ذخیره می‌کند"], ans: 0 },
        { text: "کدام متغیر در مدل برای جلوگیری از حملات Mass Assignment استفاده می‌شود؟", subject: "Eloquent", level: "A2", opts: ["$fillable", "$guarded", "$hidden", "گزینه ۱ و ۲"], ans: 3 },
        { text: "تفاوت متد get() و first() در کوئری‌های Eloquent چیست؟", subject: "Eloquent", level: "A2", opts: ["get یک مجموعه (Collection) برمی‌گرداند، first فقط یک نمونه (Object)", "فرقی ندارند", "get فقط روی دیتابیس MySQL کار می‌کند", "first فقط برای آیدی‌های فرد است"], ans: 0 },
        { text: "برای دریافت رکوردهایی که مقدار یک ستون آن‌ها بین دو عدد است از چه متدی استفاده می‌شود؟", subject: "Eloquent", level: "A2", opts: ["whereBetween()", "whereIn()", "whereRange()", "whereInside()"], ans: 0 },
        { text: "متد find() در Eloquent بر چه اساسی جستجو می‌کند؟", subject: "Eloquent", level: "A2", opts: ["بر اساس کلید اصلی (Primary Key)", "بر اساس نام (Name)", "بر اساس زمان ایجاد", "بر اساس اولین ستون متنی"], ans: 0 },

        // ==========================================
        // A2: Migrations (8 Questions)
        // ==========================================
        { text: "متد up() در یک کلاس Migration چه وظیفه‌ای دارد؟", subject: "Migrations", level: "A2", opts: ["اعمال تغییرات و ساخت جداول جدید در دیتابیس", "بازگرداندن تغییرات به حالت قبل", "فقط برای آپدیت ورژن لاراول است", "چک کردن امنیت دیتابیس"], ans: 0 },
        { text: "چگونه آخرین عملیات میگریشن را به عقب برگردانیم (Rollback)؟", subject: "Migrations", level: "A2", opts: ["php artisan migrate:rollback", "php artisan migrate:undo", "php artisan migrate:back", "php artisan db:reverse"], ans: 0 },
        { text: "دستور 'migrate:fresh' چه تفاوتی با 'migrate:refresh' دارد؟", subject: "Migrations", level: "A2", opts: ["fresh تمام جداول را Drop می‌کند، refresh تک‌تک Rollback می‌کند", "fresh فقط جداول جدید را می‌سازد", "refresh دیتابیس را پاک نمی‌کند", "تفاوتی ندارند"], ans: 0 },
        { text: "کدام متد در کلاس Blueprint برای ساخت کلید خارجی (Foreign Key) استفاده می‌شود؟", subject: "Migrations", level: "A2", opts: ["foreignId()", "belongsTo()", "externalId()", "refId()"], ans: 0 },
        { text: "برای اضافه کردن یک ستون جدید به جدول موجود، چه باید کرد؟", subject: "Migrations", level: "A2", opts: ["ساخت یک میگریشن جدید با استفاده از متد Schema::table", "ویرایش فایل میگریشن قبلی و اجرای مجدد", "تغییر مستقیم در دیتابیس", "استفاده از دستور db:update"], ans: 0 },
        { text: "چگونه یک ستون را 'Nullable' تعریف کنیم؟", subject: "Migrations", level: "A2", opts: ["->nullable()", "->optional()", "->null(true)", "->default(null)"], ans: 0 },
        { text: "نام جدولی که وضعیت میگریشن‌های اجرا شده را نگه می‌دارد چیست؟", subject: "Migrations", level: "A2", opts: ["migrations", "laravel_logs", "schema_updates", "migrations_history"], ans: 0 },
        { text: "برای تغییر نام یک جدول در میگریشن از چه متدی استفاده می‌شود؟", subject: "Migrations", level: "A2", opts: ["Schema::rename()", "Schema::move()", "Schema::updateName()", "Schema::change()"], ans: 0 },

        // ==========================================
        // B1: Middleware (8 Questions)
        // ==========================================
        { text: "Middlewareها در کدام قسمت از چرخه درخواست (Request Lifecycle) قرار می‌گیرند؟", subject: "Middleware", level: "B1", opts: ["بین درخواست کاربر و مقصد نهایی (کنترلر/روت)", "داخل متدهای مدل", "فقط در هنگام رندر کردن ویو", "بعد از اتمام پاسخ در دیتابیس"], ans: 0 },
        { text: "محل ثبت Middlewareهای سراسری (Global) کجاست؟", subject: "Middleware", level: "B1", opts: ["app/Http/Kernel.php", "config/app.php", "routes/web.php", "bootstrap/app.php"], ans: 0 },
        { text: "کدام Middleware پیش‌فرض لاراول مسئول بررسی سشن و احراز هویت است؟", subject: "Middleware", level: "B1", opts: ["auth", "guest", "verified", "can"], ans: 0 },
        { text: "برای ارسال درخواست به مرحله بعد در یک Middleware از چه کدی استفاده می‌شود؟", subject: "Middleware", level: "B1", opts: ["return $next($request);", "return $request->continue();", "return proceed();", "return true;"], ans: 0 },
        { text: "Middleware 'throttle' چه کاربردی دارد؟", subject: "Middleware", level: "B1", opts: ["محدود کردن تعداد درخواست‌ها (Rate Limiting)", "تغییر فرمت پاسخ به JSON", "فشرده‌سازی تصاویر", "بررسی امنیت پسورد"], ans: 0 },
        { text: "چگونه یک Middleware را فقط به یک Route خاص اختصاص دهیم؟", subject: "Middleware", level: "B1", opts: ["->middleware('name')", "->add('name')", "->only('name')", "در داخل کنترلر"], ans: 0 },
        { text: "تفاوت Middlewareهای وب (web) و ای‌پی‌آی (api) در چیست؟", subject: "Middleware", level: "B1", opts: ["گروه وب شامل سشن و CSRF است، گروه ای‌پی‌آی Stateless است", "گروه ای‌پی‌آی امنیت بیشتری دارد", "گروه وب فقط برای نمایش HTML است", "تفاوتی ندارند"], ans: 0 },
        { text: "Middleware 'SubstituteBindings' چه وظیفه‌ای دارد؟", subject: "Middleware", level: "B1", opts: ["تبدیل آیدی‌های موجود در URL به مدل‌های Eloquent (Route Model Binding)", "جایگزینی متغیرهای محیطی", "ترجمه متون سایت", "پاک‌سازی ورودی‌های فرم"], ans: 0 },

        // ==========================================
        // B1: Validation (8 Questions)
        // ==========================================
        { text: "بهترین مکان برای نوشتن قوانین اعتبارسنجی پیچیده جهت جلوگیری از شلوغی کنترلر؟", subject: "Validation", level: "B1", opts: ["Form Request Classes", "Eloquent Models", "Blade Templates", "Middleware"], ans: 0 },
        { text: "قانون (Rule) برای بررسی منحصر‌به‌فرد بودن یک ایمیل در جدول users چیست؟", subject: "Validation", level: "B1", opts: ["unique:users,email", "distinct:users", "exists:users,email", "only:users"], ans: 0 },
        { text: "چگونه در صورت شکست اعتبارسنجی، کاربر را با خطاهای قبلی به فرم برگردانیم؟", subject: "Validation", level: "B1", opts: ["لاراول به صورت خودکار این کار را انجام می‌دهد (Redirect back with errors)", "باید دستی redirect کنیم", "با استفاده از سشن", "نیاز به جاوااسکریپت دارد"], ans: 0 },
        { text: "متد مورد استفاده برای اعتبارسنجی مستقیم در کنترلر؟", subject: "Validation", level: "B1", opts: ["$request->validate([...])", "Validator::make()", "$this->check([...])", "گزینه ۱ و ۲"], ans: 3 },
        { text: "برای نمایش اولین خطای مربوط به فیلد 'username' در Blade؟", subject: "Validation", level: "B1", opts: ["@error('username') {{ $message }} @enderror", "$errors->get('username')", "$errors->first('username')", "همه موارد"], ans: 3 },
        { text: "قانون 'confirmed' در لاراول چه کاری انجام می‌دهد؟", subject: "Validation", level: "B1", opts: ["چک می‌کند که فیلد با فیلد دیگری با پسوند _confirmation برابر باشد", "ایمیل را تایید می‌کند", "بررسی می‌کند کاربر لاگین است یا خیر", "یک کد تایید اس‌ام‌اس می‌فرستد"], ans: 0 },
        { text: "چگونه یک Rule سفارشی (Custom) بسازیم؟", subject: "Validation", level: "B1", opts: ["php artisan make:rule Name", "php artisan create:validation Name", "تعریف در فایل .env", "نوشتن در مدل"], ans: 0 },
        { text: "قانون 'sometimes' چه کاربردی دارد؟", subject: "Validation", level: "B1", opts: ["اعتبارسنجی فیلد فقط در صورتی که آن فیلد در درخواست وجود داشته باشد", "اعتبارسنجی تصادفی", "فقط برای کاربران ادمین", "اجرای اعتبارسنجی در زمان‌های خاص"], ans: 0 },

        // ==========================================
        // B2: Auth (8 Questions)
        // ==========================================
        { text: "نام سیستم پیش‌فرض لاراول برای احراز هویت (Authentication) چیست؟", subject: "Auth", level: "B2", opts: ["Laravel Guard & Provider", "Laravel Passport", "Laravel Shield", "PHP Auth"], ans: 0 },
        { text: "پکیج رسمی و سبک لاراول برای احراز هویت API (به وسیله Token) چیست؟", subject: "Auth", level: "B2", opts: ["Laravel Sanctum", "Laravel Passport", "Laravel UI", "Laravel Fortify"], ans: 0 },
        { text: "تفاوت Guard و Provider در سیستم Auth لاراول؟", subject: "Auth", level: "B2", opts: ["Guard نحوه تشخیص کاربر را تعیین می‌کند، Provider نحوه بازیابی کاربر از دیتابیس", "فرقی ندارند", "Guard برای امنیت است و Provider برای دیتابیس", "Guard مخصوص ادمین‌هاست"], ans: 0 },
        { text: "متد برای چک کردن اینکه کاربر فعلی لاگین کرده است یا خیر؟", subject: "Auth", level: "B2", opts: ["Auth::check()", "Auth::user()", "Auth::isGuest()", "Auth::status()"], ans: 0 },
        { text: "چگونه آیدی کاربر لاگین شده را به دست آوریم؟", subject: "Auth", level: "B2", opts: ["Auth::id()", "$request->user()->id", "auth()->id()", "همه موارد"], ans: 3 },
        { text: "Gate در لاراول برای چه منظوری استفاده می‌شود؟", subject: "Auth", level: "B2", opts: ["تعریف سطوح دسترسی (Authorization) ساده و مبتنی بر کلوژر", "ورود به سایت", "جایگزین روت‌های ای‌پی‌آی", "مدیریت آپلود فایل"], ans: 0 },
        { text: "Policy در لاراول چه تفاوت عمده‌ای با Gate دارد؟", subject: "Auth", level: "B2", opts: ["Policy کلاس‌محور است و حول یک مدل خاص (مثلاً Post) سازماندهی می‌شود", "Policy فقط برای ادمین‌هاست", "Gate امنیت بیشتری دارد", "Policy فقط در ویوها کار می‌کند"], ans: 0 },
        { text: "کدام پکیج لاراول امکان احراز هویت دو مرحله‌ای (2FA) و مدیریت پروفایل را به صورت کامل فراهم می‌کند؟", subject: "Auth", level: "B2", opts: ["Laravel Fortify / Jetstream", "Laravel Breeze", "Laravel Sanctum", "Laravel Socialite"], ans: 0 },

        // ==========================================
        // B2: Queues (8 Questions)
        // ==========================================
        { text: "هدف اصلی استفاده از Queue (صف) در لاراول چیست؟", subject: "Queues", level: "B2", opts: ["بهبود تجربه کاربری با انتقال کارهای زمان‌بر به پس‌زمینه", "افزایش سرعت دیتابیس", "جلوگیری از حملات هکری", "مرتب‌سازی نتایج جستجو"], ans: 0 },
        { text: "درایور پیش‌فرض برای تست صف‌ها در محیط توسعه چیست؟", subject: "Queues", level: "B2", opts: ["sync (اجرای آنی)", "database", "redis", "null"], ans: 0 },
        { text: "یک کلاس Job برای اینکه در صف قرار بگیرد، باید کدام Interface را پیاده‌سازی (implement) کند؟", subject: "Queues", level: "B2", opts: ["ShouldQueue", "InteractWithQueue", "Dispatchable", "Queueable"], ans: 0 },
        { text: "دستور برای شروع پردازش تسک‌های موجود در صف؟", subject: "Queues", level: "B2", opts: ["php artisan queue:work", "php artisan queue:listen", "php artisan queue:start", "گزینه ۱ و ۲"], ans: 3 },
        { text: "اگر یک Job با خطا مواجه شود، لاراول چگونه آن را مدیریت می‌کند؟", subject: "Queues", level: "B2", opts: ["آن را به جدول failed_jobs منتقل می‌کند", "آن را بلافاصله حذف می‌کند", "کل سرور را متوقف می‌کند", "یک ایمیل به ادمین می‌زند"], ans: 0 },
        { text: "متد 'dispatch()' چه کاری انجام می‌دهد؟", subject: "Queues", level: "B2", opts: ["ارسال یک Job به صف برای اجرا", "اجرای بلافاصله کد بدون صف", "حذف یک تسک از صف", "ایجاد یک زمان‌بندی جدید"], ans: 0 },
        { text: "Laravel Horizon برای مدیریت صف‌های کدام درایور طراحی شده است؟", subject: "Queues", level: "B2", opts: ["Redis", "Database", "Beanstalkd", "Amazon SQS"], ans: 0 },
        { text: "تفاوت 'queue:work' و 'queue:listen' در چیست؟", subject: "Queues", level: "B2", opts: ["work یکبار فریم‌ورک را لود می‌کند (سریع‌تر)، listen برای هر تسک مجدد لود می‌کند (مناسب توسعه)", "listen فقط گوش می‌دهد", "work امنیت کمتری دارد", "فرقی ندارند"], ans: 0 },

        // ==========================================
        // C1: Broadcasting (8 Questions)
        // ==========================================
        { text: "Broadcasting در لاراول برای چه منظوری استفاده می‌شود؟", subject: "Broadcasting", level: "C1", opts: ["ارسال نوتیفیکیشن‌های آنی (Real-time) به فرانت‌بند از طریق WebSocket", "ارسال ایمیل‌های تبلیغاتی", "پخش ویدیو در سایت", "به‌روزرسانی خودکار دیتابیس"], ans: 0 },
        { text: "کدام پکیج جاوااسکریپتی برای دریافت رویدادهای Broadcasting در سمت کلاینت استفاده می‌شود؟", subject: "Broadcasting", level: "C1", opts: ["Laravel Echo", "Axios", "Vue Router", "Pusher JS"], ans: 0 },
        { text: "تفاوت کانال 'Public' و 'Private' در Broadcasting چیست؟", subject: "Broadcasting", level: "C1", opts: ["کانال Private نیاز به تایید سطح دسترسی (Authorization) دارد", "کانال Public امنیت ندارد", "فقط کانال Private از WebSocket استفاده می‌کند", "تفاوتی در پیاده‌سازی ندارند"], ans: 0 },
        { text: "کدام سرور WebSocket متن‌باز و رایگان برای لاراول پیشنهاد می‌شود؟", subject: "Broadcasting", level: "C1", opts: ["Soketi یا Laravel Reverb", "Pusher", "Ably", "Node.js Socket.io"], ans: 0 },
        { text: "اینترفیس مورد نیاز برای یک Event تا قابلیت انتشار (Broadcast) داشته باشد؟", subject: "Broadcasting", level: "C1", opts: ["ShouldBroadcast", "Broadcastable", "EmitEvent", "SocketInterface"], ans: 0 },
        { text: "متد 'broadcastOn()' در کلاس Event چه چیزی را برمی‌گرداند؟", subject: "Broadcasting", level: "C1", opts: ["نام کانال یا کانال‌هایی که رویداد باید روی آن‌ها ارسال شود", "نام کاربری که پیام را دریافت می‌کند", "آدرس IP سرور", "زمان دقیق ارسال"], ans: 0 },
        { text: "کانال 'Presence' چه ویژگی اضافه‌ای نسبت به کانال Private دارد؟", subject: "Broadcasting", level: "C1", opts: ["امکان آگاهی از لیست کاربران آنلاین در کانال", "امنیت دو برابری", "سرعت بالاتر ارسال", "عدم نیاز به احراز هویت"], ans: 0 },
        { text: "برای احراز هویت در کانال‌های Private، لاراول از کدام مسیر پیش‌فرض استفاده می‌کند؟", subject: "Broadcasting", level: "C1", opts: ["/broadcasting/auth", "/channels/authorize", "/api/auth", "/ws/login"], ans: 0 },

        // ==========================================
        // C1: Resources (8 Questions)
        // ==========================================
        { text: "Eloquent API Resources برای چه هدفی ایجاد شده‌اند؟", subject: "Resources", level: "C1", opts: ["ایجاد یک لایه تبدیل (Transformation) بین مدل‌های دیتابیس و پاسخ JSON", "مدیریت فایل‌های استاتیک", "بهینه‌سازی کوئری‌های SQL", "ایجاد خودکار روت‌های API"], ans: 0 },
        { text: "تفاوت JsonResource و ResourceCollection چیست؟", subject: "Resources", level: "C1", opts: ["JsonResource برای یک مدل تکی است، ResourceCollection برای لیستی از مدل‌ها", "ResourceCollection امنیت بالاتری دارد", "JsonResource فقط برای متد GET است", "فرقی ندارند"], ans: 0 },
        { text: "چگونه یک فیلد را فقط در صورت بارگذاری شدن رابطه (Eager Loaded) در ری‌سورس نمایش دهیم؟", subject: "Resources", level: "C1", opts: ["$this->whenLoaded('relation_name')", "$this->ifExists('relation_name')", "$this->relation('relation_name')", "فقط با شرط if معمولی"], ans: 0 },
        { text: "متد 'toArray()' در کلاس Resource چه وظیفه‌ای دارد؟", subject: "Resources", level: "C1", opts: ["تعریف ساختار آرایه‌ای که قرار است به JSON تبدیل شود", "تبدیل داده به XML", "ذخیره داده در دیتابیس", "پاک کردن فیلدهای حساس"], ans: 0 },
        { text: "چگونه اطلاعات اضافی (مثل Meta Data) به پاسخ Resource اضافه کنیم؟", subject: "Resources", level: "C1", opts: ["استفاده از متد with() در کلاس ری‌سورس", "نوشتن در مدل", "تغییر در فایل .env", "استفاده از سشن"], ans: 0 },
        { text: "دستور ساخت یک Resource جدید؟", subject: "Resources", level: "C1", opts: ["php artisan make:resource Name", "php artisan create:api-resource Name", "php artisan generate:resource Name", "php artisan make:transformer Name"], ans: 0 },
        { text: "مزیت استفاده از API Resource نسبت به تبدیل مستقیم مدل به JSON چیست؟", subject: "Resources", level: "C1", opts: ["جلوگیری از تغییر ناخواسته API در صورت تغییر ستون‌های دیتابیس (Decoupling)", "افزایش سرعت اینترنت", "کاهش حجم دیتابیس", "امنیت در برابر حملات DDoS"], ans: 0 },
        { text: "برای مخفی کردن رپ کردن داده‌ها در فیلد 'data' به صورت سراسری چه باید کرد؟", subject: "Resources", level: "C1", opts: ["JsonResource::withoutWrapping()", "Resource::disableData()", "تنظیم در فایل config/api.php", "حذف فیلد در متد toArray"], ans: 0 },

        // ==========================================
        // C2: Architecture (8 Questions)
        // ==========================================
        { text: "Service Container در لاراول چیست؟", subject: "Architecture", level: "C2", opts: ["یک ابزار قدرتمند برای مدیریت وابستگی‌ها و تزریق وابستگی (DI)", "یک ظرف برای ذخیره عکس‌ها", "نام سرور ابری لاراول", "سیستم مدیریت دیتابیس"], ans: 0 },
        { text: "تفاوت متد 'bind' و 'singleton' در Service Container؟", subject: "Architecture", level: "C2", opts: ["singleton فقط یک نمونه از کلاس می‌سازد و در دفعات بعد همان را برمی‌گرداند", "bind امنیت بیشتری دارد", "singleton فقط برای مدل‌هاست", "فرقی ندارند"], ans: 0 },
        { text: "Service Providerها چه زمانی اجرا می‌شوند؟", subject: "Architecture", level: "C2", opts: ["در ابتدای چرخه حیات اپلیکیشن (Bootstrapping)", "فقط هنگام لود شدن روت‌ها", "بعد از اجرای کنترلر", "هنگام ذخیره در دیتابیس"], ans: 0 },
        { text: "الگوی طراحی 'Facade' در لاراول چگونه کار می‌کند؟", subject: "Architecture", level: "C2", opts: ["فراهم کردن یک رابط استاتیک برای کلاس‌های موجود در Service Container", "مخفی کردن کدهای فرانت‌بند", "ارتباط مستقیم با دیتابیس بدون مدل", "نوعی سیستم لاگینگ"], ans: 0 },
        { text: "Contract در لاراول به چه معناست؟", subject: "Architecture", level: "C2", opts: ["مجموعه‌ای از Interfaceها که سرویس‌های اصلی فریم‌ورک را تعریف می‌کنند", "قرارداد بین برنامه و دیتابیس", "یک نوع فایل تنظیمات", "سیستم مدیریت خطا"], ans: 0 },
        { text: "Dependency Injection (تزریق وابستگی) در لاراول عمدتاً از چه طریقی انجام می‌شود؟", subject: "Architecture", level: "C2", opts: ["از طریق Constructor یا متدهای کنترلر", "از طریق فایل .env", "به صورت دستی در هر خط", "با استفاده از کلمه کلیدی global"], ans: 0 },
        { text: "مفهوم 'Late Static Binding' که در زیرساخت لاراول زیاد استفاده شده مربوط به کدام است؟", subject: "Architecture", level: "C2", opts: ["قابلیت PHP برای ارجاع به کلاسی که متد در آن صدا زده شده (static::)", "سرعت بالای لود استاتیک فایل‌ها", "یک نوع Middleware", "سیستم کشینگ"], ans: 0 },
        { text: "در معماری لاراول، وظیفه 'AppServiceProvider' چیست؟", subject: "Architecture", level: "C2", opts: ["مکانی مرکزی برای ثبت پیوندهای اینترفیس به کلاس و تنظیمات اولیه سرویس‌ها", "مدیریت روت‌های اصلی", "جایگزین فایل index.php", "نصب پکیج‌های جدید"], ans: 0 },

        // ==========================================
        // C2: Optimization (8 Questions)
        // ==========================================
        { text: "مشکل 'N+1 Query' در Eloquent چگونه حل می‌شود؟", subject: "Optimization", level: "C2", opts: ["با استفاده از Eager Loading (متد with)", "با استفاده از Pagination", "با افزایش حجم رم سرور", "با حذف مدل‌ها"], ans: 0 },
        { text: "دستور برای کش کردن تمام فایل‌های تنظیمات (Config) جهت افزایش سرعت؟", subject: "Optimization", level: "C2", opts: ["php artisan config:cache", "php artisan optimize:config", "php artisan cache:all", "php artisan store:config"], ans: 0 },
        { text: "چگونه می‌توان عملیات سنگین خواندن از دیتابیس را بهینه کرد؟", subject: "Optimization", level: "C2", opts: ["استفاده از Database Indexing و Query Caching", "حذف میگریشن‌ها", "استفاده از متد all()", "تبدیل دیتابیس به فایل متنی"], ans: 0 },
        { text: "قابلیت 'Route Caching' در چه محیطی پیشنهاد می‌شود؟", subject: "Optimization", level: "C2", opts: ["فقط در محیط Production", "فقط در محیط Local", "در زمان تست‌نویسی", "برای پروژه‌های بدون دیتابیس"], ans: 0 },
        { text: "استفاده از 'Lazy Collections' برای چه منظوری است؟", subject: "Optimization", level: "C2", opts: ["کار با حجم بسیار بزرگ داده بدون پر شدن حافظه (RAM)", "لود کردن تنبل تصاویر", "تاخیر در اجرای روت‌ها", "کاهش تعداد خطوط کد"], ans: 0 },
        { text: "کدام درایور سشن برای وب‌سایت‌های با ترافیک بالا و توزیع شده مناسب‌تر است؟", subject: "Optimization", level: "C2", opts: ["redis یا database", "file", "cookie", "array"], ans: 0 },
        { text: "پکیج 'Laravel Octane' چه کاری انجام می‌دهد؟", subject: "Optimization", level: "C2", opts: ["افزایش فوق‌العاده سرعت با نگه داشتن اپلیکیشن در حافظه (با Swoole یا RoadRunner)", "فشرده‌سازی کدهای JS", "بهینه‌سازی تصاویر آپلودی", "مدیریت دامین‌های پروکسی"], ans: 0 },
        { text: "برای بررسی تعداد کوئری‌ها و دیباگ پرفورمنس در زمان توسعه، کدام ابزار بهتر است؟", subject: "Optimization", level: "C2", opts: ["Laravel Debugbar یا Telescope", "کنسول مرورگر", "فایل لاگ لاراول", "Google Analytics"], ans: 0 }
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
    console.log(`Successfully imported ${formattedQuestions.length} Laravel questions!`);
    } catch (err) {
        console.error("Laravel Import failed:", err);
    }
};

module.exports = LaravelQuestions;