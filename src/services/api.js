// src/services/api.js
import axios from 'axios';
import { useAuthStore } from '@/stores/auth.js';
import router from '@/router';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', // Backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies if needed
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized, possibly token expired
            const authStore = useAuthStore();
            authStore.logout();
            alert('Session expired. Please log in again.');
            router.push({ name: 'Login' });
        }
        return Promise.reject(error);
    }
);

export default api;