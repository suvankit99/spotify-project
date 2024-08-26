import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import SongCard from "../songCard/SongCard";
import PlaylistCard from "../playlistCard/PlaylistCard";
import UserCard from "../userCard/UserCard";
import "./SearchPage.css";
import { useSelector } from "react-redux";
import SongsByGenre from "../songsByGenre/SongsByGenre";

const SearchPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const [results, setResults] = useState({
    artists: [],
    listeners: [],
    songs: [],
    playlists: [],
  });
  const [selectedFilter, setSelectedFilter] = useState("All");
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    // Set a timer to update the debounced search input
    const timerId = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 500); // Delay of 500ms

    // Clear the timer if input changes before the timer ends
    return () => clearTimeout(timerId);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedSearchInput) { 
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/search/${debouncedSearchInput}/${selectedFilter}`
          );
          setResults(response.data);
          console.log("Search api called" , response.data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };
      fetchData();
    } else {
      setResults({ artists: [], listeners: [], songs: [], playlists: [] });
    }
  }, [debouncedSearchInput, selectedFilter]);

  const filters = ["All", "Artists", "Songs", "Playlists", "Listeners"];

  return (
    <div className="search__page">
      <div className="search__bar">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search for Artists, Songs, or Podcasts"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ border: "none" }}
        />
      </div>

      {searchInput && (
        <div className="filters">
          {filters.map((filter) => (
            <div
              key={filter}
              className={`filter ${
                selectedFilter === filter ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedFilter(filter);
                console.log("Current filter", filter);
              }}
            >
              {filter}
            </div>
          ))}
        </div>
      )}

      {isLoggedIn && !searchInput && <SongsByGenre />}

      <div className="search__results">
        {(selectedFilter === "All" || selectedFilter === "Artists") &&
          results.artists.length > 0 && (
            <div className="search__section">
              <div className="search-section-name">
                <h2>Artists</h2>
              </div>
              <div className="search__cards">
                {results.artists.map((artist) => (
                  <UserCard key={artist._id} user={artist} />
                ))}
              </div>
            </div>
          )}
        {(selectedFilter === "All" || selectedFilter === "Listeners") &&
          results.listeners.length > 0 && (
            <div className="search__section">
              <div className="search-section-name">
                <h2>Listeners</h2>
              </div>
              <div className="search__cards">
                {results.listeners.map((listener) => (
                  <UserCard key={listener._id} user={listener} />
                ))}
              </div>
            </div>
          )}
        {(selectedFilter === "All" || selectedFilter === "Songs") &&
          results.songs.length > 0 && (
            <div className="search__section">
              <div className="search-section-name">
                <h2>Songs</h2>
              </div>
              <div className="search__cards">
                {results.songs.map((song) => (
                  <SongCard key={song._id} song={song} />
                ))}
              </div>
            </div>
          )}
        {(selectedFilter === "All" || selectedFilter === "Playlists") &&
          results.playlists.length > 0 && (
            <div className="search__section">
              <h2>Playlists</h2>
              <div className="search__cards">
                {results.playlists.map((playlist) => (
                  <PlaylistCard key={playlist._id} playlist={playlist} />
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default SearchPage;
