import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Listing from "../../../../models/Listing";
import jwt from "jsonwebtoken";

// GET request to fetch all listings
export async function GET() {
  await connectToDatabase();
  const listings = await Listing.find({});
  return NextResponse.json(listings);
}

// POST request to create new listing
export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  let userId;

  try {
    const decodedToken = jwt.verify(token, jwtSecret) as { id: string };
    userId = decodedToken.id;
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  await connectToDatabase();
  const newListing = await request.json();
  const listing = await Listing.create({ ...newListing, userId });
  return NextResponse.json(listing, { status: 201 });
}
