import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthorized } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isAuthorized === null) {
    return <Loading />;
  }
  useEffect(() => {
    const checkUser = () => {
      if (!isAuthorized) {
        return navigate("/login");
      }
      if (
        isAuthorized &&
        (location.pathname === "/login" || location.pathname === "/register")
      ) {
        return navigate("/login");
      }
    };
    checkUser();
  }, []);

  return children;
}
