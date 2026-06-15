const multer = require('multer');

// use memory and size limit 
const storage = multer.memoryStorage();
// const limits = { fileSize: 50 * 1024 * 1024 };
const limits = {
    fileSize: 50 * 1024 * 1024,   // max file size limit
    parts: 20
};

// filter just for images
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('فقط فایل‌های تصویری مجاز هستند!'), false);
    }
};

// filter for txt and pdf
const documentFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf', 
        'text/plain', 
        'image/jpeg', 
        'image/jpg', 
        'image/png'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('فرمت فایل پشتیبانی نمی‌شود. (فقط PDF, TXT, JPG, PNG مجاز است)'), false);
    }
};

// middlewares
const imageUpload = multer({ storage, limits: limits, fileFilter: imageFilter });
const upload = multer({ storage, limits: limits, fileFilter: documentFilter });

module.exports = { imageUpload, upload };
