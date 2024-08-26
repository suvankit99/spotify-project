import React from "react";
import "./SongCard.css";
import { useDispatch } from "react-redux";
import { setSelectedSong } from "../../redux/songSlice";
const SongCard = ({ song }) => {
    const dispatch = useDispatch() ; 
    const handleClick = () => {
        dispatch(setSelectedSong(song)) ; 
    }
  return (
    <div
      key={song._id}
      className="content-item"
      onClick={handleClick}
    >
      <img
        src={song.imagePath}
        alt={song.name}
        className="content-image"
      />
      <h3>{song.name}</h3>
      <p>{song.description}</p>
    </div>
  );
};

export default SongCard;
