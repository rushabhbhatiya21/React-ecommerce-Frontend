import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import hook for navigation
import toast, { Toaster } from 'react-hot-toast'; // Import toast notifications
import api from '../utils/UserApi'; // Import API functions from utility file
import './Signin.css'; // Import the CSS file for styling

const Signin = () => {
  const [username, setUsername] = useState(''); // State for username input field
  const [password, setPassword] = useState(''); // State for password input field
  const [errors, setErrors] = useState({}); // State for form validation errors
  const navigate = useNavigate(); // Navigation function from react-router-dom

  useEffect(() => {
    const isRedirected = localStorage.getItem('Failed');
    if (isRedirected) {
      toast.error("Not authorized without signing in."); // Show error toast if redirected due to unauthorized access
      localStorage.removeItem('Failed');
    }
  }, []);

  // Function to validate username and password
  const validate = () => {
    const errors = {};
    if (!username || username.length < 6 || username.length > 12 || /\s/.test(username)) {
      errors.username = "Username must be 6-12 characters long and contain no spaces.";
    }
    if (!password || password.length < 6 || password.length > 12 || /\s/.test(password)) {
      errors.password = "Password must be 6-12 characters long and contain no spaces.";
    }
    return errors;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const validationErrors = validate(); // Validate form inputs
    setErrors(validationErrors); // Set validation errors
    if (Object.keys(validationErrors).length === 0) { // Proceed if there are no validation errors
      try {
        const response = await api.post('login', { username, password }); // API call to login endpoint
        if (response) {
          localStorage.setItem('username', username); // Store username in local storage
          toast.success("Login successful!"); // Show success toast for successful login
          setTimeout(() => {
            navigate('/'); // Redirect to home page after 2 seconds
          }, 2000);
        } else {
          toast.error("Login failed. Please check your credentials."); // Show error toast for failed login
        }
      } catch (error) {
        toast.error("Login failed. Please check your credentials."); // Show error toast for API error
      }
    }
  };

  return (
    <>
      <Toaster /> {/* Toast container for displaying notifications */}
      <div className="signin-container">
        <div className="signin-card">
          <h2 className="signin-title">Sign In</h2>
          <form onSubmit={handleSubmit} className="signin-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={errors.username ? 'input-error' : ''} // Apply error class if there's a validation error
              />
              {errors.username && <span className="error-message">{errors.username}</span>} {/* Display error message if there's a validation error */}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'input-error' : ''} // Apply error class if there's a validation error
              />
              {errors.password && <span className="error-message">{errors.password}</span>} {/* Display error message if there's a validation error */}
            </div>
            <button type="submit" className="signin-button">Sign In</button> {/* Sign in button */}
            <div style={{ marginTop: "1rem" }}>Doesn't have an account?{" "} {/* Sign up link */}
              <a style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => { navigate('/signup') }}>Sign up</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signin;
