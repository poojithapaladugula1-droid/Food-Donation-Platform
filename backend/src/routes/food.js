import express from 'express';
import {
  createFoodListing,
  getAvailableFood,
  getFoodListingById,
  updateFoodListing,
  deleteFoodListing,
  getMyListings
} from '../controllers/foodController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createFoodListing);
router.get('/', getAvailableFood);
router.get('/my-listings', auth, getMyListings);
router.get('/:id', getFoodListingById);
router.put('/:id', auth, updateFoodListing);
router.delete('/:id', auth, deleteFoodListing);

export default router;