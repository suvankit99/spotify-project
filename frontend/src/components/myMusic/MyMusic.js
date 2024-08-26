import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./MyMusic.css";
import axios from "axios";
import { Button, Chip, Box, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast, ToastContainer } from 'react-toastify';
import SongCard from "../songCard/SongCard";

const genres = ["Pop", "Rock", "Hip-Hop", "Bollywood", "Classical"];
const languages = ["Hindi", "English", "Punjabi", "Spanish"];

function MyMusic() {
  const loggedUser = useSelector((state) => state.user.userInfo);
  const [uploading, setUploading] = useState(false);
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [songFile, setSongFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [songName, setSongName] = useState("");
  const [description, setDescription] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [duration, setDuration] = useState("");
  const [genre, setGenre] = useState([]);
  const [language, setLanguage] = useState("");
  const [userPlaylists, setUserPlaylists] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOwnerPlaylists = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/playlist/owner/${loggedUser._id}`
        );
        console.log("logged user playlists", response.data);
        setUserPlaylists(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOwnerPlaylists();
  }, [loggedUser._id]);

  useEffect(() => {
    const fetchUploadedSongs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/artist/${loggedUser._id}`) ; 
        console.log("Uploaded songs : " , response.data.songs)
        setUploadedSongs(response.data.songs) ; 
      } catch (error) {
        console.error(error) ; 
      }
    }

    fetchUploadedSongs() ; 
  }, [loggedUser])
  
  const handleGenreChange = (e) => {
    const { value } = e.target;
    const filteredGenre = genre.filter((g) => g !== value);
    filteredGenre.push(value);
    setGenre(filteredGenre);
  };

  const handleRemoveGenre = (genreToRemove) => {
    const filteredGenre = genre.filter((g) => g !== genreToRemove);
    setGenre(filteredGenre);
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
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
  const handlePlaylistChange = (e) => {
    setPlaylistId(e.target.value); 
    console.log('New playlist' , e.target.value) ;
  }
  const sendSongData = async (songData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/song/",
        songData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Song uploaded", response.data);
      toast.success('Song uploaded successfully', {
        position: "top-right",
      })
      return {
        playlistId: playlistId,
        newSongId: response.data.song._id,
      }; 
    } catch (error) {
      console.error("Error uploading song", error);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(userPlaylists.length === 0){
      toast.info("You don't have any created playlists , please create a playlist to continue" , {
        position:"top-center"
      })
      return ; 
    }
    const uploadedSongPath = await handleFileUpload(songFile);
    const uploadedImagePath = await handleFileUpload(imageFile);
    console.log("uploaded song path", uploadedSongPath);
    console.log("uploaded image path", uploadedImagePath);

    const songData = {
      data: {
        songName: songName,
        songDescription: description,
        songPath: uploadedSongPath,
        imagePath: uploadedImagePath,
        duration: duration,
        genre: genre,
        language: language,
        playlist: playlistId,
        artist:loggedUser._id
      },
    };
    const response = await sendSongData(songData) ; 
    await updatePlaylist(response) ;
  };

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
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#121212",
      },
      background: {
        default: "#121212",
        paper: "#121212",
      },
      text: {
        primary: "#ffffff",
        secondary: "#b0bec5",
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper className="my-music-container" style={{ background: '#121212' }}>
        <h2>Uploaded Songs</h2>
        <div className="uploaded-songs">
          {uploadedSongs.map((song) => (
            <SongCard song={song}/>
          ))}
        </div>

        <h2>Upload a New Song</h2>
        <form className="my-music-form" onSubmit={handleSubmit}>
          <input
            type="file"
            name="songFile"
            accept="audio/*"
            onChange={(e) => setSongFile(e.target.files[0])}
            required
            className="input-dark"
          />
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
            className="input-dark"
          />
          <input
            type="text"
            name="songName"
            placeholder="Song Name"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            required
            className="input-dark"
          />
          <textarea
            name="description"
            placeholder="Song Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="input-dark"
          />

          <select
            name="playlist"
            value={playlistId}
            onChange={handlePlaylistChange}
            required
            className="input-dark"
            style={{ marginBottom: "1rem" }}
          >
            <option value="" disabled>
              Select Playlist
            </option>
            {userPlaylists.map((pl) => (
              <option key={pl._id} value={pl._id}>
                {pl.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="duration"
            placeholder="Song Duration (in seconds)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="input-dark"
          />

          <Box className="display-genre">
            {genre.map((g) => (
              <Chip
                key={g}
                label={g}
                onDelete={() => handleRemoveGenre(g)}
                className="genre-chip"
                style={{ backgroundColor: darkTheme.palette.primary.main }}
              />
            ))}
          </Box>

          <select
            name="genre"
            multiple
            value={genre}
            onChange={handleGenreChange}
            className="input-dark"
            required
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <select
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-dark"
            required
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <Button type="submit" variant="contained" color="primary">
            Upload Song
          </Button>
        </form>
      </Paper>
      {uploading && <div>Uploading ... </div>}
      <ToastContainer/>
    </ThemeProvider>
  );
}

export default MyMusic;
