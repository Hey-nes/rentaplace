import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../models/User";
import clientPromise from "../../../lib/mongodb";

type Method = "GET" | "POST";

export default async function handler(
  req: NextApiRequest & { method?: Method },
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === "GET") {
    // Fetch users
    const users = await db.collection("users").find({}).toArray();
    res.status(200).json(users);
  } else if (req.method === "POST") {
    // Create a new user
    const newUser = req.body;
    await db.collection("users").insertOne(newUser);
    res.status(201).json(newUser);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
