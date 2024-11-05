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
    // Fetch a single listing by ID
    const listing = await db
      .collection("listings")
      .findOne({ _id: new ObjectId(id as string) });
    if (listing) {
      res.status(200).json(listing);
    } else {
      res.status(404).json({ message: "Listing not found" });
    }
  } else if (req.method === "PUT") {
    // Update a listing by ID
    const updatedListing = req.body;
    await db
      .collection("listings")
      .updateOne({ _id: new ObjectId(id as string) }, { $set: updatedListing });
    res.status(200).json(updatedListing);
  } else if (req.method === "DELETE") {
    // Delete a listing by ID
    await db
      .collection("listings")
      .deleteOne({ _id: new ObjectId(id as string) });
    res.status(204).end();
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
