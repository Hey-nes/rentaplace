import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../models/User";
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
    // Fetch a single user by ID
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id as string) });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else if (req.method === "PUT") {
    // Update a user by ID
    const updatedUser = req.body;
    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id as string) }, { $set: updatedUser });
    res.status(200).json(updatedUser);
  } else if (req.method === "DELETE") {
    // Delete a user by ID
    await db.collection("users").deleteOne({ _id: new ObjectId(id as string) });
    res.status(204).end();
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
