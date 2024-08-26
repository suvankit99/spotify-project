import React, { useState } from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { setUser , clearUser} from "../../redux/userSlice";
import {clearSelectedSong} from '../../redux/songSlice';
import {getInitials , stringToColor} from '../../utils/util'

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.userInfo);

  const dispatch = useDispatch() ;
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    dispatch(clearUser()) ; 
    dispatch(clearSelectedSong()) ; 
    localStorage.clear();
    navigate("/")
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  
  return (
    <div className="header">
      <img
        src="/images/spotify-logo.png"
        alt="Spotify Logo"
        className="header__logo"
      />
      <div className="header__profile">
        {isLoggedIn ? (
          <div className="header__user">
            <Avatar
              sx={{ bgcolor: stringToColor(user.username), color: "black" }}
              onClick={toggleDropdown}
            >
              {getInitials(user.username)}
            </Avatar>
            {isDropdownOpen && (
              <div className="header__dropdown">
                <button onClick={handleProfile}>Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="header__signupButton" onClick={handleSignUp}>
              Sign Up
            </button>
            <button className="header__loginButton" onClick={handleLogin}>
              Log In
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
