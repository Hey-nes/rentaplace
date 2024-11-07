import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import Listing from "../../../../../models/Listing";
import Booking from "../../../../../models/Booking";

// GET request to get a single listing by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = await params;
  const listing = await Listing.findById(id);

  if (!listing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json(listing);
}

// PUT request to update a listing by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = await params;
  const updatedData = await request.json();

  const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {
    new: true,
  });

  if (!updatedListing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json(updatedListing);
}

// CASCADE style DELETE request
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = await params;

  // Delete all bookings associated with the listing
  await Booking.deleteMany({ property: id });

  // Now, delete the listing itself
  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Listing and associated bookings deleted" },
    { status: 200 }
  );
}
