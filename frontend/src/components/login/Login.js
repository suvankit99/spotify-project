import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import { setUser } from "../../redux/userSlice";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login/",
        formData
      );
      console.log("Response:", response.data);

      if (response.data.error) {
        // Handle login error (e.g., show error message to user)
        toast.error(response.data.error , {
          position:"top-right",
        })
        console.error("Login Error:", response.data.error);
      } else {
        // Handle successful login (e.g., store user data, redirect)
        toast.success('Login Successful!', {
          position:"top-right",
        });
        setTimeout(() => {
           navigate("/");
        }, 5000);
       
        dispatch(setUser(response.data.foundUser));
        localStorage.setItem('token' , response.data.token) ; 
        console.log(response.data.foundUser) ; 
        console.log("Login Successful:", response.data);
      }
    } catch (error) {
      console.error("Error during login:", error);
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
          <label>Email </label>
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
        <div className="login__rememberMe">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <button className="login__button" type="submit">
          Log In
        </button>
        <a href="/" className="login__forgotPassword">
          Forgot your password?
        </a>
        <div className="login__signup">
          <span>
            Don't have an account? <a href="/signup">Sign up for Spotify</a>.
          </span>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
}

export default Login;
