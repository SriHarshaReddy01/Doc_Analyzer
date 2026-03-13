const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { pool } = require('../db');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

/**
 * @openapi
 * /extract:
 *   post:
 *     summary: Extract text from a PDF file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF file (max 20 MB)
 *     responses:
 *       200:
 *         description: Text extracted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExtractionResult'
 *       400:
 *         description: No file uploaded or not a PDF
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Extraction failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/extract', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  try {
    const data = await pdfParse(req.file.buffer);

    await pool.query(
      'INSERT INTO upload_history (filename, extracted_text) VALUES ($1, $2)',
      [req.file.originalname, data.text]
    );

    res.json({ text: data.text, filename: req.file.originalname });
  } catch (err) {
    console.error('PDF extraction error:', err);
    res.status(500).json({ error: 'Failed to extract text from PDF' });
  }
});

/**
 * @openapi
 * /history:
 *   get:
 *     summary: Get the 5 most recent upload records
 *     responses:
 *       200:
 *         description: List of recent uploads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HistoryItem'
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/history', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, filename, extracted_text, uploaded_at FROM upload_history ORDER BY uploaded_at DESC LIMIT 5'
    );
    res.json(rows);
  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
