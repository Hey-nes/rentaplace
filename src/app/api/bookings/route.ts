import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Booking from "../../../../models/Booking";

// GET request to fetch all bookings
export async function GET() {
  await connectToDatabase();
  const bookings = await Booking.find({});
  return NextResponse.json(bookings);
}

// POST request to create a new booking
export async function POST(request: Request) {
  await connectToDatabase();
  const newBooking = await request.json();
  const booking = await Booking.create(newBooking);
  return NextResponse.json(booking, { status: 201 });
}
