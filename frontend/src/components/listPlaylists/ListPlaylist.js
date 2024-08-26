import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for error messages
import './ListPlaylist.css'; // Import the CSS file

const ListPlaylist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [page, setPage] = useState(1); // Track the current page
  const [loading, setLoading] = useState(false); // Track loading state
  const [hasMore, setHasMore] = useState(true); // Check if there are more playlists to load
  const apiUrl = process.env.REACT_APP_API_URL; // Use the environment variable for API URL

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/playlist/${page}/${6}`);
        const newPlaylists = response.data.playlists;
        console.log(`${newPlaylists.length} more playlists loaded`);
        setPlaylists(prevPlaylists => [...prevPlaylists, ...newPlaylists]);
        setHasMore(newPlaylists.length > 0); // If no playlists are returned, stop loading
      } catch (error) {
        toast.error("Error fetching playlists. Please try again later.", {
          position: "top-right",
          theme: "dark",
        });
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 5 && hasMore && !loading) {
        setPage(prevPage => prevPage + 1); // Increment page number to load more playlists
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="list-playlists-container">
      <h2>All Playlists</h2>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {playlists.length > 0 ? (
            playlists.map((playlist, index) => (
              <tr key={index}>
                <td><img src={playlist.imagePath} alt={playlist.name} /></td>
                <td>{playlist.name}</td>
                <td>{playlist.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No playlists available.</td>
            </tr>
          )}
        </tbody>
      </table>
      {loading && <p>Loading more playlists...</p>}
    </div>
  );
};

export default ListPlaylist;
