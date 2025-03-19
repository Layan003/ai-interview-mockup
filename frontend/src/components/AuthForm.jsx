import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

export default function AuthForm({ method, route }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { getUserData, isAuthorized, setIsAuthorized } = useAuth();

  if (isAuthorized) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (method == "login") {
        const res = await api.post("token/", { username, password });
        localStorage.setItem("token", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        getUserData();
        setIsAuthorized(true);
        setLoading(false);
        navigate("/");
      } else if (method == "register") {
        const res = await api.post("user/register/", { username, password });
        setSuccess("Registration successful. Please login.");
        setUsername("");
        setPassword("");
        setLoading(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh] bg-gray-100">
      {!loading && (
        <form
          onSubmit={handleSubmit}
          className="w-[90%] md:w-[60%] lg:w-[30%] bg-white rounded-lg shadow-xl px-10 py-5 flex flex-col items-center gap-4 md:gap-6"
        >
          <h2 className="text-lg font-semibold md:text-2xl">
            {method === "register" ? "Register" : "Login"}
          </h2>
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="">{success}</div>}
          <div className="flex justify-between items-center gap-5 min-w-[100%]">
            <label htmlFor="username" className="md:text-xl">
              Username:
            </label>
            <input
              type="text"
              value={username}
              className="bg-gray-100 shadow-sm px-2 py-1 md:py-4 lg:py-2 flex-grow"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center gap-5 mb-4 min-w-[100%]">
            <label htmlFor="password" className="md:text-xl">
              Password:
            </label>
            <input
              type="password"
              value={password}
              className="bg-gray-100 shadow-sm px-2 py-1 flex-grow md:py-4 lg:py-2"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="w-[100%] flex flex-col gap-2">
            <button
              type="submit"
              className="bg-blue px-4 py-2 rounded shadow-sm text-white w-[100%] hover:bg-blue-800 hover:transition md:text-xl md:py-4 lg:py-2"
            >
              {method === "register" ? "Register" : "Login"}
            </button>
          </div>
          {method === "login" && (
            <p className=" md:text-xl">
              Don't have an account? {""}
              <span
                className="text-blue hover:underline"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
          )}
          {method === "register" && (
            <p className="md:text-xl">
              Already have an account? {""}
              <span
                className="text-blue hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          )}
        </form>
      )}
      {loading && <Loading />}
    </div>
  );
}
