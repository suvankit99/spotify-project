import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSong } from "../../redux/songSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import SongCard from "../songCard/SongCard"; // Import SongCard component

const Dashboard = () => {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const user = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const selectedSong = useSelector((state) => state.song.selectedSong);
  const loggedUser = useSelector((state) => state.user.userInfo);
  const [recentlyListenedSongs, setRecentlyListenedSongs] = useState([]);
  const [songRecommendations, setSongRecommendations] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL; // Use the environment variable for API URL

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/playlist/`);
        setPlaylists(res.data.playlists);
      } catch (error) {
        toast.error("Failed to fetch playlists.", {
          position: "top-right",
          theme: "dark",
        });
        console.error(error);
      }
    };

    const fetchSongs = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/song/`);
        setSongs(res.data.songs);
      } catch (error) {
        toast.error("Failed to fetch songs.", {
          position: "top-right",
          theme: "dark",
        });
        console.error(error);
      }
    };

    const fetchRecentlyPlayed = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/song/recent/${loggedUser._id}`);
        setRecentlyListenedSongs(res.data.recentlyListenedSongs);
      } catch (error) {
        toast.error("Failed to fetch recently played songs.", {
          position: "top-right",
          theme: "dark",
        });
        console.error(error);
      }
    };

    if (isLoggedIn) fetchRecentlyPlayed();
    fetchPlaylists();
    fetchSongs();
    console.log("logged user :", user);
    console.log("is logged in", isLoggedIn);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchRecommendations = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/frequent-genre/${loggedUser._id}`);
          setSongRecommendations(response.data.recommendations);
          console.log("recommendations", response.data.recommendations);
        } catch (error) {
          toast.error("Failed to fetch song recommendations.", {
            position: "top-right",
            theme: "dark",
          });
          console.error(error);
        }
      };

      fetchRecommendations();
    }
  }, []);

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    console.log("selected playlist is : ", playlist);
    navigate(`/playlist/${playlist._id}`);
  };

  const updateRecentlyListenedSongs = async (songId) => {
    const formData = new FormData();
    formData.append("songId", songId);
    formData.append("userId", loggedUser._id);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `${apiUrl}/api/user/recent`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log("updated recently listened songs", response.data);
    } catch (error) {
      toast.error("Failed to update recently listened songs.", {
        position: "top-right",
        theme: "dark",
      });
      console.error(error);
    }
  };

  const handleSongSelect = async (song) => {
    if (!isLoggedIn) {
      toast.info("Please login to listen to songs", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }

    try {
      await updateRecentlyListenedSongs(song._id);
      await updateRecentlyListenedGenres(song);
      dispatch(setSelectedSong(song));
      console.log("selected song :", selectedSong);
    } catch (error) {
      toast.error("Failed to select song.", {
        position: "top-right",
        theme: "dark",
      });
      console.error(error);
    }
  };

  const updateRecentlyListenedGenres = async (selectedSong) => {
    const data = {
      userId: loggedUser._id,
      genres: selectedSong && selectedSong.genre ? selectedSong.genre : []
    };

    try {
      const response = await axios.put(`${apiUrl}/api/frequent-genre`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("updated frequently listened genres", response.data);
    } catch (error) {
      toast.error("Failed to update frequently listened genres.", {
        position: "top-right",
        theme: "dark",
      });
      console.error(error);
    }
  };

  return (
    <div className="dashboard-main-content">
      {isLoggedIn && recentlyListenedSongs.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-title">
            <h2>Recently Played</h2>
          </div>
          <div className="content-row scrollable">
            {recentlyListenedSongs.slice(0, 4).map((song) => (
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
      )}
      <div className="dashboard-section">
        <div className="dashboard-section-title">
          <h2>Spotify Playlists</h2>
          <Link to="/all-playlists">Show all</Link>
        </div>
        <div className="content-row scrollable">
          {playlists.slice(0, 4).map((playlist) => (
            <div
              key={playlist._id}
              className="content-item"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <img
                src={playlist.imagePath}
                alt={playlist.name}
                className="content-image"
              />
              <h3>{playlist.name}</h3>
              <p>{playlist.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-section">
        <div className="dashboard-section-title">
          <h2>Songs</h2>
          <Link to="/all-songs">Show all</Link>
        </div>
        <div className="content-row scrollable">
          {songs.slice(0, 4).map((song) => (
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
      {Object.keys(songRecommendations).length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-title">
            <h2>Song Recommendations by Genre</h2>
          </div>
          {Object.entries(songRecommendations).map(([genre, songs]) => (
            <div key={genre} className="dashboard-genre-section">
              <h3>{genre}</h3>
              <div className="content-row scrollable">
                {songs.map((song) => (
                  <SongCard key={song._id} song={song} onClick={() => handleSongSelect(song)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
