import React, { useState } from 'react';
import './SignUp.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';

function SignUp() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'listener',
  });
  const [profilePicture, setProfilePicture] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", profilePicture);
    try {
      setUploading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/upload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploading(false);
      return response.data.url;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading file to server", error);
      toast.error("Error in uploading profile picture", {
        position: 'top-right'
      });
      return null;
    }
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username) {
      toast.error("Username is required", {
        position: "top-right"
      });
      return false;
    }
    if (!email) {
      toast.error("Email is required", {
        position: "top-right"
      });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format", {
        position: "top-right"
      });
      return false;
    }
    if (!password) {
      toast.error("Password is required", {
        position: "top-right"
      });
      return false;
    }
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters long", {
        position: "top-right"
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password fields do not match", {
        position: "top-right"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const imageURL = profilePicture ? await handleFileUpload() : null;
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', formData.role);
    if (imageURL) {
      data.append('profilePicture', imageURL);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/signup/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Registration Successful!', {
        type: "success",
      });
      console.log(response.data);
      dispatch(setUser(response.data.user));
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user', {
        position: "top-right"
      });
    }
  };

  return (
    <div className="signup">
      <form className="signup__form" onSubmit={handleSubmit}>
        <img src='/images/Spotify_Primary_Logo_RGB_White.png' alt="Spotify Logo" className="signup__logo" />
        <h2>Sign up to start listening</h2>
        <div className="signup__inputContainer">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="signup__inputContainer">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="signup__inputContainer">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="signup__inputContainer">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div className="signup__inputContainer">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="listener">Listener</option>
            <option value="artist">Artist</option>
          </select>
        </div>
        <div className="signup__inputContainer">
          <label>Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
          />
        </div>
        <button className="signup__button" type="submit">Sign Up</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
