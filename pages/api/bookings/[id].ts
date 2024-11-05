import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

type Method = "GET" | "PUT" | "DELETE";

export default async function handler(
  req: NextApiRequest & { method?: Method },
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db();
  const { id } = req.query;

  if (req.method === "GET") {
    // Fetch a single booking by ID
    const booking = await db
      .collection("bookings")
      .findOne({ _id: new ObjectId(id as string) });
    if (booking) {
      res.status(200).json(booking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } else if (req.method === "PUT") {
    // Update a booking by ID
    const updatedBooking = req.body;
    await db
      .collection("bookings")
      .updateOne({ _id: new ObjectId(id as string) }, { $set: updatedBooking });
    res.status(200).json(updatedBooking);
  } else if (req.method === "DELETE") {
    // Delete a booking by ID
    await db
      .collection("bookings")
      .deleteOne({ _id: new ObjectId(id as string) });
    res.status(204).end();
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
