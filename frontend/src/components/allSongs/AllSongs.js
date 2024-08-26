import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./AllSongs.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSong } from "../../redux/songSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaPlus } from "react-icons/fa";

const AllSongs = () => {
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const user = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedUser = useSelector((state) => state.user.userInfo);
  const selectedSong = useSelector(state => state.selectedSong) ; 
  const [loggedUserPlaylists, setLoggedUserPlaylists] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);

  const mainContentRef = useRef(null); // Create a ref to reference the scrollable component

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/song/${page}/8`);
        const newSongs = res.data.songs;
        console.log("new songs fetched" , newSongs) ;
        setSongs((prevSongs) => [...prevSongs, ...newSongs]);
        setHasMore(newSongs.length > 0);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [page]);

  useEffect(() => {
    const fetchLoggedUserPlaylists = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/playlist/owner/${loggedUser._id}`
        );
        setLoggedUserPlaylists(res.data);
      } catch (error) {
        console.error("Error fetching logged user playlists:", error);
      }
    };
    fetchLoggedUserPlaylists();
  }, [loggedUser]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = mainContentRef.current;

      // Trigger pagination when the user scrolls to the bottom of the component
      if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const refCurrent = mainContentRef.current;
    refCurrent.addEventListener("scroll", handleScroll);

    return () => {
      refCurrent.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  const handleSongSelect = async (song) => {
    if (!isLoggedIn) {
      toast.info("Please login to listen to songs", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }
    await updateRecentlyListenedSongs(song._id);
    await updateRecentlyListenedGenres(song);
    dispatch(setSelectedSong(song));
  };

  const updateRecentlyListenedGenres = async (selectedSong) => {
    const data = {
      userId: loggedUser._id,
      genres: selectedSong && selectedSong.genre ? selectedSong.genre : [],
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/frequent-genre`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Updated frequently listened genres", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSongToPlaylist = async (playlist) => {
    const data = {
      playlistId: playlist._id,
      newSongId: selectedSong._id,
    };
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5000/api/playlist/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Song added to playlist successfully", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to add song to playlist", error);
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };

  const handleDropdownToggle = (songId) => {
    if (!isLoggedIn) {
      toast.info('Please login to add songs to playlists', {
        position: 'top-right',
        theme: 'dark',
      });
      return;
    }
    setShowDropdown(showDropdown === songId ? null : songId);
  };

  const updateRecentlyListenedSongs = async (songId) => {
    const formData = new FormData();
    formData.append("songId", songId);
    formData.append("userId", loggedUser._id);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5000/api/user/recent",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Updated recently listened songs", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main-content" ref={mainContentRef}>
      <div className="section">
        <div className="section-title">
          <h2>Songs</h2>
          <Link to="/">Show less</Link>
        </div>
        <div className="content-row scrollable">
          {songs.map((song) => (
            <div
              key={song._id}
              className="content-item"
              onClick={() => handleSongSelect(song)}
            >
              <img
                src={song.imagePath}
                alt={song.name}
                className="content-image"
              />
              <h3>{song.name}</h3>
              <p>{song.description}</p>
            </div>
          ))}
        </div>
      </div>
      {loading && <p>Loading more songs...</p>}
      {!hasMore && <p>No more songs to load.</p>}
      <ToastContainer />
    </div>
  );
};

export default AllSongs;
