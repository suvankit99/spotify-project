import React, { useState } from "react";
import AddSong from "../addSong/AddSong";
import ListSongs from "../listSongs/ListSongs";
import AddPlaylist from "../addPlaylist/AddPlaylist";
import ListPlaylists from "../listPlaylists/ListPlaylist";
import "./AdminPage.css";

const AdminPage = () => {
  const [selectedOption, setSelectedOption] = useState("add-song");

  const renderContent = () => {
    switch (selectedOption) {
      case "add-song":
        return <AddSong />;
      case "list-songs":
        return <ListSongs />;
      case "add-playlist":
        return <AddPlaylist />;
      case "list-playlists":
        return <ListPlaylists />;
      default:
        return <AddSong />;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="logo">Spotify</div>
        <ul>
          <li>
            <button onClick={() => setSelectedOption("add-song")}>
              Add Song
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedOption("list-songs")}>
              List Songs
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedOption("add-playlist")}>
              Add Playlist
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedOption("list-playlists")}>
              List Playlists
            </button>
          </li>
        </ul>
      </div>
      <div className="content">
        <header className="admin-header">
          <h1>Admin Panel</h1>
        </header>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
