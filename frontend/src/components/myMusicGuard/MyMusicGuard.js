import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import MyMusic from "../myMusic/MyMusic";

function MyMusicGuard() {
  const loggedUser = useSelector((state) => state.user.userInfo);

  if (loggedUser && (loggedUser.role === "admin" || loggedUser.role === "artist")) {
    return <MyMusic />;
  } else {
    // Redirect to home page or any other page if the user is not authorized
    return <Navigate to="/" />;
  }
}

export default MyMusicGuard;
