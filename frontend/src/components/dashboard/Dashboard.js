import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSong } from "../../redux/songSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

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
  const [songRecommendations, setSongRecommendations] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const res = await axios.get("http://localhost:5000/api/playlist/");
      setPlaylists(res.data.playlists);
    };

    const fetchSongs = async () => {
      const res = await axios.get("http://localhost:5000/api/song/");
      setSongs(res.data.songs);
    };
    const fetchRecentlyPlayed = async () => {
      const res = await axios.get(`http://localhost:5000/api/song/recent/${loggedUser._id}`);
      setRecentlyListenedSongs(res.data.recentlyListenedSongs);
    }
    if(isLoggedIn) fetchRecentlyPlayed() ; 
    fetchPlaylists();
    fetchSongs();
    console.log("logged user :", user);
    console.log("is logged in", isLoggedIn);
  }, []);

  useEffect(() => {
    try {
      
    } catch (error) {
      
    }
  }, [])
  
  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    console.log("selected playlist is : ", playlist);
    navigate(`/playlist/${playlist._id}`);
  };
  const updateRecentlyListenedSongs = async (songId) => {
    // song id , logged User Id
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
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log("updated recently listend songs", response.data);
    } catch (error) {
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
    await updateRecentlyListenedSongs(song._id);
    await updateRecentlyListenedGenres(song);
    dispatch(setSelectedSong(song));
    console.log("selected song :", selectedSong);
  };

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
  return (
    <div className="dashboard-main-content">
      {isLoggedIn && recentlyListenedSongs.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-title">
            <h2>Recently played </h2>
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
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
