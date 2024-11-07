import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import Listing from "../../../../../models/Listing";
import Booking from "../../../../../models/Booking";

// GET request to fetch a single user by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = await params;
  const user = await User.findById(id);

  if (user) {
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
}

// PUT request to update a user by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = await params;
  const updatedUser = await request.json();
  const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });

  if (user) {
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
}

// CASCADE style DELETE request
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const { id } = await params;

  // Delete all bookings associated with the user's listings
  const listings = await Listing.find({ userId: id });
  const listingIds = listings.map((listing) => listing._id);
  await Booking.deleteMany({ property: { $in: listingIds } });

  // Delete all listings created by the user
  await Listing.deleteMany({ userId: id });

  // Delete the user
  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "User, associated listings and bookings deleted" },
    { status: 200 }
  );
}
