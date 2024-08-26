import React from 'react';
import './Playlist.css';

function Playlist(props) {
  return (
    <div className="playlist">
      <img src={props.profileImage} alt="Playlist" className="playlist__image" />
      <h4 className="playlist__title">Playlist Name</h4>
    </div>
  );
}

export default Playlist;
