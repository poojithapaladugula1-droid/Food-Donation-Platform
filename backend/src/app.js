import express from 'express';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import connectDB from './src/db/database.js';
import User from './src/models/User.js';
import Donation from './src/models/Donation.js';
import { protect, admin } from './src/middlewares/auth.js';
import { config } from './config.js';

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '30d' });
    
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '30d' });
    
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get profile
app.get('/api/auth/profile', protect, async (req, res) => {
  res.json(req.user);
});

// ============ USER ROUTES ============

// Get all users (admin only)
app.get('/api/admin/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
app.put('/api/admin/users/:userId/role', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status
app.put('/api/admin/users/:userId/status', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: req.body.status },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
app.delete('/api/admin/users/:userId', protect, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ DONATION ROUTES ============

// Create donation
app.post('/api/donations', protect, async (req, res) => {
  try {
    const donation = await Donation.create({
      ...req.body,
      donor: req.user._id,
    });
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my donations
app.get('/api/donations/my', protect, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available donations
app.get('/api/donations/available', protect, async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'pending' }).populate('donor', 'name email');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all donations (admin)
app.get('/api/admin/donations', protect, admin, async (req, res) => {
  try {
    const donations = await Donation.find().populate('donor', 'name email').populate('volunteer', 'name email');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete donation (admin)
app.delete('/api/admin/donations/:donationId', protect, admin, async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.donationId);
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending donations (admin)
app.get('/api/admin/donations/pending', protect, admin, async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'pending' }).populate('donor', 'name email');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin stats
app.get('/api/admin/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalDonations = await Donation.countDocuments();
    const pendingDonations = await Donation.countDocuments({ status: 'pending' });
    const completedDonations = await Donation.countDocuments({ status: 'completed' });
    
    res.json({
      totalUsers,
      totalDonors,
      totalVolunteers,
      totalDonations,
      pendingDonations,
      completedDonations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Volunteer stats
app.get('/api/admin/volunteers', protect, admin, async (req, res) => {
  try {
    const volunteers = await User.aggregate([
      { $match: { role: 'volunteer' } },
      { $lookup: { from: 'donations', localField: '_id', foreignField: 'volunteer', as: 'deliveries' } },
      { $addFields: { 
        completedDeliveries: { $size: { $filter: { input: '$deliveries', as: 'd', cond: { $eq: ['$$d.status', 'completed'] } } } }
      } },
      { $project: { name: 1, email: 1, completedDeliveries: 1, points: 1 } }
    ]);
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ VOLUNTEER ROUTES ============

// Accept donation
app.post('/api/volunteer/accept/:donationId', protect, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.donationId,
      { status: 'accepted', volunteer: req.user._id },
      { new: true }
    );
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my deliveries
app.get('/api/volunteer/deliveries', protect, async (req, res) => {
  try {
    const deliveries = await Donation.find({ 
      volunteer: req.user._id,
      status: { $in: ['accepted', 'completed'] }
    }).populate('donor', 'name email location');
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update delivery status
app.put('/api/volunteer/delivery/:deliveryId', protect, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.deliveryId,
      { status: req.body.status },
      { new: true }
    );
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get volunteer stats
app.get('/api/volunteer/stats', protect, async (req, res) => {
  try {
    const completedDeliveries = await Donation.countDocuments({ 
      volunteer: req.user._id, 
      status: 'completed' 
    });
    res.json({ completedDeliveries, points: req.user.points || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard
app.get('/api/volunteer/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      { $match: { role: 'volunteer' } },
      { $lookup: { from: 'donations', localField: '_id', foreignField: 'volunteer', as: 'deliveries' } },
      { $addFields: { completedDeliveries: { $size: { $filter: { input: '$deliveries', as: 'd', cond: { $eq: ['$$d.status', 'completed'] } } } } } },
      { $sort: { completedDeliveries: -1 } },
      { $limit: 10 },
      { $project: { name: 1, email: 1, completedDeliveries: 1 } }
    ]);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});