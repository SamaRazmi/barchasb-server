import prisma from "../../../config/prisma";

const FastApiQuestions = async (typeId: string) => {
  const rawQuestions = [
    // ==========================================
    // A1: Basics (8 Questions)
    // ==========================================
    {
      text: "FastAPI بر پایه کدام استاندارد پایتون برای تعامل با سرور ساخته شده است؟",
      subject: "Basics",
      level: "A1",
      opts: ["ASGI", "WSGI", "HTTP/1.1 only", "FastCGI"],
      ans: 0,
    },
    {
      text: "کدام کتابخانه در FastAPI مسئولیت Serialization و Validation داده‌ها را بر عهده دارد؟",
      subject: "Basics",
      level: "A1",
      opts: ["Pydantic", "Starlette", "Uvicorn", "SQLAlchemy"],
      ans: 0,
    },
    {
      text: "فریم‌ورک زیرین (Underlying) که FastAPI ویژگی‌های Routing را از آن می‌گیرد چیست؟",
      subject: "Basics",
      level: "A1",
      opts: ["Starlette", "Flask", "Django", "Tornado"],
      ans: 0,
    },
    {
      text: "کدام دستور برای اجرای اپلیکیشن با قابلیت Reload خودکار صحیح است؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "uvicorn main:app --reload",
        "python main.py",
        "fastapi run",
        "uvicorn app:main --debug",
      ],
      ans: 0,
    },
    {
      text: "برای تعریف یک تابع مسیر که مسدودکننده (Blocking) نباشد، از چه کلمه‌ای استفاده می‌شود؟",
      subject: "Basics",
      level: "A1",
      opts: ["async def", "def", "await def", "fast def"],
      ans: 0,
    },
    {
      text: "آدرس پیش‌فرض مستندات تعاملی Swagger در FastAPI چیست؟",
      subject: "Basics",
      level: "A1",
      opts: ["/docs", "/swagger", "/api/v1", "/redoc"],
      ans: 0,
    },
    {
      text: "مزیت اصلی استفاده از Type Hints در ورودی توابع FastAPI چیست؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "اعتبارسنجی خودکار و تولید مستندات",
        "افزایش سرعت اجرای کدهای ریاضی",
        "عدم نیاز به نوشتن بدنه تابع",
        "اتصال خودکار به دیتابیس",
      ],
      ans: 0,
    },
    {
      text: "فایل اصلی اپلیکیشن معمولاً با تعریف کدام متغیر شروع می‌شود؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "app = FastAPI()",
        "api = Fast()",
        "server = Starlette()",
        "app = Router()",
      ],
      ans: 0,
    },

    // ==========================================
    // A1: Routing (8 Questions)
    // ==========================================
    {
      text: "برای دریافت داده‌های ارسالی در متد POST، از کدام دکوراتور استفاده می‌شود؟",
      subject: "Routing",
      level: "A1",
      opts: ["@app.post()", "@app.get()", "@app.put()", "@app.patch()"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان یک پارامتر مسیر (Path) را در دکوراتور تعریف کرد؟",
      subject: "Routing",
      level: "A1",
      opts: [
        "/items/{item_id}",
        "/items/:item_id",
        "/items/?item_id",
        "/items/item_id",
      ],
      ans: 0,
    },
    {
      text: "برای گروه‌بندی مسیرها در فایل‌های مختلف از کدام کلاس استفاده می‌شود؟",
      subject: "Routing",
      level: "A1",
      opts: ["APIRouter", "BaseRouter", "FastRouter", "SubApp"],
      ans: 0,
    },
    {
      text: "کدام متد HTTP برای به‌روزرسانی کامل یک منبع استفاده می‌شود؟",
      subject: "Routing",
      level: "A1",
      opts: ["PUT", "GET", "POST", "DELETE"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان یک مسیر را از لیست مستندات Swagger حذف کرد؟",
      subject: "Routing",
      level: "A1",
      opts: [
        "include_in_schema=False",
        "hidden=True",
        "deprecated=True",
        "private=True",
      ],
      ans: 0,
    },
    {
      text: "تگ‌ها (tags) در دکوراتور مسیر چه کاربردی دارند؟",
      subject: "Routing",
      level: "A1",
      opts: [
        "دسته‌بندی مسیرها در رابط Swagger",
        "فیلتر کردن دیتابیس",
        "تعیین سطح دسترسی",
        "تغییر رنگ خروجی",
      ],
      ans: 0,
    },
    {
      text: "برای نمایش یک مسیر به عنوان 'منسوخ شده' در مستندات از چه پارامتری استفاده می‌شود؟",
      subject: "Routing",
      level: "A1",
      opts: ["deprecated=True", "old=True", "active=False", "remove=True"],
      ans: 0,
    },
    {
      text: "Response Model در دکوراتور چه نقشی دارد؟",
      subject: "Routing",
      level: "A1",
      opts: [
        "تعیین و فیلتر کردن مدل داده خروجی",
        "تغییر کد وضعیت HTTP",
        "اتصال به مدل دیتابیس",
        "فقط برای نمایش در داکس است",
      ],
      ans: 0,
    },

    // ==========================================
    // A2: Pydantic (8 Questions)
    // ==========================================
    {
      text: "کلاس اصلی برای تعریف اسکیما در Pydantic چیست؟",
      subject: "Pydantic",
      level: "A2",
      opts: ["BaseModel", "DataModel", "PydanticModel", "FastSchema"],
      ans: 0,
    },
    {
      text: "چگونه یک فیلد را در Pydantic اختیاری (Optional) می‌کنیم؟",
      subject: "Pydantic",
      level: "A2",
      opts: [
        "استفاده از Union[str, None] یا str | None",
        "تعریف فیلد با نام خصوصی",
        "استفاده از دکوراتور @optional",
        "فقط با مقدار دهی به صفر",
      ],
      ans: 0,
    },
    {
      text: "برای اعمال محدودیت روی طول رشته در مدل Pydantic از چه ابزاری استفاده می‌شود؟",
      subject: "Pydantic",
      level: "A2",
      opts: [
        "کلاس Field",
        "تابع len()",
        "Type Hint مستقیم",
        "دکوراتور @validator",
      ],
      ans: 0,
    },
    {
      text: "در Pydantic v2، دکوراتور جایگزین @validator برای اعتبارسنجی فیلدها چیست؟",
      subject: "Pydantic",
      level: "A2",
      opts: ["@field_validator", "@check_value", "@valid_field", "@ensure"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان داده‌های یک دیکشنری را به یک مدل Pydantic تبدیل کرد؟",
      subject: "Pydantic",
      level: "A2",
      opts: [
        "User(**data)",
        "User.from_dict(data)",
        "User.parse(data)",
        "User(data)",
      ],
      ans: 0,
    },
    {
      text: "تنظیم model_config برای چیست؟",
      subject: "Pydantic",
      level: "A2",
      opts: [
        "پیکربندی رفتار مدل (مثل حساسیت به حروف بزرگ یا ORM mode)",
        "تنظیمات دیتابیس",
        "تغییر پورت سرور",
        "تعریف متغیرهای محیطی",
      ],
      ans: 0,
    },
    {
      text: "فایده اصلی RootModel در Pydantic چیست؟",
      subject: "Pydantic",
      level: "A2",
      opts: [
        "تعریف مدل‌هایی که مقدار اصلی آن‌ها یک لیست یا نوع ساده است",
        "ارث‌بری از مدل‌های دیگر",
        "مدیریت ارتباطات دیتابیس",
        "جایگزین BaseModel",
      ],
      ans: 0,
    },
    {
      text: "برای تبدیل یک مدل Pydantic به دیکشنری در نسخه ۲ از چه متدی استفاده می‌شود؟",
      subject: "Pydantic",
      level: "A2",
      opts: ["model_dump()", "dict()", "to_dict()", "json()"],
      ans: 0,
    },

    // ==========================================
    // A2: Parameters (8 Questions)
    // ==========================================
    {
      text: "اگر پارامتری در تابع تعریف شود اما در مسیر (Path) نباشد، FastAPI آن را چه در نظر می‌گیرد؟",
      subject: "Parameters",
      level: "A2",
      opts: ["Query Parameter", "Path Parameter", "Body Parameter", "Error"],
      ans: 0,
    },
    {
      text: "برای اجباری کردن یک Query Parameter چه باید کرد؟",
      subject: "Parameters",
      level: "A2",
      opts: [
        "عدم اختصاص مقدار پیش‌فرض به آن",
        "استفاده از Required=True",
        "تعریف آن به صورت List",
        "فقط در مدل Pydantic امکان‌پذیر است",
      ],
      ans: 0,
    },
    {
      text: "کلاس مورد استفاده برای اعتبارسنجی Query Parameterها چیست؟",
      subject: "Parameters",
      level: "A2",
      opts: ["Query", "Param", "Request", "Search"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان چندین مقدار برای یک Query Parameter دریافت کرد؟ (مثلاً ?q=1&q=2)",
      subject: "Parameters",
      level: "A2",
      opts: [
        "تعریف نوع پارامتر به صورت List[str]",
        "استفاده از دیکشنری",
        "FastAPI این مورد را پشتیبانی نمی‌کند",
        "تعریف پارامتر به صورت string بلند",
      ],
      ans: 0,
    },
    {
      text: "برای خواندن اطلاعات از Header درخواست، از کدام کلاس استفاده می‌شود؟",
      subject: "Parameters",
      level: "A2",
      opts: ["Header", "Cookie", "MetaData", "Auth"],
      ans: 0,
    },
    {
      text: "تفاوت پارامترهای gt و ge در کلاس Query یا Path چیست؟",
      subject: "Parameters",
      level: "A2",
      opts: [
        "gt یعنی بزرگتر از، ge یعنی بزرگتر یا مساوی",
        "برعکس هستند",
        "هر دو به معنای طول رشته هستند",
        "مربوط به تاریخ هستند",
      ],
      ans: 0,
    },
    {
      text: "برای دریافت فایل ارسالی توسط کاربر، از چه کلاسی استفاده می‌شود؟",
      subject: "Parameters",
      level: "A2",
      opts: ["UploadFile", "FileContent", "ByteStream", "InputFile"],
      ans: 0,
    },
    {
      text: "مزیت UploadFile نسبت به bytes در دریافت فایل چیست؟",
      subject: "Parameters",
      level: "A2",
      opts: [
        "ذخیره در حافظه موقت (Spool) و عدم اشغال کل رم برای فایل‌های سنگین",
        "سرعت رندر بالاتر",
        "فرمت فایل را عوض می‌کند",
        "نیاز به pydantic ندارد",
      ],
      ans: 0,
    },

    // ==========================================
    // B1: DI (Dependency Injection) (8 Questions)
    // ==========================================
    {
      text: "تابع اصلی برای استفاده از سیستم تزریق وابستگی در FastAPI چیست؟",
      subject: "DI",
      level: "B1",
      opts: ["Depends", "Inject", "Provider", "Using"],
      ans: 0,
    },
    {
      text: "وابستگی‌ها (Dependencies) در چه زمانی اجرا می‌شوند؟",
      subject: "DI",
      level: "B1",
      opts: [
        "قبل از اجرای تابع مسیر",
        "بعد از ارسال پاسخ",
        "فقط هنگام شروع سرور",
        "هنگام رندر مستندات",
      ],
      ans: 0,
    },
    {
      text: "اگر یک Dependency چندین بار در یک درخواست صدا زده شود، FastAPI به صورت پیش‌فرض چه می‌کند؟",
      subject: "DI",
      level: "B1",
      opts: [
        "نتیجه را کش کرده و فقط یکبار اجرا می‌کند",
        "هر بار مجدد اجرا می‌کند",
        "خطای تکرار می‌دهد",
        "درخواست را لغو می‌کند",
      ],
      ans: 0,
    },
    {
      text: "چگونه می‌توان کش کردن نتیجه یک Dependency را غیرفعال کرد؟",
      subject: "DI",
      level: "B1",
      opts: [
        "use_cache=False",
        "cache=None",
        "singleton=False",
        "refresh=True",
      ],
      ans: 0,
    },
    {
      text: "برای اعمال یک وابستگی روی کل اپلیکیشن، کجا باید آن را تعریف کرد؟",
      subject: "DI",
      level: "B1",
      opts: [
        "در آرگومان dependencies کلاس FastAPI",
        "در فایل uvicorn",
        "در هر تابع به صورت جداگانه",
        "در Middleware",
      ],
      ans: 0,
    },
    {
      text: "کاربرد اصلی yield در یک Dependency چیست؟",
      subject: "DI",
      level: "B1",
      opts: [
        "ایجاد مدیریت منابع (مثل باز و بسته کردن دیتابیس)",
        "افزایش سرعت اجرای تابع",
        "تولید لیست‌های بزرگ",
        "جایگزین return",
      ],
      ans: 0,
    },
    {
      text: "آیا یک Dependency می‌تواند خودش به Dependency دیگری وابسته باشد؟",
      subject: "DI",
      level: "B1",
      opts: [
        "بله، و به آن Sub-dependency می‌گویند",
        "خیر، فقط یک سطح مجاز است",
        "فقط در کدهای Synchronous",
        "فقط با استفاده از کلاس BaseModel",
      ],
      ans: 0,
    },
    {
      text: "برای دسترسی به شیء Request در یک وابستگی، چه باید کرد؟",
      subject: "DI",
      level: "B1",
      opts: [
        "تعریف پارامتری با نوع Request در ورودی تابع",
        "استفاده از متغیر سراسری app",
        "نیاز به تزریق دستی نیست",
        "استفاده از کتابخانه Starlette",
      ],
      ans: 0,
    },

    // ==========================================
    // B1: Exceptions (8 Questions)
    // ==========================================
    {
      text: "کلاس استاندارد برای بازگرداندن خطاهای HTTP به کاربر چیست؟",
      subject: "Exceptions",
      level: "B1",
      opts: ["HTTPException", "APIError", "ResponseError", "FastError"],
      ans: 0,
    },
    {
      text: "چگونه یک Exception Handler سفارشی برای کل اپلیکیشن بنویسیم؟",
      subject: "Exceptions",
      level: "B1",
      opts: [
        "@app.exception_handler()",
        "@app.error()",
        "در Middleware اصلی",
        "در تنظیمات Pydantic",
      ],
      ans: 0,
    },
    {
      text: "هنگامی که اعتبارسنجی Pydantic شکست می‌خورد، FastAPI چه خطایی برمی‌گرداند؟",
      subject: "Exceptions",
      level: "B1",
      opts: [
        "RequestValidationError",
        "PydanticError",
        "404 Not Found",
        "500 Server Error",
      ],
      ans: 0,
    },
    {
      text: "برای تغییر ساختار خطاهای Validation پیش‌فرض FastAPI، کدام هندلر را باید Override کرد؟",
      subject: "Exceptions",
      level: "B1",
      opts: [
        "RequestValidationError",
        "HTTPException",
        "TypeError",
        "ValueError",
      ],
      ans: 0,
    },
    {
      text: "پارامتر detail در HTTPException معمولاً حاوی چه چیزی است؟",
      subject: "Exceptions",
      level: "B1",
      opts: [
        "پیام متنی یا دیکشنری حاوی توضیح خطا",
        "کد وضعیت HTTP",
        "هدرهای پاسخ",
        "آدرس URL مسیر",
      ],
      ans: 0,
    },
    {
      text: "کد وضعیت (Status Code) پیش‌فرض برای خطاهای Validation چیست؟",
      subject: "Exceptions",
      level: "B1",
      opts: [
        "422 Unprocessable Entity",
        "400 Bad Request",
        "403 Forbidden",
        "500 Internal Error",
      ],
      ans: 0,
    },
    {
      text: "آیا می‌توان در یک Exception Handler، پاسخ را به صورت HTML برگرداند؟",
      subject: "Exceptions",
      level: "B1",
      opts: [
        "بله، با بازگرداندن HTMLResponse",
        "خیر، فقط JSON مجاز است",
        "فقط با استفاده از Jinja2",
        "فقط در نسخه جدید",
      ],
      ans: 0,
    },
    {
      text: "چگونه هدرهای سفارشی به یک HTTPException اضافه کنیم؟",
      subject: "Exceptions",
      level: "B1",
      opts: [
        "استفاده از آرگومان headers در هنگام raise",
        "تغییر شیء request قبل از خطا",
        "امکان‌پذیر نیست",
        "استفاده از Middleware",
      ],
      ans: 0,
    },

    // ==========================================
    // B2: Security (8 Questions)
    // ==========================================
    {
      text: "طرح (Scheme) استاندارد برای احراز هویت با توکن در FastAPI چیست؟",
      subject: "Security",
      level: "B2",
      opts: ["OAuth2PasswordBearer", "APIKeyHeader", "HTTPBasic", "JWTAuth"],
      ans: 0,
    },
    {
      text: "برای هش کردن پسوردها در پایتون، کدام کتابخانه معمولاً پیشنهاد می‌شود؟",
      subject: "Security",
      level: "B2",
      opts: ["passlib", "hashlib (built-in)", "cryptography", "pydantic-auth"],
      ans: 0,
    },
    {
      text: "Security Scopes برای چه منظوری استفاده می‌شوند؟",
      subject: "Security",
      level: "B2",
      opts: [
        "تعیین سطوح دسترسی (مثل Permissionها) برای توکن‌ها",
        "تعیین محدوده IP",
        "رمزنگاری دیتابیس",
        "فشرده‌سازی توکن",
      ],
      ans: 0,
    },
    {
      text: "JWT مخفف چیست و در کجا قرار می‌گیرد؟",
      subject: "Security",
      level: "B2",
      opts: [
        "JSON Web Token - در هدر Authorization",
        "Java Web Tool - در کوکی",
        "Joint Web Tag - در بدنه درخواست",
        "JSON Web Token - در پارامتر مسیر",
      ],
      ans: 0,
    },
    {
      text: "چگونه می‌توان دسترسی CORS را در FastAPI مدیریت کرد؟",
      subject: "Security",
      level: "B2",
      opts: [
        "CORSMiddleware",
        "Depends(CORS)",
        "تنظیم در فایل uvicorn",
        "استفاده از Header سفارشی",
      ],
      ans: 0,
    },
    {
      text: "در OAuth2، فیلد 'grant_type' معمولاً چه مقداری دارد؟",
      subject: "Security",
      level: "B2",
      opts: ["password", "token", "secret", "access"],
      ans: 0,
    },
    {
      text: "برای بررسی صحت یک توکن JWT، به چه چیزی نیاز است؟",
      subject: "Security",
      level: "B2",
      opts: [
        "SECRET_KEY و الگوریتم (مثل HS256)",
        "نام کاربری کاربر",
        "پسورد دیتابیس",
        "فقط نام اپلیکیشن",
      ],
      ans: 0,
    },
    {
      text: "چرا استفاده از OAuth2PasswordRequestForm راحت‌تر از مدل دستی است؟",
      subject: "Security",
      level: "B2",
      opts: [
        "چون فیلدهای username و password را مطابق استاندارد فرم‌های OAuth2 استخراج می‌کند",
        "چون امنیت بالاتری دارد",
        "چون پسورد را خودکار هش می‌کند",
        "چون نیاز به دیتابیس ندارد",
      ],
      ans: 0,
    },

    // ==========================================
    // B2: BackgroundTasks (8 Questions)
    // ==========================================
    {
      text: "کلاس BackgroundTasks در کجا باید تعریف شود؟",
      subject: "BackgroundTasks",
      level: "B2",
      opts: [
        "به عنوان یک پارامتر در تابع مسیر",
        "در Middleware",
        "در فایل تنظیمات سرور",
        "در مدل Pydantic",
      ],
      ans: 0,
    },
    {
      text: "تسک‌های پس‌زمینه در FastAPI چه زمانی اجرا می‌شوند؟",
      subject: "BackgroundTasks",
      level: "B2",
      opts: [
        "دقیقاً بعد از فرستادن پاسخ (Response) به کاربر",
        "قبل از پردازش درخواست",
        "همزمان با پردازش درخواست (Parallel)",
        "هنگام بسته شدن سرور",
      ],
      ans: 0,
    },
    {
      text: "مزیت اصلی استفاده از BackgroundTasks چیست؟",
      subject: "BackgroundTasks",
      level: "B2",
      opts: [
        "کاربر معطل انجام عملیات سنگین (مثل ارسال ایمیل) نمی‌ماند",
        "کدها سریع‌تر اجرا می‌شوند",
        "دیتابیس قفل نمی‌شود",
        "نیاز به async بودن کد نیست",
      ],
      ans: 0,
    },
    {
      text: "تفاوت BackgroundTasks خود FastAPI با Celery چیست؟",
      subject: "BackgroundTasks",
      level: "B2",
      opts: [
        "BackgroundTasks ساده است و در همان پروسه اجرا می‌شود، Celery برای کارهای توزیع شده و سنگین است",
        "فرقی ندارند",
        "Celery فقط برای دیتابیس است",
        "BackgroundTasks فقط در لینوکس کار می‌کند",
      ],
      ans: 0,
    },
    {
      text: "چگونه یک تابع را به لیست تسک‌های پس‌زمینه اضافه می‌کنیم؟",
      subject: "BackgroundTasks",
      level: "B2",
      opts: [
        "background_tasks.add_task(func, args)",
        "background_tasks.append(func)",
        "await func()",
        "run_in_background(func)",
      ],
      ans: 0,
    },
    {
      text: "آیا می‌توان چندین تسک پس‌زمینه را در یک درخواست اضافه کرد؟",
      subject: "BackgroundTasks",
      level: "B2",
      opts: [
        "بله، با چندین بار صدا زدن add_task",
        "خیر، فقط یک تسک مجاز است",
        "فقط اگر توابع async باشند",
        "فقط با استفاده از ترد (Thread)",
      ],
      ans: 0,
    },
    {
      text: "برای کارهای زمان‌بندی شده (Cron jobs) در FastAPI چه ابزاری پیشنهاد می‌شود؟",
      subject: "BackgroundTasks",
      level: "B2",
      opts: [
        "ARQ یا Celery Beat",
        "BackgroundTasks",
        "uvicorn --cron",
        "تابع time.sleep()",
      ],
      ans: 0,
    },
    {
      text: "آیا BackgroundTasks برای پردازش‌های سنگین CPU-bound مناسب است؟",
      subject: "BackgroundTasks",
      level: "B2",
      opts: [
        "خیر، چون پروسه اصلی را اشغال می‌کند و بهتر است از پروسه مجزا استفاده شود",
        "بله، کاملاً",
        "فقط اگر تعداد هسته‌های CPU زیاد باشد",
        "فقط در نسخه Python 3.12",
      ],
      ans: 0,
    },

    // ==========================================
    // C1: Databases (8 Questions)
    // ==========================================
    {
      text: "رایج‌ترین ORM برای کار با دیتابیس‌های SQL در FastAPI چیست؟",
      subject: "Databases",
      level: "C1",
      opts: ["SQLAlchemy", "Tortoise ORM", "Django ORM", "Pymongo"],
      ans: 0,
    },
    {
      text: "در SQLAlchemy نسخه ۲، برای اجرای کوئری‌های Async از کدام کلاس استفاده می‌شود؟",
      subject: "Databases",
      level: "C1",
      opts: ["AsyncSession", "Session", "Database", "AsyncEngine"],
      ans: 0,
    },
    {
      text: "نقش Alembic در پروژه‌های FastAPI چیست؟",
      subject: "Databases",
      level: "C1",
      opts: [
        "مدیریت مهاجرت‌ها (Migrations) و تغییرات جداول دیتابیس",
        "ارتباط با دیتابیس NoSQL",
        "تست کردن کدهای دیتابیس",
        "بهینه‌سازی سرعت کوئری‌ها",
      ],
      ans: 0,
    },
    {
      text: "چگونه می‌توان مدل‌های دیتابیس را به اسکیماهای Pydantic متصل کرد؟",
      subject: "Databases",
      level: "C1",
      opts: [
        "با تنظیم from_attributes=True در مدل Pydantic",
        "با ارث‌بری مدل دیتابیس از Pydantic",
        "با استفاده از تابع convert()",
        "امکان‌پذیر نیست",
      ],
      ans: 0,
    },
    {
      text: "تکنیک 'Lazy Loading' در دیتابیس چیست و چه مشکلی در Async ایجاد می‌کند؟",
      subject: "Databases",
      level: "C1",
      opts: [
        "بارگذاری داده‌های مرتبط در لحظه نیاز؛ که باعث خطا در محیط Async می‌شود",
        "بارگذاری سریع داده‌ها؛ که سرعت را زیاد می‌کند",
        "نوعی کش کردن است",
        "مخصوص دیتابیس‌های گراف است",
      ],
      ans: 0,
    },
    {
      text: "برای کوئری‌های سریع و کش کردن در FastAPI معمولاً از کدام دیتابیس استفاده می‌شود؟",
      subject: "Databases",
      level: "C1",
      opts: ["Redis", "SQLite", "PostgreSQL", "Elasticsearch"],
      ans: 0,
    },
    {
      text: "Database URL برای یک فایل SQLite محلی چگونه نوشته می‌شود؟",
      subject: "Databases",
      level: "C1",
      opts: [
        "sqlite:///./test.db",
        "postgres://localhost",
        "mongodb://test",
        "db.sqlite",
      ],
      ans: 0,
    },
    {
      text: "SQLModel چیست؟",
      subject: "Databases",
      level: "C1",
      opts: [
        "کتابخانه‌ای که Pydantic و SQLAlchemy را برای کدنویسی کمتر ترکیب می‌کند",
        "یک جایگزین برای SQL",
        "موتور دیتابیس داخلی FastAPI",
        "ابزار تست دیتابیس",
      ],
      ans: 0,
    },

    // ==========================================
    // C1: WebSockets (8 Questions)
    // ==========================================
    {
      text: "کلاس مورد استفاده برای مدیریت ارتباط WebSocket چیست؟",
      subject: "WebSockets",
      level: "C1",
      opts: ["WebSocket", "WSConnection", "SocketIO", "Stream"],
      ans: 0,
    },
    {
      text: "برای پذیرش یک اتصال جدید WebSocket، کدام متد باید صدا زده شود؟",
      subject: "WebSockets",
      level: "C1",
      opts: [
        "await websocket.accept()",
        "websocket.open()",
        "await websocket.connect()",
        "app.accept_ws()",
      ],
      ans: 0,
    },
    {
      text: "چگونه می‌توان یک پیام متنی به کلاینت در WebSocket فرستاد؟",
      subject: "WebSockets",
      level: "C1",
      opts: [
        "await websocket.send_text()",
        "websocket.write()",
        "return 'msg'",
        "await websocket.emit()",
      ],
      ans: 0,
    },
    {
      text: "تفاوت WebSocket با HTTP معمولی چیست؟",
      subject: "WebSockets",
      level: "C1",
      opts: [
        "WebSocket دوطرفه و تمام‌دوبلکس است و اتصال باز می‌ماند",
        "HTTP سریع‌تر است",
        "WebSocket فقط برای چت است",
        "فرقی ندارند",
      ],
      ans: 0,
    },
    {
      text: "چگونه خطای قطع اتصال کلاینت را در WebSocket مدیریت کنیم؟",
      subject: "WebSockets",
      level: "C1",
      opts: [
        "استفاده از try/except با WebSocketDisconnect",
        "بررسی مقدار برگشتی تابع",
        "در Middleware",
        "FastAPI خودکار مدیریت می‌کند",
      ],
      ans: 0,
    },
    {
      text: "آیا می‌توان از Dependency Injection در مسیرهای WebSocket استفاده کرد؟",
      subject: "WebSockets",
      level: "C1",
      opts: [
        "بله، مشابه مسیرهای HTTP",
        "خیر، مجاز نیست",
        "فقط برای دیتابیس",
        "فقط با استفاده از OAuth2",
      ],
      ans: 0,
    },
    {
      text: "برای ارسال داده‌های JSON در WebSocket از کدام متد استفاده می‌شود؟",
      subject: "WebSockets",
      level: "C1",
      opts: ["send_json()", "send_dict()", "send_object()", "write_json()"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان یک Broadcast (ارسال به همه) در WebSocket پیاده کرد؟",
      subject: "WebSockets",
      level: "C1",
      opts: [
        "مدیریت دستی لیستی از اتصالات فعال در حافظه",
        "استفاده از دکوراتور @app.broadcast",
        "قابلیت داخلی شیء websocket",
        "فقط با استفاده از Redis",
      ],
      ans: 0,
    },

    // ==========================================
    // C2: Architecture (8 Questions)
    // ==========================================
    {
      text: "الگوی طراحی پیشنهاد شده برای جداسازی منطق بیزنس از لایه API چیست؟",
      subject: "Architecture",
      level: "C2",
      opts: [
        "Service Layer Pattern",
        "Active Record",
        "Singleton",
        "Monolithic Architecture",
      ],
      ans: 0,
    },
    {
      text: "چرا استفاده از APIRouter به صورت ماژولار در پروژه‌های Enterprise ضروری است؟",
      subject: "Architecture",
      level: "C2",
      opts: [
        "برای جلوگیری از شلوغی فایل اصلی و امکان توسعه تیمی مجزا",
        "برای افزایش سرعت رندر",
        "برای امنیت بیشتر",
        "اجباری از سمت پایتون است",
      ],
      ans: 0,
    },
    {
      text: "مفهوم 'Clean Architecture' در پایتون بر چه اساسی است؟",
      subject: "Architecture",
      level: "C2",
      opts: [
        "جداسازی لایه‌های وابستگی به طوری که هسته برنامه به فریم‌ورک وابسته نباشد",
        "حذف تمام فضاهای خالی کد",
        "استفاده از کمترین تعداد فایل",
        "نوشتن تمام کدها در یک کلاس",
      ],
      ans: 0,
    },
    {
      text: "نقش پکیج 'Lifespan' در اپلیکیشن‌های مدرن FastAPI چیست؟",
      subject: "Architecture",
      level: "C2",
      opts: [
        "مدیریت کارهای زمان شروع و پایان اپلیکیشن (Startup/Shutdown)",
        "افزایش طول عمر سرور",
        "مدیریت کش مرورگر",
        "جایگزین Middleware",
      ],
      ans: 0,
    },
    {
      text: "بهترین روش برای مدیریت تنظیمات (Settings) در پروژه‌های بزرگ چیست؟",
      subject: "Architecture",
      level: "C2",
      opts: [
        "استفاده از Pydantic Settings و فایل .env",
        "تعریف متغیرهای سراسری در فایل main",
        "نوشتن در دیتابیس",
        "استفاده از فایل XML",
      ],
      ans: 0,
    },
    {
      text: "تکنیک 'Dependency Overrides' در زمان تست برای چیست؟",
      subject: "Architecture",
      level: "C2",
      opts: [
        "جایگزین کردن دیتابیس واقعی با دیتابیس تست بدون تغییر کد اصلی",
        "تغییر ورژن پایتون",
        "غیرفعال کردن Swagger",
        "حذف مدل‌های Pydantic",
      ],
      ans: 0,
    },
    {
      text: "در معماری Microservices، چگونه مستندات چندین سرویس را یکپارچه می‌کنیم؟",
      subject: "Architecture",
      level: "C2",
      opts: [
        "استفاده از یک API Gateway یا تعریف اسکیماهای OpenAPI سفارشی",
        "کپی کردن دستی فایل‌ها",
        "امکان‌پذیر نیست",
        "استفاده از CSS",
      ],
      ans: 0,
    },
    {
      text: "فایده استفاده از 'Uvicorn Workers' در کنار Gunicorn چیست؟",
      subject: "Architecture",
      level: "C2",
      opts: [
        "بهره‌گیری از چندین هسته CPU در حالی که از ASGI استفاده می‌شود",
        "کاهش مصرف رم",
        "فقط برای کار در ویندوز است",
        "افزایش امنیت شبکه",
      ],
      ans: 0,
    },

    // ==========================================
    // C2: Deployment (8 Questions)
    // ==========================================
    {
      text: "دستور مناسب برای اجرای اپلیکیشن در محیط Docker چیست؟",
      subject: "Deployment",
      level: "C2",
      opts: [
        "CMD ['uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '80']",
        "CMD ['python', 'main.py']",
        "CMD ['fastapi', 'start']",
        "RUN uvicorn",
      ],
      ans: 0,
    },
    {
      text: "چرا نباید از '--reload' در محیط Production استفاده کرد؟",
      subject: "Deployment",
      level: "C2",
      opts: [
        "مصرف منابع زیاد و کاهش شدید پایداری و امنیت",
        "چون فایل‌ها تغییر نمی‌کنند",
        "چون دیتابیس را پاک می‌کند",
        "چون Swagger را غیرفعال می‌کند",
      ],
      ans: 0,
    },
    {
      text: "نقش Nginx در کنار FastAPI چیست؟",
      subject: "Deployment",
      level: "C2",
      opts: [
        "به عنوان Reverse Proxy برای مدیریت SSL، کشینگ و Load Balancing",
        "جایگزین پایتون است",
        "برای ذخیره داده‌ها",
        "برای نوشتن کدهای بک‌بند",
      ],
      ans: 0,
    },
    {
      text: "کدام متغیر محیطی برای امنیت در زمان Deployment حیاتی است؟",
      subject: "Deployment",
      level: "C2",
      opts: ["SECRET_KEY", "DEBUG_MODE", "DATABASE_URL", "همه موارد"],
      ans: 0,
    },
    {
      text: "مزیت اصلی استفاده از کانتینرهای Multi-stage در داکر برای FastAPI چیست؟",
      subject: "Deployment",
      level: "C2",
      opts: [
        "کاهش چشمگیر حجم Image نهایی با حذف ابزارهای Build",
        "افزایش سرعت اینترنت",
        "نصب خودکار کتابخانه‌ها",
        "امکان اجرای کدهای جاوا",
      ],
      ans: 0,
    },
    {
      text: "در هنگام استفاده از Gunicorn، تعداد Workerهای پیشنهادی معمولاً چقدر است؟",
      subject: "Deployment",
      level: "C2",
      opts: ["(2 * cores) + 1", "فقط ۱ عدد", "۱۰۰ عدد ثابت", "محدودیتی ندارد"],
      ans: 0,
    },
    {
      text: "برای مشاهده لاگ‌های اپلیکیشن در سرورهای لینوکسی، کدام ابزار بهتر است؟",
      subject: "Deployment",
      level: "C2",
      opts: [
        "journalctl یا ابزارهای مانیتورینگ مثل ELK/Sentry",
        "فایل ورد",
        "پرینت گرفتن",
        "پنل ادمین جنگو",
      ],
      ans: 0,
    },
    {
      text: "قابلیت 'Graceful Shutdown' به چه معناست؟",
      subject: "Deployment",
      level: "C2",
      opts: [
        "اجازه تکمیل درخواست‌های جاری قبل از بسته شدن کامل سرور",
        "بسته شدن ناگهانی سرور",
        "پاک کردن کش قبل از خروج",
        "خاموش کردن مانیتور",
      ],
      ans: 0,
    },
  ];

  try {
    const formattedQuestions = rawQuestions.map((q) => ({
      questionText: q.text,
      subject: q.subject,
      level: q.level,
      typeId: typeId,
      options: q.opts.map((o, i) => ({
        text: o,
        value: i,
        isCorrect: i === q.ans,
      })),
    }));

    await prisma.question.createMany({
      data: formattedQuestions,
      skipDuplicates: true,
    });

    console.log(
      `Successfully imported ${formattedQuestions.length} FastAPI questions!`,
    );
  } catch (err) {
    console.error("FastAPI Import failed:", err);
  }
};

export default FastApiQuestions;
