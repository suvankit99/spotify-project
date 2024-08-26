import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ element }) => {
  const user = useSelector((state) => state.user.userInfo);
  const isAdmin = () => {
    return user && user.role === "admin"; // Adjust this according to your authentication logic
  };
  return isAdmin() ? element : <Navigate to="/" />;
};

export default AdminGuard;
