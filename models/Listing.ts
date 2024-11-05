import mongoose, { Schema, Document } from "mongoose";

export interface IListing extends Document {
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  availability: boolean;
}

const ListingSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  availability: { type: Boolean, default: true },
});

export default mongoose.model<IListing>("Listing", ListingSchema);
