import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      
      // Get the redirect path or default to home
      const redirectPath = localStorage.getItem('redirectPath') || '/';
      localStorage.removeItem('redirectPath'); // Clear the saved path
      navigate(redirectPath);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back!</h2>
        <p className="subtitle">Please login to continue shopping</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        
        <p className="signup-prompt">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          Back to Shopping
        </button>
      </div>
    </div>
  );
}

export default Login;