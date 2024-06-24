import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseurl = "http://localhost:8081"; // Base URL for API requests

const api = axios.create({
    withCredentials: true, // Include credentials (cookies, authorization headers) with every request
    baseURL: baseurl, // Set base URL for API requests
});

// Axios interceptor to handle unauthorized responses
api.interceptors.response.use(
    response => response, // Return response if successful
    error => {
      if (error.response.status === 401 && error.response.data['message'] === "Not authorized") {
        console.log(error); // Log the error for debugging purposes
        localStorage.setItem('Failed', true); // Set localStorage item indicating unauthorized access
        window.location.href = '/signin'; // Redirect to signin page
      }
    });

// Function to fetch items from the server
export const getItems = () => {
    return api.get('items'); // Make a GET request to 'items' endpoint
}

// Function to authenticate user login
export const login = (username, password) => {
    return api.post('login', { username, password }); // Make a POST request to 'login' endpoint with username and password
}

export default api; // Export the configured axios instance as default
