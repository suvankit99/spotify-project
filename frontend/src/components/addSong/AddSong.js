import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddSong.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Badge, Chip } from "@mui/material";

const genresList = ["Pop", "Rock", "Hip-Hop", "Bollywood", "Classical"];

const languages = ["Hindi", "English", "Spanish", "Punjabi"];

const AddSong = () => {
  const [songFile, setSongFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [songName, setSongName] = useState("");
  const [songDescription, setSongDescription] = useState("");
  const [playlist, setPlaylist] = useState("");
  const [uploading, setUploading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [uploadedSongId, setuploadedSongId] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/playlist/")
      .then((response) => {
        setPlaylists(response.data.playlists);
        console.log(response.data.playlists);
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
      });
  }, []);

  const updatePlaylist = async (data) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5000/api/playlist/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Song added to playlist successfully", response.data);
    } catch (error) {
      console.error("Failed to add song to playlist", error);
    }
  };
  const sendSongData = async (data) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/song/",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Song uploaded successfully", response.data);
      setuploadedSongId(response.data.song._id);
      toast.success("Song uploaded successfully", {
        position: "top-right",
      });
      return {
        playlistId: selectedPlaylist._id,
        newSongId: response.data.song._id,
      };
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        position: "top-right",
      });
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");
    try {
      setUploading(true);
      const response = await axios.post(
        "http://localhost:5000/api/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUploading(false);
      return response.data.file;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading file to server", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", {
      songFile,
      imageFile,
      songName,
      songDescription,
      playlist,
    });

    const uploadedImagePath = await handleFileUpload(imageFile);
    const uploadedSongPath = await handleFileUpload(songFile);

    console.log("song path", uploadedSongPath);
    console.log("image path", uploadedImagePath);

    const songData = {
      data: {
        songName: songName,
        songDescription: songDescription,
        songPath: uploadedSongPath,
        imagePath: uploadedImagePath,
        playlist: selectedPlaylist._id,
        duration: duration,
        genre: selectedGenres,
        language: selectedLanguage,
      },
    };

    const response = await sendSongData(songData);
    await updatePlaylist(response);
  };

  const handlePlaylistChange = (e) => {
    const selectedValue = e.target.value;
    setPlaylist(selectedValue);
    const selected = playlists.find((pl) => pl._id === selectedValue);
    setSelectedPlaylist(selected);
    console.log("current playlist", selected);
  };

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    if (genre && !selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setSelectedGenres(
      selectedGenres.filter((genre) => genre !== genreToRemove)
    );
  };
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };
  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="upload-container">
        <div className="upload-button">
          <label htmlFor="songFile">Upload song</label>
          <input
            type="file"
            id="songFile"
            name="songFile"
            accept="audio/*"
            onChange={(e) => setSongFile(e.target.files[0])}
          />
        </div>
        <div className="upload-button">
          <label htmlFor="imageFile">Upload Image</label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
      </div>
      <div className="input-container">
        <label htmlFor="songName">Song name</label>
        <input
          type="text"
          id="songName"
          name="songName"
          placeholder="Type Here"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="songDescription">Song description</label>
        <input
          type="text"
          id="songDescription"
          name="songDescription"
          placeholder="Type Here"
          value={songDescription}
          onChange={(e) => setSongDescription(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="playlist">Playlist</label>
        <select
          id="playlist"
          name="playlist"
          value={playlist}
          onChange={handlePlaylistChange}
        >
          <option value="">None</option>
          {playlists.map((pl) => (
            <option key={pl._id} value={pl._id}>
              {pl.name}
            </option>
          ))}
        </select>
      </div>
      <div className="input-container">
        <label htmlFor="duration">Song duration ( seconds ) </label>
        <input
          type="number"
          id="duration"
          name="duration"
          placeholder="Type Here"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="genres">Select Genre</label>
        <select id="genres" name="genres" onChange={handleGenreChange}>
          <option value="">Select Genre</option>
          {genresList.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
      <div className="genres-container">
        {selectedGenres.map((genre, index) => (
          <Badge
            key={index}
            badgeContent={"x"}
            color="secondary"
            onClick={() => handleRemoveGenre(genre)}
          >
            <Chip label={genre} style={{ margin: "5px" }} />
          </Badge>
        ))}
      </div>
      <div className="input-container">
        <label htmlFor="language">Language</label>
        <select
          id="language"
          name="language"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="">Select a language</option>
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
      <button className="submit-button" type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "ADD"}
      </button>
      <ToastContainer />
    </form>
  );
};

export default AddSong;
