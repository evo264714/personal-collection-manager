import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const ProtectedAdminRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    Swal.fire({
      icon: "warning",
      title: "Unauthorized",
      text: "You must be logged in to access this page.",
    });
    return <Navigate to="/login" />;
  }

  if (currentUser?.role !== "admin") {
    Swal.fire({
      icon: "error",
      title: "Forbidden",
      text: "You do not have permission to access this page.",
    });
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
