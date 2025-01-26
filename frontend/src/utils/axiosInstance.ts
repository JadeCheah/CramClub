import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { logout } from '../redux/authSlice';

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080", // Base URL for all requests
    withCredentials: true,
});

// Placeholder for dynamically setting the store
let storeInstance: any;

// Function to inject the store dynamically
export const setStore = (store: any) => {
    storeInstance = store;
};

// Helper function to check token validity
const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: { exp: number } = jwtDecode(token); // Decode the token
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return decoded.exp <= currentTime; // Token is expired if exp <= current time
    } catch {
        return true; // If decoding fails, assume the token is invalid
    }
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            if (isTokenExpired(token)) {
                if (storeInstance) {
                    storeInstance.dispatch(logout()); // Use the dynamically set store instance
                }
                alert("Session expired. Please log in again.");
                window.location.href = "/login"; // Redirect to login page
                throw new axios.Cancel("Token expired"); // Cancel the request
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration (401 Unauthorized)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (storeInstance) {
                storeInstance.dispatch(logout());
            }
            alert("Session expired. Please log in again.");
            window.location.href = "/login"; 
        }
        return Promise.reject(error); // Propagate the error for further handling
    }
);

export default axiosInstance;