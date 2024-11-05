import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

// GET request to fetch a single user by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { id } = params;
  const user = await User.findById(id);

  if (user) {
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
}

// PUT request to update a user by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { id } = params;
  const updatedUser = await request.json();
  const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });

  if (user) {
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
}

// DELETE request to delete a user by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { id } = params;
  await User.findByIdAndDelete(id);
  return NextResponse.json(null, { status: 204 });
}
