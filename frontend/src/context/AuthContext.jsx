import { useEffect, useState } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userData, setUserData] = useState({ username: "", id: null });

  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem("token");
      console.log("token: ", token);

      if (token) {
        const decoded = jwtDecode(token);
        const tokenExp = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExp < now) {
          await refreshToken();
        } else {
          setIsAuthorized(true);
        }
      } else {
        setIsAuthorized(false);
      }
    };
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    try {
      const res = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.access);
        const decoded = jwtDecode(res.data.access);
        setIsAuthorized(true);
        setUser(decoded);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed", error);
      logout();
      localStorage.clear();
    }
    return false;
  };

  const getUserData = async () => {
    try {
      const res = await api.get("user/");
      if (res.status == 200) {
        console.log(res.data);
        setUserData({ username: res.data.username, id: res.data.id });
      }
    } catch (error) {
      if (error.status == 401) {
        setUserData(null);
        setIsAuthorized(false);
        localStorage.clear();
        return;
      }
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthorized(false);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        logout,
        isAuthorized,
        setUserData,
        userData,
        getUserData,
        setIsAuthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
