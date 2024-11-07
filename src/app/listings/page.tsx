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
  userId: string; // Add userId to each listing
}

// Modal component
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const ListingsPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentListingId, setCurrentListingId] = useState<string | null>(null);
  const [listingFormData, setListingFormData] = useState({
    name: "",
    description: "",
    city: "",
    pricePerNight: 0,
    availability: true,
  });
  const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    checkinDate: "",
    checkoutDate: "",
  });
  const [currentListing, setCurrentListing] = useState<Listing | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.id);
      setIsAdmin(decodedToken.isAdmin);
    }

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

  // Hook to calculate total price of bookings
  useEffect(() => {
    if (
      !currentListing ||
      !bookingData.checkinDate ||
      !bookingData.checkoutDate
    ) {
      setTotalPrice(0); // Resets if dates or listing are missing
      return;
    }

    const checkin = new Date(bookingData.checkinDate);
    const checkout = new Date(bookingData.checkoutDate);
    const nights =
      (checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24);

    // Ensure nights is positive before calculating
    if (nights > 0) {
      setTotalPrice(nights * currentListing.pricePerNight);
    } else {
      setTotalPrice(0); // Prevent negative or zero total price
    }
  }, [bookingData.checkinDate, bookingData.checkoutDate, currentListing]);

  //Listing related functions
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setListingFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to submit the form.");
      return;
    }

    try {
      const url = isEditing
        ? `/api/listings/${currentListingId}`
        : "/api/listings";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(listingFormData),
      });

      if (!response.ok) {
        throw new Error(
          isEditing ? "Failed to update listing" : "Failed to create listing"
        );
      }

      const data = await response.json();

      setListings((prev) =>
        isEditing
          ? prev.map((listing) =>
              listing._id === currentListingId ? data : listing
            )
          : [data, ...prev]
      );

      setShowForm(false);
      setListingFormData({
        name: "",
        description: "",
        city: "",
        pricePerNight: 0,
        availability: true,
      });
      setIsEditing(false);
      setCurrentListingId(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEditClick = (listing: Listing) => {
    setIsEditing(true);
    setCurrentListingId(listing._id);
    setListingFormData({
      name: listing.name,
      description: listing.description,
      city: listing.city,
      pricePerNight: listing.pricePerNight,
      availability: listing.availability,
    });
    setShowForm(true);
  };

  const handleDeleteClick = async (listingId: string) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(`/api/listings/${listingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setListings(listings.filter((listing) => listing._id !== listingId));
      console.log("Listing deleted");
    } else {
      console.error("Failed to delete listing");
    }
  };

  //Booking related functions
  const handleBooking = (listing: Listing) => {
    setCurrentListing(listing);
    setShowBookingForm(true);
  };

  const handleBookingFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !userId || !currentListing) return;

    const bookingPayload = {
      customer: {
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        phone: bookingData.phone,
        email: bookingData.email,
      },
      createdDate: new Date().toISOString(),
      checkinDate: bookingData.checkinDate,
      checkoutDate: bookingData.checkoutDate,
      totalPrice,
      createdBy: userId,
      property: currentListing._id,
    };

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingPayload),
    });

    if (response.ok) {
      setShowBookingForm(false);
      console.log("Booking successful!");
    } else {
      console.error("Booking failed.");
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
            {isLoggedIn && (
              <div className="flex space-x-4 mt-2">
                {(listing.userId === userId || isAdmin) && (
                  <>
                    <button
                      onClick={() => handleEditClick(listing)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(listing._id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleBooking(listing)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Book
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Listing" : "Create New Listing"}
          </h2>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={50}
            value={listingFormData.name}
            onChange={handleFormChange}
            placeholder="Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            id="description"
            name="description"
            type="text"
            maxLength={50}
            value={listingFormData.description}
            onChange={handleFormChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
            required
          />
          <input
            id="city"
            name="city"
            type="text"
            maxLength={50}
            value={listingFormData.city}
            onChange={handleFormChange}
            placeholder="City"
            className="w-full p-2 border rounded"
            required
          />
          <input
            id="pricePerNight"
            name="pricePerNight"
            type="number"
            value={listingFormData.pricePerNight}
            onChange={handleFormChange}
            placeholder="Price per Night"
            className="w-full p-2 border rounded"
            required
          />
          <div>
            <label className="font-semibold">Available:</label>
            <input
              id="availability"
              name="availability"
              type="checkbox"
              checked={listingFormData.availability}
              onChange={(e) =>
                setListingFormData((prev) => ({
                  ...prev,
                  availability: e.target.checked,
                }))
              }
              className="ml-2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
          >
            {isEditing ? "Save Changes" : "Submit"}
          </button>
        </form>
      </Modal>

      <Modal isOpen={showBookingForm} onClose={() => setShowBookingForm(false)}>
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            Book {currentListing?.name}
          </h2>
          <input
            name="firstName"
            placeholder="First Name"
            type="text"
            maxLength={50}
            onChange={handleBookingFormChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            type="text"
            maxLength={50}
            onChange={handleBookingFormChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="phone"
            placeholder="Phone"
            type="tel"
            pattern="[0-9]{10}"
            maxLength={10}
            onChange={handleBookingFormChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            maxLength={50}
            onChange={handleBookingFormChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="checkinDate"
            type="date"
            onChange={handleBookingFormChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="checkoutDate"
            type="date"
            onChange={handleBookingFormChange}
            required
            className="w-full p-2 border rounded"
          />
          <p className="font-semibold">Total Price: ${totalPrice}</p>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Confirm Booking
          </button>
        </form>
      </Modal>

      {isLoggedIn && !isEditing && (
        <button
          onClick={() => {
            setIsEditing(false);
            setShowForm(true);
          }}
          className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Create New Listing
        </button>
      )}
    </div>
  );
};

export default ListingsPage;
