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
        const { products, clientName, clientEmail } = req.body as { products: ProductInput[], clientName: string, clientEmail: string };
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
            <meta charset="utf-8" />
            <title>Invoice #${newInvoice._id}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
                body {
                    font-family: 'Poppins', sans-serif;
                    color: #333;
                }
                .invoice-box {
                    max-width: 800px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #eee;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                    font-size: 16px;
                    line-height: 24px;
                }
                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 40px;
                    align-items: flex-start;
                }
                .invoice-header .title {
                    font-size: 45px;
                    line-height: 1;
                    font-weight: 700;
                    color: #333;
                }
                .invoice-header .invoice-details {
                    text-align: right;
                }
                .invoice-details p {
                    margin: 0;
                    line-height: 1.6;
                }
                .company-details {
                    text-align: left;
                }
                .company-details .name {
                    font-size: 24px;
                    font-weight: 600;
                    color: #008080; /* Teal Color */
                }
                .billing-details {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 40px;
                }
                .billing-details .bill-to, .billing-details .bill-from {
                    width: 48%;
                }
                .billing-details h5 {
                    margin: 0 0 10px 0;
                    font-size: 16px;
                    color: #555;
                    border-bottom: 2px solid #eee;
                    padding-bottom: 5px;
                }
                .billing-details p {
                    margin: 0;
                    line-height: 1.6;
                }
                .invoice-table {
                    width: 100%;
                    line-height: inherit;
                    text-align: left;
                    border-collapse: collapse;
                }
                .invoice-table thead tr {
                    background: #008080; /* Teal Color */
                    color: #fff;
                }
                .invoice-table th, .invoice-table td {
                    padding: 12px 15px;
                    vertical-align: top;
                }
                .invoice-table tbody tr {
                    border-bottom: 1px solid #eee;
                }
                .invoice-table tbody tr:nth-child(odd) {
                    background: #f7f9fc;
                }
                .invoice-table .align-right {
                    text-align: right;
                }
                .invoice-totals {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 30px;
                }
                .invoice-totals table {
                    width: 50%;
                    max-width: 350px;
                }
                .invoice-totals td {
                    padding: 8px 15px;
                }
                .invoice-totals .label {
                    text-align: right;
                }
                .invoice-totals .value {
                    text-align: right;
                    font-weight: 600;
                }
                .invoice-totals .total-row td {
                    border-top: 2px solid #ddd;
                    font-size: 18px;
                    color: #008080; /* Teal Color */
                }
                .invoice-footer {
                    text-align: center;
                    margin-top: 40px;
                    font-size: 14px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="invoice-box">
                <div class="invoice-header">
                    <div class="company-details">
                        <p class="name">Invoice Generator</p>
                    </div>
                    <div class="invoice-details">
                        <h1 class="title">INVOICE</h1>
                        <p><strong>Invoice #:</strong> ${newInvoice._id}</p>
                        <p><strong>Date Issued:</strong> ${invoiceDate}</p>
                    </div>
                </div>

                <div class="billing-details">
                    <div class="bill-from">
                        <h5>From</h5>
                        <p>
                            <strong>${user.name}</strong><br />
                            ${user.email}
                        </p>
                    </div>
                    <div class="bill-to">
                        <h5>Bill To</h5>
                        <p>
                            <strong>${clientName}</strong><br />
                            ${clientEmail}
                        </p>
                    </div>
                </div>

                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th class="align-right">Quantity</th>
                            <th class="align-right">Rate</th>
                            <th class="align-right">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${calculatedProducts.map((p: any) => `
                        <tr>
                            <td>${p.name}</td>
                            <td class="align-right">${p.quantity}</td>
                            <td class="align-right">₹${p.rate.toFixed(2)}</td>
                            <td class="align-right">₹${p.total.toFixed(2)}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>

                <div class="invoice-totals">
                    <table>
                        <tr>
                            <td class="label">Subtotal:</td>
                            <td class="value">₹${subTotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td class="label">GST (18%):</td>
                            <td class="value">₹${gst.toFixed(2)}</td>
                        </tr>
                        <tr class="total-row">
                            <td class="label"><strong>Total Amount:</strong></td>
                            <td class="value"><strong>₹${totalAmount.toFixed(2)}</strong></td>
                        </tr>
                    </table>
                </div>

                <div class="invoice-footer">
                    <p>Thank you for your business!</p>
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
            'Content-Disposition': `attachment; filename="invoice-${newInvoice._id}.pdf"`,
        });

        res.send(pdfBuffer);
    } catch (error: any) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: 'Server error during PDF generation.' });
    }
};