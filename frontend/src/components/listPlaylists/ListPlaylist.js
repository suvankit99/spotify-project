import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import './ListPlaylist.css';
import { FaTrash } from "react-icons/fa";
import Button from '@mui/material/Button';

const ListPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/playlist/${page}/${6}`);
        const newPlaylists = response.data.playlists;
        setPlaylists(prevPlaylists => [...prevPlaylists, ...newPlaylists]);
        setHasMore(newPlaylists.length > 0);
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
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleDelete = async () => {
    if (playlistToDelete) {
      try {
        await axios.delete(`${apiUrl}/api/playlist/${playlistToDelete._id}`);
        setPlaylists(prevPlaylists => prevPlaylists.filter(playlist => playlist._id !== playlistToDelete._id));
        toast.success("Playlist deleted successfully.", {
          position: "top-right",
          theme: "dark",
        });
      } catch (error) {
        toast.error("Error deleting playlist. Please try again later.", {
          position: "top-right",
          theme: "dark",
        });
        console.error('Error deleting playlist:', error);
      } finally {
        setShowModal(false);
        setPlaylistToDelete(null);
      }
    }
  };

  const openDeleteModal = (playlist) => {
    setPlaylistToDelete(playlist);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setPlaylistToDelete(null);
  };

  return (
    <div className="list-playlists-container">
      <h2>All Playlists</h2>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th> {/* Add this column for actions */}
          </tr>
        </thead>
        <tbody>
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <tr key={playlist._id}>
                <td><img src={playlist.imagePath} alt={playlist.name} /></td>
                <td>{playlist.name}</td>
                <td>{playlist.description}</td>
                <td>
                  <div onClick={() => openDeleteModal(playlist)}  className="delete-button"><FaTrash /></div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No playlists available.</td>
            </tr>
          )}
        </tbody>
      </table>
      {loading && <p>Loading more playlists...</p>}

      <ConfirmationModal
        show={showModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
      <ToastContainer />
    </div>
  );
};

const ConfirmationModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you sure you want to delete this playlist?</h3>
        <Button variant='contained' color='error' onClick={onConfirm}>Delete</Button>
        <Button variant='contained' onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default ListPlaylists;
