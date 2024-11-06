import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import Listing from "../../../../../models/Listing";

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

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    updatedData,
    { new: true }
  );

  if (!updatedListing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json(updatedListing);
}

// DELETE request to delete a listing by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = await params;
  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Listing deleted" }, { status: 200 });
}
