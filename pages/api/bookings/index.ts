import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

type Method = "GET" | "POST";

export default async function handler(
  req: NextApiRequest & { method?: Method },
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === "GET") {
    // Fetch all bookings
    const bookings = await db.collection("bookings").find({}).toArray();
    res.status(200).json(bookings);
  } else if (req.method === "POST") {
    // Create a new booking
    const newBooking = req.body;
    await db.collection("bookings").insertOne(newBooking);
    res.status(201).json(newBooking);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
