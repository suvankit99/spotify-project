import React, { useState } from "react";
import axios from "axios";
import "./AddPlaylist.css"; // Import the CSS file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPlaylist = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL; // Use the environment variable for API URL
  
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem('token') ; 
    try {
      setUploading(true);
      const response = await axios.post(
        `${apiUrl}/api/upload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization':`Bearer ${token}`
          },
        }
      );
      setUploading(false);
      return response.data.url;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading file to server", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadedImagePath = await handleFileUpload(imageFile);
    console.log('Uploaded image Path', uploadedImagePath);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("imagePath", uploadedImagePath);
    const token = localStorage.getItem('token') ; 

    console.log("token = " , token) ; 
    console.log("form data", name, description, uploadedImagePath);
    try {
      const response = await axios.post(`${apiUrl}/api/playlist`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization':`Bearer ${token}`,
        },
      });
      console.log(response.data);
      toast.success("Playlist uploaded successfully", {
        position: "top-right",
      });
    } catch (error) {
      console.error('Error adding playlist:', error);
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="admin-add-playlist-container">
      <form onSubmit={handleSubmit} className="admin-playlist-form">
        <div className="admin-form-group">
          <label htmlFor="imageUpload" className="admin-image-upload-label">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={(e) => {
                setImageFile(e.target.files[0]);
              }}
            />
            <span>Upload Image</span>
          </label>
        </div>
        <div className="admin-form-group">
          <label>Playlist name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here"
          />
        </div>
        <div className="admin-form-group">
          <label>Playlist description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type here"
          />
        </div>
        <button type="submit" className="admin-add-button">
          {uploading ? "Uploading" : "Add"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddPlaylist;
