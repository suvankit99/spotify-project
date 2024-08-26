import React from 'react';
import './UserCard.css';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
  const navigate = useNavigate() ; 
  const handleClick = () => {
    navigate(`/profile/${user._id}`) ; 
  }
  return (
    <div className="user-content-item">
      <img src={user.profilePicture} alt={user.username} className="user-content-image" onClick={handleClick} />
      <h3>{user.username}</h3>
      <p>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
    </div>
  );
};

export default UserCard;
