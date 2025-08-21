import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    total: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    products: [productSchema],
    subTotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;