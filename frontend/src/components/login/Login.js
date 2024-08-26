import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import { setUser } from "../../redux/userSlice";

// Access the API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const { email, password } = formData;
    let isValid = true;

    if (!email) {
      toast.error("Email is required", { position: "top-right" });
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email is invalid", { position: "top-right" });
      isValid = false;
    }

    if (!password) {
      toast.error("Password is required", { position: "top-right" });
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/login/`,  // Use the environment variable here
        formData
      );
      console.log("Response:", response.data);

      if (response.data.error) {
        toast.error(response.data.error, {
          position: "top-right",
        });
        console.error("Login Error:", response.data.error);
      } else {
        toast.success('Login Successful!', {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/");
        }, 5000);

        dispatch(setUser(response.data.foundUser));
        localStorage.setItem('token', response.data.token);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An unexpected error occurred. Please try again later.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <img
          src="/images/Spotify_Primary_Logo_RGB_White.png"
          alt="Spotify Logo"
          className="login__logo"
        />
        <h2>Log In to Spotify</h2>
        <div className="login__inputContainer">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email or username"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="login__inputContainer">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button className="login__button" type="submit">
          Log In
        </button>
        <div className="login__signup">
          <span>
            Don't have an account? <a href="/signup">Sign up for Spotify</a>.
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
