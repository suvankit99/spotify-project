import React from "react";
import "./PlaylistCard.css";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ playlist }) => {
    const navigate = useNavigate() ; 
    const handleClick = () => {
      navigate(`/playlist/${playlist._id}`) ; 
    }
  return (
    <div
      key={playlist._id}
      className="content-item"
      onClick={handleClick}
    >
      <img
        src={playlist.imagePath}
        alt={playlist.name}
        className="content-image"
      />
      <h3>{playlist.name}</h3>
      <p>{playlist.description}</p>
    </div>
  );
};

export default PlaylistCard;
