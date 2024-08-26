import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, useNavigate, useParams } from "react-router-dom";
import "./SingleProfile.css";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import UserCard from "../userCard/UserCard";

const SingleProfile = () => {
  const { userId } = useParams();
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [user, setUser] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setisFollowing] = useState(false);
  const [followingCurrentProfile, setFollowingCurrentProfile] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const loggedUser = useSelector((state) => state.user.userInfo);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const apiUrl = process.env.REACT_APP_API_URL; // Use the environment variable for API URL
  useEffect(() => {
    const fetchUserPublicPlaylists = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/playlist/public/${userId}`
        );
        console.log("current user public playlists: ", response.data);
        setUserPlaylists(response.data);
      } catch (error) {
        console.error("Error fetching user public playlists:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user/${userId}`);
        console.log("current User: ", response.data);
        setFollowerCount(response.data.followerCount);
        setFollowingCount(response.data.followingCount);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
    fetchUserPublicPlaylists();
  }, []);
  useEffect(() => {
    const checkFollowing = async () => {
      const formData = new FormData();
      formData.append("followerId", loggedUser._id);
      formData.append("followeeId", userId);
      try {
        const response = await axios.post(
          `${apiUrl}/api/follow/check`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFollowingCurrentProfile(response.data.exists);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (isLoggedIn) checkFollowing();
  }, []);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/followers/${userId}`);
        setFollowers(response.data);
      } catch (error) {
        console.error("Error fetching followers data:", error);
        toast.error("Error fetching followers data", {
          position: "top-right",
        });
      }
    };

    const fetchFollowing = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/following/${userId}`);
        setFollowing(response.data);
      } catch (error) {
        console.error("Error fetching following data:", error);
        toast.error("Error fetching following data", {
          position: "top-right",
        });
      }
    };

    fetchFollowers();
    fetchFollowing();
  }, [followerCount, followingCount]);

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist._id}`);
  };
  const handleProfileFollow = async () => {
    setFollowingCurrentProfile(!followingCurrentProfile);
    setFollowerCount(
      !followingCurrentProfile ? followerCount + 1 : followerCount - 1
    );
    const formData = new FormData();
    formData.append("followerId", loggedUser._id);
    formData.append("followeeId", userId);
    try {
      const response = await axios.put(`${apiUrl}/api/follow`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (error) {}
  };
  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-picture">
          <img
            src={user ? user.profilePicture : ""}
            alt="profile-picture"
            className="profile-img"
          />
          {isLoggedIn && loggedUser._id !== userId && (
            <button
              className="follow-button"
              onClick={() => handleProfileFollow()}
            >
              {followingCurrentProfile ? "following" : "follow"}
            </button>
          )}
        </div>
        <div className="profile-info">
          <h1>{user && user.username}</h1>
          <p>
            {userPlaylists.length} Public Playlists • {followerCount} Followers
            • {followingCount} Following
          </p>
        </div>
      </div>
      <div className="profile-content">
        {userPlaylists.length > 0 && (
          <>
            <h2>Public Playlists</h2>
            <div className="playlists">
              {userPlaylists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="playlist-item"
                  onClick={() => handlePlaylistClick(playlist)}
                >
                  <img
                    src={playlist.imagePath}
                    alt={playlist.name}
                    className="playlist-image"
                  />
                  <h3>{playlist.name}</h3>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {followerCount > 0 && (
        <div className="followers-section">
          <h2>Followers</h2>
          <div className="followers">
            {followers.map((follower) => (
              <UserCard key={follower._id} user={follower} />
            ))}
          </div>
        </div>
      )}
      {followingCount > 0 && (
        <div className="following-section">
          <h2>Following</h2>
          <div className="following">
            {following.map((follow) => (
              <UserCard key={follow._id} user={follow} />
            ))}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SingleProfile;
