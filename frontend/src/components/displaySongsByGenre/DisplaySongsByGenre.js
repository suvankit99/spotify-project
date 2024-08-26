import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setSelectedSong } from "../../redux/songSlice";
import { toast } from "react-toastify"; // Import toast for error messages

const DisplaySongsByGenre = () => {
  const [songs, setSongs] = useState([]);
  const { type, name } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL; // Use the environment variable for API URL

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/song/genre/${type}/${name}`
        );
        console.log(response.data.results);
        setSongs(response.data.results);
      } catch (error) {
        toast.error("Failed to fetch songs. Please try again later.", {
          position: "top-right",
          theme: "dark",
        });
        console.error(error);
      }
    };

    fetchResults();
  }, [apiUrl, name, type]);

  const handleSongSelect = (song) => {
    dispatch(setSelectedSong(song));
  };

  return (
    <div className="main-content">
      <div className="section">
        <div className="section-title">
          <h2>{name} songs</h2>
        </div>
        <div className="content-row scrollable">
          {songs.length > 0 ? (
            songs.map((song) => (
              <div
                key={song._id}
                className="content-item"
                onClick={() => handleSongSelect(song)}
              >
                <img
                  src={song.imagePath}
                  alt={song.name}
                  className="content-image"
                />
                <h3>{song.name}</h3>
                <p>{song.description}</p>
              </div>
            ))
          ) : (
            <p>No songs found for this genre.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplaySongsByGenre;
