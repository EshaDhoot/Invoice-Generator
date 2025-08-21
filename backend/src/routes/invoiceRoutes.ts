import express from 'express';
import { generatePdf } from '../controllers/invoiceController';
import { authenticateUser } from '../middlewares/authMiddleware';
import { validateInvoiceCreation } from '../middlewares/validationMiddleware';

const router = express.Router();

router.post('/generate-pdf', authenticateUser, validateInvoiceCreation, generatePdf);

export default router;