import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './css/navbar.css'

const Navbar = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Logo
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink to="/home" className="nav-link">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/about" className="nav-link">About</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/settings" className="nav-link" onClick={() => setShowSettings(!showSettings)}>Settings</NavLink>
          {showSettings && (
            <ul className="navbar-submenu">
                <br></br>
              <li className="nav-item">
                <NavLink to="/password" className="nav-link">Password</NavLink>
              </li>
              <br></br>
              <li className="nav-item">
                <NavLink to="/user" className="nav-link">USER</NavLink>
              </li>
              <br></br>
              <li className="nav-item">
                <NavLink to="/signout" className="nav-link">SIGN OUT</NavLink>
              </li>
              <br></br>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
