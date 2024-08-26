import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setSelectedSong } from "../../redux/songSlice";
const DisplaySongsByGenre = () => {
  const [songs, setSongs] = useState([]);
  const { type, name } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchResults = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/song/genre/${type}/${name}`
      );
      console.log(response.data.results);
      setSongs(response.data.results);
    };

    fetchResults();
  }, []);

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
          {songs.map((song) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplaySongsByGenre;
