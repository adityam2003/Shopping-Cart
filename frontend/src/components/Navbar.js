import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">ShopCart</Link>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-input"
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
      <div className="navbar-right">
        <Link to="/cart" className="nav-icon">
          <i className="fas fa-shopping-bag"></i>
        </Link>
        {username ? (
          <div className="user-profile">
            <button 
              className="profile-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>Hi, {username}</span>
              <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link 
                  to="/orders" 
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <i className="fas fa-box"></i>
                  Orders
                </Link>
                <button 
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-button">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;