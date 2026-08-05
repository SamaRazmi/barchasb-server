// src/controllers/converterCtrl.ts
import { Request, Response } from "express";
import sharp from "sharp";
import { PDFDocument, PageSizes } from "pdf-lib";
import prisma from "../config/prisma";

const logToolUsage = async (data: {
  userId: string;
  toolName: string;
  status: string;
  errorMessage?: string | null;
  metadata: any;
  durationMs: number;
  ip?: string | null;
  userAgent?: string | null;
}) => {
  try {
    await prisma.toolUsageLog.create({
      data: {
        userId: data.userId,
        toolName: data.toolName,
        status: data.status,
        errorMessage: data.errorMessage || null,
        metadata: data.metadata || {},
        durationMs: data.durationMs || null,
        ip: data.ip || null,
        userAgent: data.userAgent || null,
      },
    });
  } catch (error) {
    console.error("Error logging tool usage:", error);
  }
};

// convert and compress image
export const convertAndCompressImage = async (req: Request, res: Response) => {
  const startTime = Date.now();
  const userId = (req as any).user?.id;
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "";
  const userAgent = req.headers["user-agent"];

  let status = "failed";
  let errorMsg = null;
  let outputBuffer = null;
  let outputFormat = null;
  let inputSize = (req as any).file?.size || null;
  let inputFormat = (req as any).file?.mimetype || null;

  try {
    if (!(req as any).file) {
      return res.status(400).json({ message: "فایلی ارسال نشده است." });
    }

    const format = req.body.format ? req.body.format.toLowerCase() : "webp";
    const quality = req.body.quality ? parseInt(req.body.quality) : 80;

    const validFormats = ["jpeg", "jpg", "png", "webp", "avif"];
    if (!validFormats.includes(format)) {
      return res
        .status(400)
        .json({ message: "فرمت درخواستی پشتیبانی نمی‌شود." });
    }

    outputBuffer = await sharp((req as any).file.buffer)
      .toFormat(format, { quality })
      .toBuffer();
    outputFormat = `image/${format === "jpg" ? "jpeg" : format}`;

    res.set("Content-Type", `image/${format}`);
    res.set(
      "Content-Disposition",
      `attachment; filename="barchasb_converted-image.${format}"`,
    );
    res.send(outputBuffer);

    status = "success";
  } catch (error: any) {
    console.error("Image Conversion Error:", error);
    errorMsg = error.message;
    res
      .status(500)
      .json({ message: "خطا در پردازش تصویر", error: error.message });
  } finally {
    await logToolUsage({
      userId,
      toolName: "convert-image",
      status,
      errorMessage: errorMsg,
      metadata: {
        inputSize,
        outputSize: outputBuffer ? outputBuffer.length : null,
        inputFormat,
        outputFormat: outputFormat || null,
      },
      durationMs: Date.now() - startTime,
      ip,
      userAgent,
    });
  }
};

// merge PDFs
export const mergePdfs = async (req: Request, res: Response) => {
  const startTime = Date.now();
  const userId = (req as any).user?.id;
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "";
  const userAgent = req.headers["user-agent"];

  let status = "failed";
  let errorMsg = null;
  let outputBuffer = null;
  let totalInputSize = null;
  const inputFormat = "application/pdf";

  try {
    const files = (req as any).files || [];
    if (!files.length || files.length < 2) {
      return res
        .status(400)
        .json({ message: "حداقل ۲ فایل PDF برای ترکیب نیاز است." });
    }

    totalInputSize = files.reduce(
      (sum: number, f: any) => sum + (f.size || 0),
      0,
    );

    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const pdf = await PDFDocument.load(file.buffer, {
        ignoreEncryption: true,
      });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    outputBuffer = Buffer.from(mergedPdfBytes);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="barchasb_merged-document.pdf"',
    );
    res.send(outputBuffer);

    status = "success";
  } catch (error: any) {
    console.error("Merge PDF Error:", error);
    errorMsg = error.message;
    res.status(500).json({ message: "خطا در ترکیب فایل‌های PDF" });
  } finally {
    await logToolUsage({
      userId,
      toolName: "merge-pdf",
      status,
      errorMessage: errorMsg,
      metadata: {
        inputSize: totalInputSize,
        outputSize: outputBuffer ? outputBuffer.length : null,
        inputFormat,
        outputFormat: "application/pdf",
      },
      durationMs: Date.now() - startTime,
      ip,
      userAgent,
    });
  }
};

// compress PDF
export const compressPdf = async (req: Request, res: Response) => {
  const startTime = Date.now();
  const userId = (req as any).user?.id;
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "";
  const userAgent = req.headers["user-agent"];

  let status = "failed";
  let errorMsg = null;
  let outputBuffer = null;

  try {
    if (!(req as any).file) {
      return res.status(400).json({ message: "لطفاً یک فایل PDF ارسال کنید." });
    }

    const pdfDoc = await PDFDocument.load((req as any).file.buffer, {
      ignoreEncryption: true,
    });

    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
    });

    outputBuffer = Buffer.from(compressedPdfBytes);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="barchasb_compressed.pdf"',
    );
    res.send(outputBuffer);

    status = "success";
  } catch (error: any) {
    console.error("Compress PDF Error:", error);
    errorMsg = error.message;
    res.status(500).json({ message: "خطا در فشرده‌سازی PDF" });
  } finally {
    await logToolUsage({
      userId,
      toolName: "compress-pdf",
      status,
      errorMessage: errorMsg,
      metadata: {
        inputSize: (req as any).file?.size || null,
        outputSize: outputBuffer ? outputBuffer.length : null,
        inputFormat: (req as any).file?.mimetype || null,
        outputFormat: "application/pdf",
      },
      durationMs: Date.now() - startTime,
      ip,
      userAgent,
    });
  }
};

// PDF (Extract / Delete Pages)
export const extractPdfPages = async (req: Request, res: Response) => {
  const startTime = Date.now();
  const userId = (req as any).user?.id;
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "";
  const userAgent = req.headers["user-agent"];

  let status = "failed";
  let errorMsg = null;
  let outputBuffer = null;

  try {
    if (!(req as any).file) {
      return res.status(400).json({ message: "فایل PDF ارسال نشده است." });
    }

    let pagesToKeep: number[];
    const pagesInput = req.body.pages;

    if (!pagesInput) {
      return res.status(400).json({ message: "شماره صفحات مشخص نشده است." });
    }

    if (typeof pagesInput === "string") {
      const trimmed = pagesInput.trim();
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          pagesToKeep = parsed;
        } else if (typeof parsed === "number") {
          pagesToKeep = [parsed];
        } else {
          throw new Error();
        }
      } catch (e) {
        if (trimmed.includes(",")) {
          pagesToKeep = trimmed.split(",").map((p) => parseInt(p.trim(), 10));
        } else if (!isNaN(parseInt(trimmed, 10))) {
          pagesToKeep = [parseInt(trimmed, 10)];
        } else {
          return res.status(400).json({ message: "فرمت صفحات نامعتبر است." });
        }
      }
    } else if (typeof pagesInput === "number") {
      pagesToKeep = [pagesInput];
    } else if (Array.isArray(pagesInput)) {
      pagesToKeep = pagesInput;
    } else {
      return res
        .status(400)
        .json({ message: "فیلد pages باید عدد، آرایه یا رشته JSON باشد." });
    }

    if (!Array.isArray(pagesToKeep) || pagesToKeep.length === 0) {
      return res
        .status(400)
        .json({ message: "هیچ صفحه معتبری برای جداسازی یافت نشد." });
    }

    pagesToKeep = pagesToKeep.filter((p) => !isNaN(p) && p > 0);
    if (pagesToKeep.length === 0) {
      return res
        .status(400)
        .json({ message: "شماره صفحات باید اعداد مثبت باشند." });
    }

    const pdfDoc = await PDFDocument.load((req as any).file.buffer);
    const totalPages = pdfDoc.getPageCount();

    const validIndices: number[] = [];
    for (const pageNum of pagesToKeep) {
      if (pageNum >= 1 && pageNum <= totalPages) {
        validIndices.push(pageNum - 1);
      }
    }

    if (validIndices.length === 0) {
      return res.status(400).json({
        message: `شماره صفحات وارد شده خارج از محدوده (1 تا ${totalPages}) می‌باشند.`,
      });
    }

    const newPdfDoc = await PDFDocument.create();
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, validIndices);
    copiedPages.forEach((page) => newPdfDoc.addPage(page));

    const pdfBytes = await newPdfDoc.save();
    outputBuffer = Buffer.from(pdfBytes);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="barchasb_extracted.pdf"',
    );
    res.send(outputBuffer);

    status = "success";
  } catch (error: any) {
    console.error("Error in extractPdfPages:", error);
    errorMsg = error.message;
    res.status(500).json({
      message: "خطا در جداسازی صفحات",
      error: error.message,
    });
  } finally {
    await logToolUsage({
      userId,
      toolName: "extract-pages",
      status,
      errorMessage: errorMsg,
      metadata: {
        inputSize: (req as any).file?.size || null,
        outputSize: outputBuffer ? outputBuffer.length : null,
        inputFormat: (req as any).file?.mimetype || null,
        outputFormat: "application/pdf",
      },
      durationMs: Date.now() - startTime,
      ip,
      userAgent,
    });
  }
};

// images to PDF
export const convertToPdf = async (req: Request, res: Response) => {
  const startTime = Date.now();
  const userId = (req as any).user?.id;
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "";
  const userAgent = req.headers["user-agent"];

  let status = "failed";
  let errorMsg = null;
  let outputBuffer = null;
  let totalInputSize = null;
  const inputFormat = "image/*";

  try {
    const files = (req as any).files || [];
    if (!files.length) {
      return res.status(400).json({ message: "هیچ تصویری ارسال نشده است." });
    }
    totalInputSize = files.reduce(
      (sum: number, f: any) => sum + (f.size || 0),
      0,
    );

    const pdfDoc = await PDFDocument.create();

    let portraitCount = 0;
    let landscapeCount = 0;
    const processedImages = [];

    for (const file of files) {
      let image;
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
        image = await pdfDoc.embedJpg(file.buffer);
      } else if (file.mimetype === "image/png") {
        image = await pdfDoc.embedPng(file.buffer);
      } else {
        continue;
      }

      const dims = image.scale(1);

      if (dims.width > dims.height) {
        landscapeCount++;
      } else {
        portraitCount++;
      }
      processedImages.push({ image, dims });
    }

    const isPortraitMode = portraitCount >= landscapeCount;

    const [pageWidth, pageHeight] = isPortraitMode
      ? PageSizes.A4
      : [PageSizes.A4[1], PageSizes.A4[0]];

    for (const item of processedImages) {
      const { image, dims } = item;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      const margin = 20;
      const effectiveWidth = pageWidth - margin * 2;
      const effectiveHeight = pageHeight - margin * 2;

      const scale = Math.min(
        effectiveWidth / dims.width,
        effectiveHeight / dims.height,
      );
      const scaledWidth = dims.width * scale;
      const scaledHeight = dims.height * scale;

      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;

      page.drawImage(image, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();
    outputBuffer = Buffer.from(pdfBytes);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="barchasb_converted.pdf"',
    );
    res.send(outputBuffer);

    status = "success";
  } catch (error: any) {
    console.error("Error in convertToPdf:", error);
    errorMsg = error.message;
    res
      .status(500)
      .json({ message: "خطا در تبدیل تصاویر به PDF", error: error.message });
  } finally {
    await logToolUsage({
      userId,
      toolName: "images-to-pdf",
      status,
      errorMessage: errorMsg,
      metadata: {
        inputSize: totalInputSize,
        outputSize: outputBuffer ? outputBuffer.length : null,
        inputFormat,
        outputFormat: "application/pdf",
      },
      durationMs: Date.now() - startTime,
      ip,
      userAgent,
    });
  }
};

// ========== export default ==========
const converterController = {
  convertAndCompressImage,
  mergePdfs,
  compressPdf,
  extractPdfPages,
  convertToPdf,
};

export default converterController;
