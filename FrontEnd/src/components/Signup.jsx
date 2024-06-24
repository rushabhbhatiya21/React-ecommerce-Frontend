import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import hook for navigation
import toast, { Toaster } from 'react-hot-toast'; // Import toast notifications
import api from '../utils/UserApi'; // Import API functions from utility file
import './Signup.css'; // Import the CSS file for styling

const Signup = () => {
  const [username, setUsername] = useState(''); // State for username input field
  const [password, setPassword] = useState(''); // State for password input field
  const [errors, setErrors] = useState({}); // State for form validation errors
  const navigate = useNavigate(); // Navigation function from react-router-dom

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
        const response = await api.post('register', { username, password }); // API call to register endpoint
        if (response) {
          toast.success("User created successfully!"); // Show success toast for successful registration
          setTimeout(() => {
            navigate('/signin'); // Redirect to signin page after 2 seconds
          }, 2000);
        } else {
          toast.error("Sorry! Username is Taken."); // Show error toast if username is already taken
        }
      } catch (error) {
        toast.error("Something went wrong."); // Show error toast for API error
      }
    }
  };

  return (
    <>
      <Toaster /> {/* Toast container for displaying notifications */}
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Sign Up</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())} // Trim input value to remove leading and trailing spaces
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
                onChange={(e) => setPassword(e.target.value.trim())} // Trim input value to remove leading and trailing spaces
                className={errors.password ? 'input-error' : ''} // Apply error class if there's a validation error
              />
              {errors.password && <span className="error-message">{errors.password}</span>} {/* Display error message if there's a validation error */}
            </div>
            <button type="submit" className="signup-button">Sign Up</button> {/* Sign up button */}
            <div style={{ marginTop: "1rem" }}>Already have an account?{" "} {/* Sign in link */}
              <a style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => { navigate('/signin') }}>Sign in</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
