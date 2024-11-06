"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Listing interface
interface Listing {
  _id: string;
  name: string;
  description: string;
  city: string;
  pricePerNight: number;
  availability: boolean;
}

const ListingsPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in by checking for JWT in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Fetch listings from the API route
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listings");
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchListings();
  }, []);

  const handleBookClick = (listingId: string) => {
    if (isLoggedIn) {
      // Handle booking logic
      console.log(`Booking listing with ID: ${listingId}`);
      // You can add booking functionality here
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Listings</h1>
      <div className="space-y-4">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="border p-4 rounded-lg shadow-md space-y-2 w-80"
          >
            <h2 className="text-xl font-semibold">{listing.name}</h2>
            <p>{listing.description}</p>
            <p className="font-semibold">City: {listing.city}</p>
            <p className="font-semibold">
              Price: ${listing.pricePerNight} / night
            </p>
            <p
              className={`text-sm ${
                listing.availability ? "text-green-500" : "text-red-500"
              }`}
            >
              {listing.availability ? "Available" : "Not Available"}
            </p>
            {isLoggedIn && listing.availability && (
              <button
                onClick={() => handleBookClick(listing._id)}
                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Book
              </button>
            )}
            {!isLoggedIn && listing.availability && (
              <button
                onClick={() => router.push("/login")}
                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Log in to Book
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsPage;
