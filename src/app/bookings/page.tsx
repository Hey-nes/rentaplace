"use client";

import { useState, useEffect } from "react";

interface Booking {
  _id: string;
  property: { name: string };
  checkinDate: string;
  checkoutDate: string;
  totalPrice: number;
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect to login page if no token
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchBookings = async () => {
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
          alert("Session expired. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        alert("An error occurred. Please try again later.");
      } finally {
        setLoading(false);  // Stop loading once data is fetched
      }
    };

    fetchBookings();
  }, []);

  const deleteBooking = async (id: string) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await fetch(`/api/bookings/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Filter out the deleted booking from the state
          setBookings((prevBookings) =>
            prevBookings.filter((booking) => booking._id !== id)
          );
        } else {
          console.error("Failed to delete booking");
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center">
              <strong>No bookings here!</strong>
              <p>*crickets*</p>
            </div>
          ) : (
            bookings.map(({ _id, property, checkinDate, checkoutDate, totalPrice }) => (
              <div key={_id} className="border p-4 rounded shadow-md">
                <p><strong>Property:</strong> {property.name}</p>
                <p><strong>Check-in:</strong> {new Date(checkinDate).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(checkoutDate).toLocaleDateString()}</p>
                <p><strong>Total Price:</strong> ${totalPrice}</p>
                <button
                  onClick={() => deleteBooking(_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                >
                  Delete Booking
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
