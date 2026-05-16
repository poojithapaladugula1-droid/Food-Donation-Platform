import DonationRequest from '../models/DonationRequest.js';
import FoodListing from '../models/FoodListing.js';

export const createRequest = async (req, res) => {
  try {
    if (req.user.role !== 'recipient') {
      return res.status(403).json({ msg: 'Access denied. Recipients only.' });
    }
    
    const foodItem = await FoodListing.findById(req.params.foodId);
    if (!foodItem) {
      return res.status(404).json({ msg: 'Food listing not found' });
    }
    
    if (foodItem.status !== 'available') {
      return res.status(400).json({ msg: 'Food is no longer available' });
    }

    const existingRequest = await DonationRequest.findOne({ 
      foodItem: req.params.foodId, 
      recipient: req.user.id 
    });
    
    if (existingRequest) {
      return res.status(400).json({ msg: 'You have already requested this food' });
    }

    const request = new DonationRequest({
      foodItem: req.params.foodId,
      recipient: req.user.id
    });
    
    await request.save();
    
    foodItem.status = 'reserved';
    await foodItem.save();
    
    res.status(201).json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await DonationRequest.find({ recipient: req.user.id })
      .populate('foodItem');
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getDonorRequests = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    const foodListings = await FoodListing.find({ donor: req.user.id });
    const foodIds = foodListings.map(food => food._id);
    
    const requests = await DonationRequest.find({ foodItem: { $in: foodIds } })
      .populate('foodItem')
      .populate('recipient', 'name email phone address');
    
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const request = await DonationRequest.findById(req.params.requestId)
      .populate('foodItem');
    
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }
    
    const foodItem = await FoodListing.findById(request.foodItem._id);
    if (foodItem.donor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    request.status = status;
    await request.save();
    
    if (status === 'rejected') {
      foodItem.status = 'available';
      await foodItem.save();
    }
    
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};