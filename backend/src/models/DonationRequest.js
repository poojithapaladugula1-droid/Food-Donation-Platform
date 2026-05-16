import mongoose from 'mongoose';

const DonationRequestSchema = new mongoose.Schema({
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodListing', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const DonationRequest = mongoose.model('DonationRequest', DonationRequestSchema);
export default DonationRequest;