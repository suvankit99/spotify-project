import React, { useState } from 'react';
import './SignUp.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false)
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
        "http://localhost:5000/api/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploading(false);
      return response.data.file;
    } catch (error) {
      setUploading(false);
      console.error("Error uploading file to server", error);
      return null;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageURL = await handleFileUpload() ; 
    console.log("Uploaded image url" , imageURL) ; 
    console.log('Form Data:', formData);
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('confirmPassword', formData.confirmPassword);
    data.append('role', formData.role);
    if (profilePicture) {
      data.append('profilePicture', imageURL);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Registration Successful!', {
        type: "success",
      });
      setTimeout(() => {
        navigate("/");
      }, 4000);
      console.log(response.data);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user');
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
