import React from "react";
import "./Sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import QueueMusicIcon from "@mui/icons-material/QueueMusic"; // Importing the icon for "My Music"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar() {
  const loggedUser= useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  
  return (
    <div className="home-sidebar">
      <Link to={"/"}>
        <div className="home-sidebar__option">
          <HomeIcon />
          <span>Home</span>
        </div>
      </Link>
      <Link to={"/search"}>
        <div className="home-sidebar__option">
          <SearchIcon />
          <span>Search</span>
        </div>
      </Link>
      <Link to={"/library"}>
        <div className="home-sidebar__option">
          <LibraryMusicIcon />
          <span>Library</span>
        </div>
      </Link>
      {isLoggedIn && (loggedUser.role === "artist" || loggedUser.role === "admin") && (
        <Link to={"/mymusic"}>
          <div className="home-sidebar__option">
            <QueueMusicIcon />{" "}
            {/* Using QueueMusicIcon as the icon for "My Music" */}
            <span>My Music</span>
          </div>
        </Link>
      )}
    </div>
  );
}

export default Sidebar;
