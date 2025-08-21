import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use('/api/users', authRoutes);

const PORT = process.env.PORT || 5001;

const setupAndStartServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

setupAndStartServer();
