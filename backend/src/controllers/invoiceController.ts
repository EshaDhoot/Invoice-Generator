import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import Invoice from '../models/Invoice';
import { IGetUserAuthInfoRequest } from '../middlewares/authMiddleware';

interface ProductInput {
    name: string;
    quantity: number;
    rate: number;
}
export const generatePdf = async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
        const { products, clientName, clientEmail } = req.body as { products: ProductInput[], 
            clientName: string, clientEmail: string };
        const user = req.user;
       
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const calculatedProducts = products.map(p => ({
            ...p,
            total: p.quantity * p.rate
        }));
        const subTotal = calculatedProducts.reduce((acc, p) => acc + p.total, 0);
        const gst = subTotal * 0.18;
        const totalAmount = subTotal + gst;
        
        const newInvoice = new Invoice({
            user: user._id,
            userName: user.name,
            userEmail: user.email,
            products: calculatedProducts,
            subTotal,
            gst,
            totalAmount,
            clientName,
            clientEmail,
        });
        await newInvoice.save();

        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        const invoiceDate = newInvoice.createdAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: sans-serif; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); font-size: 16px; line-height: 24px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .header .title { font-size: 45px; line-height: 45px; color: #333; }
            .user-details { text-align: right; }
            table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
            table td { padding: 5px; vertical-align: top; }
            table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
            table tr.item td { border-bottom: 1px solid #eee; }
            .totals { text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
                <div>INVOICE GENERATOR</div>
                <div>Date: ${invoiceDate}</div>
            </div>
            <div class="user-details">
                <div>${clientName}</div>
                <div>${clientEmail}</div>
            </div>
            <table>
                <tr class="heading"><td>Product</td><td>Qty</td><td>Rate</td><td>Total Amount</td></tr>
                ${calculatedProducts.map((p: any) => `<tr class="item"><td>${p.name}</td><td>${p.quantity}</td><td>${p.rate}</td><td>USD ${p.total.toFixed(2)}</td></tr>`).join('')}
            </table>
            <div class="totals">
                <div>Total Charges: $${subTotal.toFixed(2)}</div>
                <div>GST (18%): $${gst.toFixed(2)}</div>
                <div><b>Total Amount: $${totalAmount.toFixed(2)}</b></div>
            </div>
          </div>
        </body>
        </html>`;

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': 'attachment; filename="invoice.pdf"',
        });

        res.send(pdfBuffer);
    } catch (error: any) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: 'Server error during PDF generation.' });
    }
};