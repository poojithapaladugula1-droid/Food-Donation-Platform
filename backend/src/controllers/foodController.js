import FoodListing from '../models/FoodListing.js';

export const createFoodListing = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ msg: 'Access denied. Donors only.' });
    }
    
    const { foodName, quantity, expiryDate, pickupLocation } = req.body;
    
    const newListing = new FoodListing({
      donor: req.user.id,
      foodName,
      quantity,
      expiryDate,
      pickupLocation,
    });
    
    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getAvailableFood = async (req, res) => {
  try {
    const listings = await FoodListing.find({ status: 'available' })
      .populate('donor', 'name phone address');
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getFoodListingById = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id)
      .populate('donor', 'name phone address');
    if (!listing) {
      return res.status(404).json({ msg: 'Food listing not found' });
    }
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const updateFoodListing = async (req, res) => {
  try {
    let listing = await FoodListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ msg: 'Food listing not found' });
    }
    
    if (listing.donor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    const { foodName, quantity, expiryDate, pickupLocation, status } = req.body;
    
    listing = await FoodListing.findByIdAndUpdate(
      req.params.id,
      { foodName, quantity, expiryDate, pickupLocation, status },
      { new: true }
    );
    
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const deleteFoodListing = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ msg: 'Food listing not found' });
    }
    
    if (listing.donor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await listing.deleteOne();
    res.json({ msg: 'Food listing removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getMyListings = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    const listings = await FoodListing.find({ donor: req.user.id })
      .sort('-createdAt');
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};