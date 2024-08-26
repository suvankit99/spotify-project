import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./AllPlaylists.css";
import { Link, useNavigate } from "react-router-dom";

const AllPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const playlistsContainerRef = useRef(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL; // Use the environment variable for API URL

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/api/playlist/${page}/${8}`);
        const newPlaylists = res.data.playlists;
        console.log('New playlists fetched' , newPlaylists);
        setPlaylists((prevPlaylists) => [...prevPlaylists, ...newPlaylists]);
        setHasMore(newPlaylists.length > 0);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        playlistsContainerRef.current.scrollHeight - playlistsContainerRef.current.scrollTop ===
          playlistsContainerRef.current.clientHeight &&
        hasMore &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1); // Increment page number to load more playlists
      }
    };

    const container = playlistsContainerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist._id}`);
  };

  return (
    <div className="main-content" ref={playlistsContainerRef}>
      <div className="section">
        <div className="section-title">
          <h2>Spotify Playlists</h2>
          <Link to="/">Show less</Link>
        </div>
        <div className="content-row">
          {playlists.map((playlist) => (
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
      {loading && <p>Loading more playlists...</p>}
      {!hasMore && <p>No more playlists to load.</p>}
    </div>
  );
};

export default AllPlaylists;
