import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListPlaylist.css'; // Import the CSS file

const ListPlaylist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [page, setPage] = useState(1); // Track the current page
  const [loading, setLoading] = useState(false); // Track loading state
  const [hasMore, setHasMore] = useState(true); // Check if there are more playlists to load

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/playlist/${page}/${6}`);
        const newPlaylists = response.data.playlists;
        console.log(`${newPlaylists.length} more playlists loaded`)
        setPlaylists(prevPlaylists => [...prevPlaylists, ...newPlaylists]);
        setHasMore(newPlaylists.length > 0); // If no playlists are returned, stop loading
      } catch (error) {
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
          {playlists.map((playlist, index) => (
            <tr key={index}>
              <td><img src={playlist.imagePath} alt={playlist.name} /></td>
              <td>{playlist.name}</td>
              <td>{playlist.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p>Loading more playlists...</p>}
    </div>
  );
};

export default ListPlaylist;
