import mongoose from 'mongoose';

const FoodListingSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: { type: String, required: true },
  quantity: String,
  expiryDate: Date,
  pickupLocation: String,
  status: { type: String, enum: ['available', 'reserved', 'completed'], default: 'available' },
}, { timestamps: true });

const FoodListing = mongoose.model('FoodListing', FoodListingSchema);
export default FoodListing;