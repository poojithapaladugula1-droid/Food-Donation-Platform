import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/routes/auth.js';
import foodRoutes from './src/routes/food.js';
import requestRoutes from './src/routes/request.js';
import donationRoutes from './src/routes/donations.js';  // ADD THIS LINE

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.log('❌ MongoDB connection error:', err.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/donations', donationRoutes);  // ADD THIS LINE

app.get('/', (req, res) => {
  res.send('Food Donation Platform API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));