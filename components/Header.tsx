"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = ({ username }: { username: string }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) console.error("Failed to sign out!");

    router.push("/sign-in");
  };

  // Get initials from username
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="w-full fixed top-0 z-50 backdrop-blur-md">
      <header
        className="flex justify-between items-center w-[80%] mx-auto p-4 mt-6 bg-white flex-wrap border-b rounded-4xl shadow-xl"
        style={{ boxShadow: "0 0 25px -5px rgba(129, 129, 129, 0.3)" }}
      >
        {/* Logo + Name */}
        <div className="flex items-center gap-2">
          <img src="/logo-1.png" alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-bold">Litsamaiso</span>
        </div>

        {/* Hamburger menu for mobile */}
        <button
          className="sm:hidden flex flex-col justify-center items-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span
            className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
              isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
            }`}
          ></span>
          <span
            className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
              isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
            }`}
          ></span>
        </button>

        {/* Right-side: Nav + User Info */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row sm:items-center sm:gap-6 w-full sm:w-auto mt-4 sm:mt-0`}
        >
          {/* Navigation Links */}
          <nav className="flex flex-col sm:flex-row gap-4 text-sm font-medium justify-center">
            <Link
              href="/updates"
              className="p-2 sm:p-0 hover:bg-gray-100 sm:hover:bg-transparent rounded"
            >
              Updates
            </Link>
            <Link
              href="/issues"
              className="p-2 sm:p-0 hover:bg-gray-100 sm:hover:bg-transparent rounded"
            >
              Issues
            </Link>
            <Link
              href="/confirmation"
              className="p-2 sm:p-0 hover:bg-gray-100 sm:hover:bg-transparent rounded"
            >
              Confirmation
            </Link>
          </nav>

          {/* User Info */}
          <div className="flex items-center gap-3 mt-2 sm:mt-0 sm:ml-4">
            <div
              className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              {getInitials(username)}
            </div>
            <span className="text-sm font-medium">{username}</span>
            {/* Back Button */}
            <img
              src="/logout.png"
              alt="Go Back"
              className="h-6 w-6 cursor-pointer"
              onClick={handleLogout}
            />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
