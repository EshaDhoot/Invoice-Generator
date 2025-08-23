import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import invoiceRoutes from './routes/invoiceroutes';
import cors from 'cors';


dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(cors());
app.use('/api/users', authRoutes);
app.use('/api/invoices', invoiceRoutes);

const PORT = process.env.PORT || 5001;

const setupAndStartServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

setupAndStartServer();
