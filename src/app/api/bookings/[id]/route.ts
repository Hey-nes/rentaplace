import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import Booking from "../../../../../models/Booking";

// GET request to fetch a single booking by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = await params;
  const booking = await Booking.findById(id);

  return booking
    ? NextResponse.json(booking)
    : NextResponse.json({ message: "Booking not found" }, { status: 404 });
}

// PUT request to update a booking by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = await params;
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
  const { id } = await params;
  const deletedBooking = await Booking.findByIdAndDelete(id);

  if (!deletedBooking) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Booking deleted" }, { status: 200 });
}
