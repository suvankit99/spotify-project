import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaRandom,
  FaRetweet,
  FaVolumeUp,
  FaExpand,
} from "react-icons/fa";
import Slider from "@mui/material/Slider";
import "./PlayerControls.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSelectedSong } from "../../redux/songSlice";

const PlayerControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100); // Volume ranges from 0 to 100
  const [progress, setProgress] = useState(0); // Progress in percentage
  const [repeat, setRepeat] = useState(false); // Repeat mode
  const [random, setRandom] = useState(false); // Random mode
  const audioRef = useRef(null);
  const selectedSong = useSelector((state) => state.song.selectedSong);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const apiUrl = process.env.REACT_APP_API_URL;

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleVolumeChange = (e, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue / 100;
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    if (!isNaN(duration)) {
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleProgressChange = (e, newValue) => {
    setProgress(newValue);
  };

  const handleProgressSet = (e, newValue) => {
    const newTime = (newValue / 100) * audioRef.current.duration;
    if (!isNaN(newTime)) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleNext = async () => {
    if (random) {
      await handleRandomSong();
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/song/next`,
        selectedSong,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        }
      );
      dispatch(setSelectedSong(response.data));
      audioRef.current.currentTime = 0; 
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePrevious = async () => {
    if (random) {
      await handleRandomSong();
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/song/previous`,
        selectedSong,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        }
      );
      dispatch(setSelectedSong(response.data));
      audioRef.current.currentTime = 0; 
    } catch (error) {
      console.error(error.message);
    }
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
    audioRef.current.loop = !repeat;
  };

  const handleRandomSong = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/song/random`,
        selectedSong,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        }
      );
      dispatch(setSelectedSong(response.data));
      audioRef.current.currentTime = 0; 
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("ended", handleNext);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("ended", handleNext);
      }
    };
  }, []);

  const getMinutes = (seconds) => {
    if (!seconds) return "0";
    let count = Math.floor(seconds / 60);
    return `${count}`;
  };

  const getSeconds = (seconds) => {
    if (!seconds) return "00";
    let count = Math.floor(seconds % 60);
    let res = `${count}`;
    if (count < 10) {
      return `0` + res;
    } else {
      return res;
    }
  };

  return (
    <div className="song-player">
      <div className="left-section">
        <img
          src={selectedSong ? selectedSong.imagePath : ""}
          alt="Album Art"
          className="album-art"
        />
        <div className="song-info">
          <h3>{selectedSong ? selectedSong.name : 'No song selected'}</h3>
        </div>
      </div>
      <div className="mid-section">
        <div className="controls">
          <div onClick={() => setRandom(!random)}>
            <FaRandom className={`control-icon ${random ? "active" : ""}`} />
          </div>
          <div onClick={handlePrevious} className="previous-song">
            <FaStepBackward className="control-icon" />
          </div>
          <div onClick={togglePlayPause}>
            {isPlaying ? (
              <FaPause className="control-icon" />
            ) : (
              <FaPlay className="control-icon" />
            )}
          </div>
          <div onClick={handleNext} className="next-song">
            <FaStepForward className="control-icon" />
          </div>
          <FaRetweet
            className={`control-icon ${repeat ? "active" : ""}`}
            onClick={toggleRepeat}
          />
        </div>
        <div className="progress-song-bar">
          <audio ref={audioRef} src={selectedSong ? selectedSong.songPath : ""} preload="auto"></audio>
          <div className="progress-bar">
            <span>
              {getMinutes(Math.floor(audioRef.current?.currentTime)) || "0"}:
              {getSeconds(Math.floor(audioRef.current?.currentTime)) || "0"}
            </span>
            <Slider
              size="small"
              value={progress}
              color="default"
              onChange={handleProgressChange}
              onChangeCommitted={handleProgressSet}
              aria-labelledby="continuous-slider"
              style={{ flex: 1, marginLeft: "1vw", marginRight: "1vw" }}
            />
            <span>
              {getMinutes(Math.floor(audioRef.current?.duration)) || "0"}:
              {getSeconds(Math.floor(audioRef.current?.duration)) || "0"}
            </span>
          </div>
        </div>
      </div>
      <div className="additional-controls">
        <FaVolumeUp className="control-icon" />
        <Slider
          size="small"
          value={volume}
          color="default"
          onChange={handleVolumeChange}
          aria-labelledby="continuous-slider"
          style={{ width: 100, marginLeft: "1vw", marginRight: "1vw" }}
        />
      </div>
    </div>
  );
};

export default PlayerControls;
