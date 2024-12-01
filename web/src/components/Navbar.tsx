import React from "react";
import { Link } from "react-router";
import LogoutButton from "@/components/LogoutButton.tsx";

export default function Navbar(): React.ReactElement {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-gray-800"
            >
              Osopags Dashboard
            </Link>
          </div>
          <div className="flex items-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}