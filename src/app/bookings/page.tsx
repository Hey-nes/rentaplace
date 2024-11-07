"use client";

import { useState, useEffect } from "react";

const BookingsPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch("/api/bookings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setBookings(data);
          } else {
            console.error("Failed to fetch bookings");
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      } else {
        alert("Please log in to view your bookings.");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center">
            <strong>No bookings here!</strong>
            <p>*crickets*</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="border p-4 rounded shadow-md">
              <p>
                <strong>Property:</strong> {booking.property}
              </p>
              <p>
                <strong>Check-in:</strong>{" "}
                {new Date(booking.checkinDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Check-out:</strong>{" "}
                {new Date(booking.checkoutDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Total Price:</strong> ${booking.totalPrice}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
