import React from "react";
import "./SongPlaylistCard.css";

const SongPlaylistCard = ({ song }) => {
  return (
    <div
      key={song._id}
      className="content-item"
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

export default SongPlaylistCard;
