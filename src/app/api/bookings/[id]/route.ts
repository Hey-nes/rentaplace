import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import Booking from "../../../../../models/Booking";

// GET request to fetch a single booking by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = params;
  const booking = await Booking.findById(id);

  if (booking) {
    return NextResponse.json(booking);
  } else {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }
}

// PUT request to update a booking by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = params;
  const updatedBooking = await request.json();
  const booking = await Booking.findByIdAndUpdate(id, updatedBooking, {
    new: true,
  });

  return booking
    ? NextResponse.json(booking)
    : NextResponse.json({ message: "Booking not found" }, { status: 404 });
}

// DELETE request to delete a booking by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = params;
  await Booking.findByIdAndDelete(id);
  return NextResponse.json(null, { status: 204 });
}
