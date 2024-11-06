"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutUser } from "../../../lib/auth";

const TopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      logoutUser();
      setIsLoggedIn(false);
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow-md z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">Rent a Place</Link>
        </div>
        <div className="space-x-4">
          <Link href="/listings">Listings</Link>
          <Link href="/booking">Bookings</Link>
          <button onClick={handleAuthButtonClick} className="text-blue-500">
            {isLoggedIn ? "Log out" : "Log in"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
