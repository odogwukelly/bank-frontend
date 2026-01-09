import React from "react";
import { Navigate } from "react-router-dom";

interface AdminProtectedRouteProps {
  children: JSX.Element;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  // 🧼 If no token or no user data, redirect to login
  if (!token || !userData) {
    console.warn("🚫 No token or user data — redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // 🚨 Check admin privileges
  if (!userData.isAdmin) {
    console.warn("🚫 Not an admin — redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // ⏳ Optional: Validate token expiration if JWT has `exp`
  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      console.warn("⏳ Token expired — logging out");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    return <Navigate to="/login" replace />;
  }

  // ✅ Everything good — render admin page
  return children;
};

export default AdminProtectedRoute;
