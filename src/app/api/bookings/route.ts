import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Booking from "../../../../models/Booking";
import jwt, { JwtPayload } from "jsonwebtoken";

// Helper function to get user ID from the JWT token
const getUserIdFromToken = (token: string) => {
  try {
    // Decodes the token and assert that it is of type JwtPayload
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// GET request to fetch all bookings
export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  // Fetch bookings only for the logged-in user, and populate the 'property' field with the 'name' from Listing
  const bookings = await Booking.find({ createdBy: userId }).populate(
    "property",
    "name"
  ); // Populating 'property' with the 'name' of the listing

  return NextResponse.json(bookings);
}

// POST request to create a new booking
export async function POST(request: Request) {
  await connectToDatabase();
  const newBooking = await request.json();
  const booking = await Booking.create(newBooking);
  return NextResponse.json(booking, { status: 201 });
}
