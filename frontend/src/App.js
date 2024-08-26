import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./components/signup/SignUp";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import AdminPage from "./components/adminPage/AdminPage";
import UserLibrary from "./components/userLibrary/UserLibrary";
import Dashboard from "./components/dashboard/Dashboard";
import SinglePlaylist from "./components/singlePlaylist/SinglePlaylist";
import AllPlaylists from "./components/allPlaylists/AllPlaylists";
import AllSongs from "./components/allSongs/AllSongs";
import SingleProfile from "./components/singleProfile/SingleProfile";
import SearchPage from "./components/searchPage/SearchPage";
import DisplaySongsByGenre from "./components/displaySongsByGenre/DisplaySongsByGenre";
import AdminGuard from "./components/adminGuard/AdminGuard";
import MyMusicGuard from "./components/myMusicGuard/MyMusicGuard"; // Import the MyMusicGuard component

const router = createBrowserRouter([
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
  {
    path: "/admin",
    element: <AdminGuard element={<AdminPage />} />,
  },
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/library/",
        element: <UserLibrary />,
      },
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/playlist/:id",
        element: <SinglePlaylist />,
      },
      {
        path: "/all-playlists",
        element: <AllPlaylists />,
      },
      {
        path: "/all-songs",
        element: <AllSongs />,
      },
      {
        path: "/profile/:userId",
        element: <SingleProfile />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/:type/:name",
        element: <DisplaySongsByGenre />,
      },

      {
        path: "/mymusic",
        element: <MyMusicGuard />, // Protect the /mymusic route with MyMusicGuard
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
