import express from 'express';
import auth from '../middleware/auth.js';
import FoodListing from '../models/FoodListing.js';
import DonationRequest from '../models/DonationRequest.js';

const router = express.Router();

// Get donation statistics for dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role === 'donor') {
      const totalDonations = await FoodListing.countDocuments({ donor: req.user.id });
      const activeListings = await FoodListing.countDocuments({ 
        donor: req.user.id, 
        status: 'available' 
      });
      const completedDonations = await FoodListing.countDocuments({ 
        donor: req.user.id, 
        status: 'completed' 
      });
      
      res.json({
        totalDonations,
        activeListings,
        completedDonations,
        recipientsHelped: 0 // Calculate as needed
      });
    } else if (req.user.role === 'recipient') {
      const totalRequests = await DonationRequest.countDocuments({ recipient: req.user.id });
      const pendingRequests = await DonationRequest.countDocuments({ 
        recipient: req.user.id, 
        status: 'pending' 
      });
      
      res.json({
        totalRequests,
        pendingRequests,
        approvedRequests: 0
      });
    } else {
      res.status(403).json({ msg: 'Access denied' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all donations for donor
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    const donations = await FoodListing.find({ donor: req.user.id })
      .sort('-createdAt');
    
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;