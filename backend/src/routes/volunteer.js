import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import FoodListing from '../models/FoodListing.js';
import DeliveryAssignment from '../models/DeliveryAssignment.js';
import VolunteerRequest from '../models/VolunteerRequest.js';

const router = express.Router();

// Register as volunteer
router.post('/register', auth, async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ msg: 'User role must be volunteer' });
    }
    
    const { availability, maxDistance, transportMode } = req.body;
    const user = await User.findById(req.user.id);
    
    user.availability = availability;
    user.maxDistance = maxDistance;
    user.transportMode = transportMode;
    await user.save();
    
    res.json({ msg: 'Volunteer profile updated', user });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get available deliveries for volunteers
router.get('/available-deliveries', auth, async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    // Find assignments that need volunteers
    const assignments = await DeliveryAssignment.find({ 
      status: 'assigned',
      volunteer: null 
    })
    .populate('foodListing')
    .populate('donor', 'name phone address')
    .populate('recipient', 'name phone address');
    
    res.json(assignments);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Volunteer accepts a delivery
router.post('/accept-delivery/:assignmentId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    const assignment = await DeliveryAssignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    
    if (assignment.volunteer) {
      return res.status(400).json({ msg: 'Already assigned to a volunteer' });
    }
    
    assignment.volunteer = req.user.id;
    assignment.status = 'assigned';
    await assignment.save();
    
    // Create volunteer request record
    const volunteerRequest = new VolunteerRequest({
      volunteer: req.user.id,
      deliveryAssignment: assignment._id,
      status: 'accepted'
    });
    await volunteerRequest.save();
    
    res.json({ msg: 'Delivery accepted', assignment });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update delivery status (picked up, in transit, delivered)
router.put('/update-status/:assignmentId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    const { status, pickupProof, deliveryProof } = req.body;
    const assignment = await DeliveryAssignment.findById(req.params.assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }
    
    if (assignment.volunteer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not assigned to this delivery' });
    }
    
    assignment.status = status;
    if (pickupProof) assignment.pickupProof = pickupProof;
    if (deliveryProof) assignment.deliveryProof = deliveryProof;
    
    if (status === 'picked_up') assignment.pickupTime = new Date();
    if (status === 'delivered') {
      assignment.deliveryTime = new Date();
      
      // Update volunteer stats
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { totalDeliveries: 1 }
      });
      
      // Update food listing status
      await FoodListing.findByIdAndUpdate(assignment.foodListing, {
        status: 'completed'
      });
    }
    
    await assignment.save();
    res.json({ msg: `Status updated to ${status}`, assignment });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get volunteer's delivery history
router.get('/my-deliveries', auth, async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    const deliveries = await DeliveryAssignment.find({ volunteer: req.user.id })
      .populate('foodListing')
      .populate('donor', 'name phone address')
      .populate('recipient', 'name phone address')
      .sort('-createdAt');
    
    res.json(deliveries);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Rate volunteer (by donor or recipient)
router.post('/rate/:volunteerId', auth, async (req, res) => {
  try {
    const { rating, deliveryId } = req.body;
    const volunteer = await User.findById(req.params.volunteerId);
    
    if (!volunteer || volunteer.role !== 'volunteer') {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    
    // Verify that the rater was involved in this delivery
    const delivery = await DeliveryAssignment.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    if (delivery.donor.toString() !== req.user.id && 
        delivery.recipient.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to rate this volunteer' });
    }
    
    // Update volunteer's average rating
    const newRating = (volunteer.rating + rating) / 2;
    volunteer.rating = newRating;
    await volunteer.save();
    
    res.json({ msg: 'Volunteer rated successfully', newRating });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;