const sharp = require('sharp');
const { PDFDocument, PageSizes } = require('pdf-lib');
const { logToolUsage } = require('../utils/toolLogger');
const ToolUsageLog = require('../models/toolUsageLog');

// convert and compress image
exports.convertAndCompressImage = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  
  let status = 'failed';
  let errorMsg = null;
  let outputBuffer = null;
  let outputFormat = null;
  let inputSize = req.file?.size || null;
  let inputFormat = req.file?.mimetype || null;

  try {
      if (!req.file) {
          return res.status(400).json({ message: 'فایلی ارسال نشده است.' });
      }

      const format = req.body.format ? req.body.format.toLowerCase() : 'webp';
      const quality = req.body.quality ? parseInt(req.body.quality) : 80;

      const validFormats = ['jpeg', 'jpg', 'png', 'webp', 'avif'];
      if (!validFormats.includes(format)) {
          return res.status(400).json({ message: 'فرمت درخواستی پشتیبانی نمی‌شود.' });
      }

      // use RAM
      outputBuffer  = await sharp(req.file.buffer)
          .toFormat(format, { quality: quality })
          .toBuffer();
      outputFormat = `image/${format === 'jpg' ? 'jpeg' : format}`;

      res.set('Content-Type', `image/${format}`);
      res.set('Content-Disposition', `attachment; filename="barchasb_converted-image.${format}"`);
      
      res.send(outputBuffer);

      status = 'success';

    } catch (error) {
        console.error('Image Conversion Error:', error);
        errorMsg = error.message;
        res.status(500).json({ message: 'خطا در پردازش تصویر', error: error.message });
    }finally {
    await logToolUsage({
      userId,
      toolName: 'convert-image',
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
exports.mergePdfs = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id ;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  let status = 'failed';
  let errorMsg = null;
  let outputBuffer = null;
  let totalInputSize = null;
  let inputFormat = 'application/pdf';

  try {
      // at lest two files
      if (!req.files || req.files.length < 2) {
          return res.status(400).json({ message: 'حداقل ۲ فایل PDF برای ترکیب نیاز است.' });
      }

      totalInputSize = req.files.reduce((sum, f) => sum + (f.size || 0), 0);

      const mergedPdf = await PDFDocument.create();

      // loop on each file
      for (const file of req.files) {
          const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

          copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // save final file 
      const mergedPdfBytes = await mergedPdf.save();
      outputBuffer = Buffer.from(mergedPdfBytes);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="barchasb_merged-document.pdf"');
      res.send(outputBuffer);

      status = 'success';
    } catch (error) {
        console.error('Merge PDF Error:', error);
        errorMsg = error.message;
        res.status(500).json({ message: 'خطا در ترکیب فایل‌های PDF' });
    } finally {
      await logToolUsage({
        userId,
        toolName: 'merge-pdf',
        status,
        errorMessage: errorMsg,
        metadata: {
          inputSize: totalInputSize,
          outputSize: outputBuffer ? outputBuffer.length : null,
          inputFormat,
          outputFormat: 'application/pdf',
        },
        durationMs: Date.now() - startTime,
        ip,
        userAgent,
      });
    }
};

// compress PDF
exports.compressPdf = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id ;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  let status = 'failed';
  let errorMsg = null;
  let outputBuffer = null;

  try {
      if (!req.file) {
          return res.status(400).json({ message: 'لطفاً یک فایل PDF ارسال کنید.' });
      }

      // upload pdf
      const pdfDoc = await PDFDocument.load(req.file.buffer, { 
          ignoreEncryption: true 
      });

      const compressedPdfBytes = await pdfDoc.save({ 
          useObjectStreams: true 
      });

      outputBuffer  = Buffer.from(compressedPdfBytes);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="barchasb_compressed.pdf"');
      res.send(outputBuffer );

      status = 'success';
    } catch (error) {
        console.error('Compress PDF Error:', error);
        errorMsg = error.message;
        res.status(500).json({ message: 'خطا در فشرده‌سازی PDF' });
    } finally {
      await logToolUsage({
        userId,
        toolName: 'compress-pdf',
        status,
        errorMessage: errorMsg,
        metadata: {
          inputSize: req.file?.size || null,
          outputSize: outputBuffer ? outputBuffer.length : null,
          inputFormat: req.file?.mimetype || null,
          outputFormat: 'application/pdf',
        },
        durationMs: Date.now() - startTime,
        ip,
        userAgent,
      });
    }
};

// PDF (Extract / Delete Pages)
exports.extractPdfPages = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  let status = 'failed';
  let errorMsg = null;
  let outputBuffer = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'فایل PDF ارسال نشده است.' });
    }

    let pagesToKeep;
    const pagesInput = req.body.pages;

    if (!pagesInput) {
      return res.status(400).json({ message: 'شماره صفحات مشخص نشده است.' });
    }
    
    if (typeof pagesInput === 'string') {
      const trimmed = pagesInput.trim();
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          pagesToKeep = parsed;
        } else if (typeof parsed === 'number') {
          pagesToKeep = [parsed];
        } else {
          throw new Error();
        }
      } catch (e) {
        if (trimmed.includes(',')) {
          pagesToKeep = trimmed.split(',').map(p => parseInt(p.trim(), 10));
        } else if (!isNaN(parseInt(trimmed, 10))) {
          pagesToKeep = [parseInt(trimmed, 10)];
        } else {
          return res.status(400).json({ message: 'فرمت صفحات نامعتبر است.' });
        }
      }
    } 
    else if (typeof pagesInput === 'number') {
      pagesToKeep = [pagesInput];
    } 
    else if (Array.isArray(pagesInput)) {
      pagesToKeep = pagesInput;
    } 
    else {
      return res.status(400).json({ message: 'فیلد pages باید عدد، آرایه یا رشته JSON باشد.' });
    }

    // final validation
    if (!Array.isArray(pagesToKeep) || pagesToKeep.length === 0) {
      return res.status(400).json({ message: 'هیچ صفحه معتبری برای جداسازی یافت نشد.' });
    }

    // delete NaN fields
    pagesToKeep = pagesToKeep.filter(p => !isNaN(p) && p > 0);
    if (pagesToKeep.length === 0) {
      return res.status(400).json({ message: 'شماره صفحات باید اعداد مثبت باشند.' });
    }

    // load main pdf
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();

    // page number validation
    const validIndices = [];
    for (const pageNum of pagesToKeep) {
      if (pageNum >= 1 && pageNum <= totalPages) {
        validIndices.push(pageNum - 1); // transfer index ro 0-based
      }
    }

    if (validIndices.length === 0) {
      return res.status(400).json({ 
        message: `شماره صفحات وارد شده خارج از محدوده (1 تا ${totalPages}) می‌باشند.` 
      });
    }

    const newPdfDoc = await PDFDocument.create();
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, validIndices);
    copiedPages.forEach(page => newPdfDoc.addPage(page));

    // save and send file
    const pdfBytes = await newPdfDoc.save();
    outputBuffer = Buffer.from(pdfBytes);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="barchasb_extracted.pdf"');
    res.send(outputBuffer);

    status = 'success';
  } catch (error) {
    console.error('Error in extractPdfPages:', error);
    errorMsg = error.message;
    res.status(500).json({ 
      message: 'خطا در جداسازی صفحات', 
      error: error.message 
    });
  } finally {
    await logToolUsage({
      userId,
      toolName: 'extract-pages',
      status,
      errorMessage: errorMsg,
      metadata: {
        inputSize: req.file?.size || null,
        outputSize: outputBuffer ? outputBuffer.length : null,
        inputFormat: req.file?.mimetype || null,
        outputFormat: 'application/pdf',
      },
      durationMs: Date.now() - startTime,
      ip,
      userAgent,
    });
  }
};

// images to PDF
exports.convertToPdf = async (req, res) => {
  const startTime = Date.now();
  const userId = req.user.id;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  let status = 'failed';
  let errorMsg = null;
  let outputBuffer = null;
  let totalInputSize = null;
  let inputFormat = 'image/*';

  try {
      if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: 'هیچ تصویری ارسال نشده است.' });
      }
      totalInputSize = req.files.reduce((sum, f) => sum + (f.size || 0), 0);

      const pdfDoc = await PDFDocument.create();

      let portraitCount = 0;
      let landscapeCount = 0;
      const processedImages = [];

      for (const file of req.files) {
          let image;
          if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
              image = await pdfDoc.embedJpg(file.buffer);
          } else if (file.mimetype === 'image/png') {
              image = await pdfDoc.embedPng(file.buffer);
          } else {
              continue; // ignore unacceptable format
          }

          const dims = image.scale(1);

          if (dims.width > dims.height) {
              landscapeCount++;
          } else {
              portraitCount++;
          }
          processedImages.push({ image, dims });
      }

      // landscape or portrait
      const isPortraitMode = portraitCount >= landscapeCount;

      const [pageWidth, pageHeight] = isPortraitMode 
          ? PageSizes.A4 // [595.28, 841.89] -> Portrait
          : [PageSizes.A4[1], PageSizes.A4[0]]; // [841.89, 595.28] -> Landscape

      for (const item of processedImages) {
          const { image, dims } = item;
          
          const page = pdfDoc.addPage([pageWidth, pageHeight]);

          const margin = 20;
          const effectiveWidth = pageWidth - (margin * 2);
          const effectiveHeight = pageHeight - (margin * 2);

          const scale = Math.min(effectiveWidth / dims.width, effectiveHeight / dims.height);
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

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="barchasb_converted.pdf"');
      res.send(outputBuffer);

      status = 'success';
  } catch (error) {
      console.error('Error in convertToPdf:', error);
      errorMsg = error.message;
      res.status(500).json({ message: 'خطا در تبدیل تصاویر به PDF', error: error.message });
  }finally {
    await logToolUsage({
      userId,
      toolName: 'images-to-pdf',
      status,
      errorMessage: errorMsg,
      metadata: {
        inputSize: totalInputSize,
        outputSize: outputBuffer ? outputBuffer.length : null,
        inputFormat,
        outputFormat: 'application/pdf',
      },
      durationMs: Date.now() - startTime,
      ip,
      userAgent,
    });
  }
};

// Admin
// ------------------------------------------
// persian tool's names
const toolNamesFa = {
  'convert-image': 'تبدیل و فشرده‌سازی تصویر',
  'merge-pdf': 'ترکیب PDF',
  'compress-pdf': 'فشرده‌سازی PDF',
  'extract-pages': 'جداسازی صفحات PDF',
  'images-to-pdf': 'تبدیل تصاویر به PDF'
};
const allTools = Object.keys(toolNamesFa);

exports.getUsersToolUsage = async (req, res) => {
  try {
    // groupe based on userId and toolName
    const aggregation = await ToolUsageLog.aggregate([
      {
        $group: {
          _id: { userId: '$userId', toolName: '$toolName' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.userId',
          tools: {
            $push: { toolName: '$_id.toolName', count: '$count' }
          }
        }
      }
    ]);

    // create a map for each user
    const result = aggregation.map(user => {
      const countMap = {};
      user.tools.forEach(t => { countMap[t.toolName] = t.count; });

      // real value
      const usage = allTools.map(tool => ({
        toolName: tool,
        toolNameFa: toolNamesFa[tool],
        count: countMap[tool] || 0
      }));
      return {
        userId: user._id,
        usage
      };
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getUsersToolUsage:', error);
    res.status(500).json({ message: 'خطا در دریافت گزارش کاربران', error: error.message });
  }
};

exports.getToolPopularity = async (req, res) => {
  try {
    const totalCounts = await ToolUsageLog.aggregate([
      { $group: { _id: '$toolName', count: { $sum: 1 } } }
    ]);

    const totalAll = totalCounts.reduce((sum, item) => sum + item.count, 0);

    const popularity = allTools.map(tool => {
      const found = totalCounts.find(item => item._id === tool);
      const count = found ? found.count : 0;
      const percent = totalAll === 0 ? 0 : ((count / totalAll) * 100).toFixed(2);
      return {
        toolName: tool,
        toolNameFa: toolNamesFa[tool],
        count,
        percent: parseFloat(percent)
      };
    });
    popularity.sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      totalUsage: totalAll,
      data: popularity
    });
  } catch (error) {
    console.error('Error in getToolPopularity:', error);
    res.status(500).json({ message: 'خطا در دریافت محبوبیت ابزارها', error: error.message });
  }
};

exports.getToolPerformance = async (req, res) => {
  try {
    const performance = await ToolUsageLog.aggregate([
      {
        $group: {
          _id: '$toolName',
          totalInputSize: { $sum: '$metadata.inputSize' },
          totalOutputSize: { $sum: '$metadata.outputSize' },
          totalDurationMs: { $sum: '$durationMs' },
          successCount: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
          failedCount: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } }
        }
      }
    ]);
    const result = allTools.map(tool => {
      const found = performance.find(item => item._id === tool);
      if (found) {
        const totalCalls = found.successCount + found.failedCount;
        const successRate = totalCalls === 0 ? 0 : (found.successCount / totalCalls) * 100;
        return {
          toolName: tool,
          toolNameFa: toolNamesFa[tool],
          totalInputSize: found.totalInputSize || 0,
          totalOutputSize: found.totalOutputSize || 0,
          totalDurationMs: found.totalDurationMs || 0,
          successCount: found.successCount,
          failedCount: found.failedCount,
          totalCalls,
          successRate: parseFloat(successRate.toFixed(2))
        };
      } else {
        return {
          toolName: tool,
          toolNameFa: toolNamesFa[tool],
          totalInputSize: 0,
          totalOutputSize: 0,
          totalDurationMs: 0,
          successCount: 0,
          failedCount: 0,
          totalCalls: 0,
          successRate: 0
        };
      }
    });
    result.sort((a, b) => b.totalCalls - a.totalCalls);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getToolPerformance:', error);
    res.status(500).json({ message: 'خطا در دریافت عملکرد ابزارها', error: error.message });
  }
};