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
    // Fetch all listings
    const listings = await db.collection("listings").find({}).toArray();
    res.status(200).json(listings);
  } else if (req.method === "POST") {
    // Create a new listing
    const newListing = req.body;
    await db.collection("listings").insertOne(newListing);
    res.status(201).json(newListing);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
