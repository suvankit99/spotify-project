import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import './ListSongs.css';
import {FaTrash} from "react-icons/fa"
import Button from '@mui/material/Button';

const ListSongs = () => {
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const loadSongs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/song/${page}/${5}`);
        const newSongs = response.data.songs;
        setSongs(prevSongs => [...prevSongs, ...newSongs]);
        setHasMore(newSongs.length > 0);
      } catch (error) {
        toast.error("Error fetching songs. Please try again later.", {
          position: "top-right",
          theme: "dark",
        });
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
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
    if (songToDelete) {
      try {
        await axios.delete(`${apiUrl}/api/song/${songToDelete._id}`);
        setSongs(prevSongs => prevSongs.filter(song => song._id !== songToDelete._id));
        toast.success("Song deleted successfully.", {
          position: "top-right",
          theme: "dark",
        });
      } catch (error) {
        toast.error("Error deleting song. Please try again later.", {
          position: "top-right",
          theme: "dark",
        });
        console.error('Error deleting song:', error);
      } finally {
        setShowModal(false);
        setSongToDelete(null);
      }
    }
  };

  const openDeleteModal = (song) => {
    setSongToDelete(song);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setSongToDelete(null);
  };

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
            <th>Actions</th> {/* Add this column for actions */}
          </tr>
        </thead>
        <tbody>
          {songs.length > 0 ? (
            songs.map((song) => (
              <tr key={song._id}>
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
                <td>
                  <div onClick={() => openDeleteModal(song)}  className="delete-button"><FaTrash /></div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No songs available.</td>
            </tr>
          )}
        </tbody>
      </table>
      {loading && <p>Loading more songs...</p>}

      <ConfirmationModal
        show={showModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
      <ToastContainer/>
    </div>

  );
};

const ConfirmationModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you sure you want to delete this song?</h3>
        <Button variant='contained' color='error' onClick={onConfirm}>Delete</Button>
        <Button variant='contained' onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default ListSongs;
