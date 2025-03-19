import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <>
      <div className="bg-gray-100 p-4 md:px-10 flex justify-between items-center shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="hover:cursor-pointer hover:opacity-50 transition-all"
        >
          <img src="/home.svg" alt="home icon" width={20} />
        </div>
        <div onClick={logout}>
          <img
            src="/log-out.svg"
            alt="logout icon"
            width={20}
            className="hover:cursor-pointer hover:opacity-50 transition-all"
          />
        </div>
      </div>
    </>
  );
}
