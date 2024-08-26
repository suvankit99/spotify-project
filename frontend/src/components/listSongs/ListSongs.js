import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListSongs.css'; // Import the CSS file

const ListSongs = () => {
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1); // Track the current page
  const [loading, setLoading] = useState(false); // Track loading state
  const [hasMore, setHasMore] = useState(true); // Check if there are more songs to load

  useEffect(() => {
    const loadSongs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/song/${page}/${5}`);
        const newSongs = response.data.songs;
        console.log('New songs fetched' , response.data.songs); 
        setSongs(prevSongs => [...prevSongs, ...newSongs]);
        setHasMore(newSongs.length > 0); // If no songs are returned, stop loading
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how close to the bottom the user is
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 5 && hasMore && !loading) {
        setPage(prevPage => prevPage + 1); // Increment page number to load more songs
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="list-songs-container">
      <h2>All Songs</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Playlist</th>
            <th>Artist</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={index}>
              <td>{song.name}</td>
              <td>{song.description}</td>
              <td>
                <img 
                  src={song.imagePath} 
                  alt={`${song.name} thumbnail`} 
                  style={{ width: '100px', height: '100px' }} 
                />
              </td>
              <td>{song.playlist}</td>
              <td>{song.artist}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p>Loading more songs...</p>}
    </div>
  );
};

export default ListSongs;
