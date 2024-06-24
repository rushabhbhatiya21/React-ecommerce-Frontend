import React from 'react';
import './Navbar.css'; // Import the CSS file for styling
import api from '../utils/UserApi'; // Import API functions
import { useSelector } from 'react-redux'; // Import Redux hook for selecting state
import { useNavigate } from 'react-router-dom'; // Import hook for navigation

function Navbar() {
  const navigate = useNavigate(); // Navigation function from react-router-dom
  const { totalCount } = useSelector((state) => state.cart); // Select total count of items in cart from Redux store

  // Function to handle user sign out
  const handleSignOut = async (e) => {
    e.preventDefault();
    await api.post('logout'); // API call to logout endpoint
    localStorage.removeItem('username'); // Remove username from local storage
    window.location.href = '/signin'; // Redirect to signin page
  };

  useEffect(()=> {

    return () => {
      localStorage.setItem('isFetched',"false")
    }
  }, [])

  return (
    <nav className="navbar">
      {/* Logo with navigation to home on click */}
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <img src="/src/assets/logo.jpg" alt="SmartMart Logo"/>
      </div>
      {/* Title of the application */}
      <h1 className="navbar-title">SmartMart</h1>
      <div className="navbar-links">
        {/* Conditionally render links based on current location */}
        {!(window.location.href.includes('/signin') || window.location.href.includes('/signup')) && (
          <>
            {/* Link to Home page */}
            <a onClick={() => navigate('/')} className="navbar-link">Home</a>
            {/* Cart link with count of items */}
            <div className="cart-container" onClick={() => navigate('/cart')}>
              <a className="navbar-link">Cart</a>
              {totalCount > 0 && <span className="cart-count">{totalCount}</span>}
            </div>
            {/* Sign Out link with handler */}
            <a onClick={handleSignOut} className="navbar-link">Sign Out</a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
