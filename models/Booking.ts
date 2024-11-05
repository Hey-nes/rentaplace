import mongoose, { Schema, Document } from 'mongoose';

interface ICustomer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface IBooking extends Document {
  createdDate: Date;
  checkinDate: Date;
  checkoutDate: Date;
  totalPrice: number;
  customer: ICustomer;
  createdBy: mongoose.Types.ObjectId; // Reference to User-model
  property: mongoose.Types.ObjectId;   // Reference to Listing-model
}

const BookingSchema: Schema = new Schema({
  createdDate: { type: Date, default: Date.now },
  checkinDate: { type: Date, required: true },
  checkoutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
