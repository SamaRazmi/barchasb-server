const express = require('express');
const router = express.Router();
const {imageUpload, upload} = require('../utils/fileUploader');
const converterController = require('../controllers/converterCtrl');

/**
 * @swagger
 * /api/converter/image:
 *   post:
 *     summary: Image conversion and compression
 *     tags: [Converter]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to convert (maximum 10 MB)
 *               format:
 *                 type: string
 *                 description: Output format (allowed values ​​-> jpeg, png, webp, avif)
 *                 default: webp
 *               quality:
 *                 type: integer
 *                 description: Output quality between 1 and 100 (default 80)
 *                 default: 80
 *     responses:
 *       200:
 *         description: The converted image file was successfully created and is ready to download.
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid request (file not uploaded or format not supported)
 *       500:
 *         description: Server error processing image
 */
router.post('/image', imageUpload.single('image'), converterController.convertAndCompressImage);

/**
 * @swagger
 * /api/converter/merge-pdf:
 *   post:
 *     summary: Combine multiple PDF files
 *     tags: [Converter]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: PDF files to combine (minimum 2 and maximum 10 files)
 *     responses:
 *       200:
 *         description: Combined PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.post('/merge-pdf', upload.array('files', 10), converterController.mergePdfs);

/**
 * @swagger
 * /api/converter/compress-pdf:
 *   post:
 *     summary: PDF file compression (basic)
 *     tags: [Converter]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to compress
 *     responses:
 *       200:
 *         description: Compressed PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.post('/compress-pdf', upload.single('pdf'), converterController.compressPdf);

/**
 * @swagger
 * /api/converter/extract-pages:
 *   post:
 *     summary: Extract specific pages from a PDF file
 *     tags: [Converter]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - pages
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Original PDF file (maximum 50 MB)
 *               pages:
 *                 type: string
 *                 description: An array of page numbers as JSON strings (e.g. "[1, 3, 5]")
 *     responses:
 *       200:
 *         description: New PDF file containing extracted pages
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Validation error or invalid format
 *       500:
 *         description: Server error
 */
router.post('/extract-pages', upload.single('file'), converterController.extractPdfPages);

/**
 * @swagger
 * /api/converter/to-pdf:
 *   post:
 *     summary: Convert one or more images (JPG/PNG/WebP) to a PDF file
 *     tags: [Converter]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files (up to 10 files, each up to 50 MB)
 *     responses:
 *       200:
 *         description: Output PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Unsupported file format error or file not sent
 *       500:
 *         description: Server Error
 */
router.post('/to-pdf', imageUpload.array('files', 10), converterController.convertToPdf);

module.exports = router;
