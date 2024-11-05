import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function GET() {
  await connectToDatabase();
  const users = await User.find({});
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  await connectToDatabase();
  const newUser = await request.json();
  const user = await User.create(newUser);
  return NextResponse.json(user, { status: 201 });
}
