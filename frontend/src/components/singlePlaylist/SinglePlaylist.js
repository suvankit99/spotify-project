import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./SinglePlaylist.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSong } from "../../redux/songSlice";
import { useParams } from "react-router-dom";
import { FaEllipsisH, FaHeart, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { getSongDuration } from "../../utils/util";

const SinglePlaylist = () => {
  const { id } = useParams();
  const [playlistData, setPlaylistData] = useState(null);
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(null);
  const [loggedUserPlaylists, setLoggedUserPlaylists] = useState([]);
  const [clickedSong, setClickedSong] = useState(null);
  const dispatch = useDispatch();
  const selectedSong = useSelector((state) => state.song.selectedSong);
  const loggedUser = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const token = localStorage.getItem("token");
  const playlistSongsRef = useRef(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/playlist/${id}`);
        setPlaylistData(res.data);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

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

    fetchPlaylist();
    if (isLoggedIn) fetchLoggedUserPlaylists();
  }, [id]);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/playlist/${id}/${page}/${8}`
      );
      const newSongs = res.data.songs;
      setSongs((prevSongs) => [...prevSongs, ...newSongs]);
      setHasMore(newSongs.length > 0);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchSongs();
  }, [id, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (playlistSongsRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          playlistSongsRef.current;
        if (
          scrollTop + clientHeight >= scrollHeight - 5 &&
          hasMore &&
          !loading
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    const refCurrent = playlistSongsRef.current;
    if (refCurrent) {
      refCurrent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener("scroll", handleScroll);
      }
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
    await updateRecentlyListenedGenres(song) ; 
    dispatch(setSelectedSong(song));
  };

  const handleDropdownToggle = (songId) => {
    if (!isLoggedIn) {
      toast.info("Please login to add songs to playlists", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }
    setShowDropdown(showDropdown === songId ? null : songId);
    setShowPlaylistDropdown(null); // Close the playlist dropdown when main dropdown is toggled
  };

  const handleAddSongToLiked = async (song) => {
    if (!isLoggedIn) {
      toast.info("Please login to like songs", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }

    const data = {
      songId: song._id,
      userId: loggedUser._id,
    };

    console.log(data) ; 
    try {
      const response = await axios.put("http://localhost:5000/api/likedSongs", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data) ; 
      toast.success("Song added to liked songs", {
        position: "top-right",
      });
      setShowDropdown(null); // Close the dropdown after action
    } catch (error) {
      toast.error("Error adding song to liked songs", {
        position: "top-right",
      });
    }
  };

  const handleAddSongToPlaylist = async (playlist) => {
    if (!isLoggedIn) {
      toast.info("Please login to add songs to playlists", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }
    const data = {
      playlistId: playlist._id,
      newSongId: clickedSong._id,
    };

    try {
      await axios.put("http://localhost:5000/api/playlist/", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Song added to playlist successfully", {
        position: "top-right",
      });
      setShowPlaylistDropdown(null); // Close the playlist dropdown after action
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };

  const updateRecentlyListenedSongs = async (songId) => {
    if (!isLoggedIn) {
      toast.info("Please login to listen to songs", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }
    const formData = new FormData();
    formData.append("songId", songId);
    formData.append("userId", loggedUser._id);

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

  const handleOutsideClick = (e) => {
    if (playlistSongsRef && playlistSongsRef.current && !playlistSongsRef.current.contains(e.target)) {
      setShowDropdown(null);
      setShowPlaylistDropdown(null);
    }
  };
  const handleSongRemoval = async(song) => {
    const formData = new FormData() ; 
    formData.append('songId' , song._id) ; 
    formData.append('playlistId' , id) ; 
    formData.append('owner' , loggedUser._id) ; 
    try {
      const response = await axios.put(`http://localhost:5000/api/playlist/remove-song` , formData , {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      })
      setSongs([]) ;   
      fetchSongs() ;                              
    } catch (error) {
      console.error(error) ; 
    }
  }

  const updateRecentlyListenedGenres = async (selectedSong) => {
    // userId , genre , count 
    const data = {
      userId : loggedUser._id ,
      genres : selectedSong && selectedSong.genre ? selectedSong.genre : [] 
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/frequent-genre` , data , {
        headers: {
          'Content-Type':'application/json'
        }
      })
      console.log("updated frequently listened genres " ,response.data) ; 
    } catch (error) {
      console.error(error) ; 
    }
  }
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  if (!playlistData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single-playlist">
      <div className="playlist-header">
        <img
          src={playlistData.imagePath}
          alt={playlistData.name}
          className="playlist-image"
        />
        <div className="playlist-info">
          <h1>{playlistData.name}</h1>
          <p>{playlistData.description}</p>
        </div>
      </div>
      <div className="playlist-songs" ref={playlistSongsRef}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Duration</th>
              {isLoggedIn && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => (
              <tr
                className="single-song"
                key={song._id}
                onClick={() => handleSongSelect(song)}
              >
                <td>{index + 1}</td>
                <td>{song.name}</td>
                <td>{song.description}</td>
                <td>
                  {song.duration ? getSongDuration(song.duration) : "0:00"}
                </td>
                {isLoggedIn && (
                  <td>
                    <FaEllipsisH
                      className="plus-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClickedSong(song);
                        handleDropdownToggle(song._id);
                      }}
                    />
                    {showDropdown === song._id && (
                      <div className="dropdown-menu">
                        <ul>
                          <li onClick={() => handleAddSongToLiked(song)}>
                            Add to liked songs
                          </li>
                          <li
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPlaylistDropdown(song._id);
                            }}
                          >
                            Add to playlist
                          </li>
                          <li onClick={() => handleSongRemoval(song)}>
                            Remove song from this playlist
                          </li>
                        </ul>
                        {showPlaylistDropdown === song._id && (
                          <div className="playlist-dropdown">
                            <ul>
                              {loggedUserPlaylists.length > 0 ? (
                                loggedUserPlaylists.map((pl) => (
                                  <li
                                    key={pl._id}
                                    onClick={() => handleAddSongToPlaylist(pl)}
                                  >
                                    {pl.name}
                                  </li>
                                ))
                              ) : (
                                <p>No playlists created</p>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SinglePlaylist;
