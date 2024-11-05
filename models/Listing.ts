// models/Listing.js
import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  availability: { type: Boolean, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
});

const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);

export default Listing;
