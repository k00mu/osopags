import React from "react";
import { useNavigate } from "react-router";

export default function LogoutButton(): React.ReactElement {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("userToken");
    // Redirect to login page
    navigate("/signin");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
} 