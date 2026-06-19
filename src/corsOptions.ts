import { CorsOptions } from "cors";

const allowedOrigins: string[] = [
  "http://localhost:3000",
  "https://barchasb.liara.run",
  "https://barchasb.org",
  "https://www.barchasb.org",
];

export const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("این دامین اجازه دسترسی ندارد!"), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

export default corsOptions;
