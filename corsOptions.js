const allowedOrigins = [
  "http://localhost:3000",
  "https://barchasb.liara.run",
  "https://barchasb.org",
  "https://www.barchasb.org",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // برای ابزارهایی مثل Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("این دامین اجازه دسترسی ندارد!"), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

module.exports = corsOptions;
