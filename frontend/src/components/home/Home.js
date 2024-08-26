import React from 'react';
import './Home.css';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import PlayerControls from '../playercontrols/PlayerControls';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotLoggedInFooter from '../notLoggedInFooter/NotLoggedInFooter';

function Home() {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn) ; 
  return (
    
    <div className="app">
      <Header />
   
      <div className="app__body">
        <Sidebar />
        <Outlet/>
      </div>
      {isLoggedIn ? <PlayerControls/> : <NotLoggedInFooter/>}
    </div>
  );
}

export default Home;
