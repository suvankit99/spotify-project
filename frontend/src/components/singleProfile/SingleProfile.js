import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, useNavigate, useParams } from "react-router-dom";
import "./SingleProfile.css";
import { useSelector } from "react-redux";

const SingleProfile = () => {
  const { userId } = useParams();
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [user, setUser] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setisFollowing] = useState(false);
  const [followingCurrentProfile, setFollowingCurrentProfile] = useState(false);
  const isLoggedIn = useSelector(state => state.user.isLoggedIn) ; 
  const loggedUser = useSelector(state => state.user.userInfo) ; 
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchUserPublicPlaylists = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/playlist/public/${userId}`
        );
        console.log("current user public playlists: ", response.data);
        setUserPlaylists(response.data);
      } catch (error) {
        console.error("Error fetching user public playlists:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/${userId}`
        );
        console.log("current User: ", response.data);
        setFollowerCount(response.data.followerCount) ; 
        setFollowingCount(response.data.followingCount) ; 
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const checkFollowing = async () => {
      const formData = new FormData() ; 
      formData.append('followerId' , loggedUser._id) ; 
      formData.append('followeeId' , userId) ; 
      try {
        const response = await axios.post(
          `http://localhost:5000/api/follow/check` , formData , {
            headers: {
              "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
          }
        );
        setFollowingCurrentProfile(response.data.exists) ; 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUser();
    fetchUserPublicPlaylists();
    if(isLoggedIn) checkFollowing() ; 
  }, []);

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist._id}`);
  };
  const handleProfileFollow = async () => {
    setisFollowing(!isFollowing) ;
    setFollowingCurrentProfile(!followingCurrentProfile) ; 
    setFollowerCount(isFollowing ? followerCount + 1 : followerCount - 1) ; 
    const formData = new FormData() ; 
    formData.append('followerId' , loggedUser._id) ; 
    formData.append('followeeId' , userId) ; 
    try {
        const response = await axios.put(`http://localhost:5000/api/follow` , formData , {
          headers: {
            "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
          },
        })
        console.log(response.data) ; 
    } catch (error) {
      
    }
  }
  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-picture">
          <img
            src={user ? user.profilePicture : ""}
            alt="profile-picture"
            className="profile-img"
          />
         {isLoggedIn && loggedUser._id !== userId &&  <button className="follow-button" onClick={() => handleProfileFollow()}>{followingCurrentProfile ? "following" : "follow"}</button>}
        </div>
        <div className="profile-info">
          <h1>{user && user.username}</h1>
          <p>
            {userPlaylists.length} Public Playlists • {followerCount}{" "}
            Followers • {followingCount} Following
          </p>
        </div>
        
      </div>
      <div className="profile-content">
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
      </div>
      {/* <div className="followers-section">
        <h2>Followers</h2>
        <div className="followers">
          {followers.map((follower) => (
            <div key={follower._id} className="follower-item">
              <img
                src={follower.profilePicture}
                alt={follower.username}
                className="follower-image"
              />
              <p>{follower.username}</p>
              <p>Profile</p>
            </div>
          ))}
        </div>
      </div> */}
      {/* <div className="following-section">
        <h2>Following</h2>
        <div className="following">
          {following.map((follow) => (
            <div key={follow._id} className="following-item">
              <img
                src={follow.profilePicture}
                alt={follow.username}
                className="following-image"
              />
              <p>{follow.username}</p>
              <p>Profile</p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default SingleProfile;
