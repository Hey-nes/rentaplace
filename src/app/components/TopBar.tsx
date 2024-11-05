"use client";
import Link from "next/link";
import { useUserContext } from "../context/UserContext";

const TopBar = () => {
  const { isLoggedIn, logout } = useUserContext();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">Rent a Place</Link>
        </div>
        <div className="space-x-4">
          <Link href="/listings">Listings</Link>
          <Link href="/booking">Bookings</Link>
          {isLoggedIn ? (
            <button onClick={logout} className="text-blue-500">
              Log out
            </button>
          ) : (
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
