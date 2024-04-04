import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  return currentUser?.isAdmin ? <Outlet /> : <Navigate to="/signin" />;
};

export default OnlyAdminPrivateRoute;
