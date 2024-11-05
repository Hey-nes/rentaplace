import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import Listing from "../../../../../models/Listing";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const listing = await Listing.findById(params.id);

  if (!listing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json(listing);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const updatedData = await request.json();

  const updatedListing = await Listing.findByIdAndUpdate(
    params.id,
    updatedData,
    { new: true }
  );

  if (!updatedListing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json(updatedListing);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const deletedListing = await Listing.findByIdAndDelete(params.id);

  if (!deletedListing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Listing deleted" }, { status: 200 });
}
