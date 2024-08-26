import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserLibrary.css";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";

// Access the API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

const UserLibrary = () => {
  const [playlists, setPlaylists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const loggedUser = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/playlist/owner/${loggedUser._id}`);
        setPlaylists(res.data);
        console.log("user playlists", res.data);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        toast.error("Failed to fetch playlists.", { position: "top-right" });
      }
    };


    if (isLoggedIn) {
      fetchPlaylists();
    }
  }, [loggedUser]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      const response = await axios.post(`${API_URL}/api/upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setUploading(false);
      return response.data.file;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading file to server", error);
      toast.error("Failed to upload image.", { position: "top-right" });
      return null;
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      toast.error("Playlist name is required.", { position: "top-right" });
      isValid = false;
    }

    if (!description.trim()) {
      toast.error("Playlist description is required.", { position: "top-right" });
      isValid = false;
    }

    if (!image) {
      toast.error("Image is required.", { position: "top-right" });
      isValid = false;
    }

    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const uploadedImagePath = await handleFileUpload(image);
    if (!uploadedImagePath) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("imagePath", uploadedImagePath);
    formData.append("owner", loggedUser._id);

    try {
      const response = await axios.post(`${API_URL}/api/playlist`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Playlist created successfully", { position: "top-right" });
      // Refresh playlists
      const res = await axios.get(`${API_URL}/api/playlist/owner/${loggedUser._id}`);
      setPlaylists(res.data);
      setShowForm(false);
      setImage(null);
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error adding playlist:", error);
      toast.error("Failed to create playlist.", { position: "top-right" });
    }
  };

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    navigate(`/playlist/${playlist._id}`);
  };

  const handleSwitchChange = async (event, playlist) => {
    const playlistId = playlist._id;
    try {
      const response = await axios.put(`${API_URL}/api/playlist/toggle/${playlist._id}`, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((pl) =>
          pl._id === playlistId ? { ...pl, isPublic: !pl.isPublic } : pl
        )
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error toggling playlist visibility:", error);
      toast.error("Failed to toggle playlist visibility.", { position: "top-right" });
    }
  };

  const handlePlusIconClick = () => {
    if (!isLoggedIn) {
      toast.info("Please login to create playlists", { position: "top-right", theme: "dark" });
      return;
    }
    setShowForm(true);
  };

  return (
    <div className="user-library">
      <div className="section">
        <h2>My Playlists</h2>
        <div className="content-row">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="content-item">
              <img
                src={playlist.imagePath}
                alt={playlist.name}
                className="content-image"
                onClick={() => handlePlaylistClick(playlist)}
              />
              <h3>{playlist.name}</h3>
              <p>{playlist.description}</p>
              <Switch
                size="small"
                color="success"
                checked={playlist.isPublic}
                onChange={(e) => handleSwitchChange(e, playlist)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="section bottom-section">
        <button className="plus-button" onClick={handlePlusIconClick}>
          +
        </button>
        {showForm && (
          <form className="playlist-form" onSubmit={handleFormSubmit}>
            <label>
              Upload Image:
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <label>
              Playlist Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Playlist Description:
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <button type="submit">Create Playlist</button>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserLibrary;
