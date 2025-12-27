import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Authentication APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

// Trip APIs
export const tripAPI = {
    createTrip: (data) => api.post('/trips/plan', data),
    getTrip: (id) => api.get(`/trips/${id}`),
    getMyTrips: () => api.get('/trips/my-trips'),
    deleteTrip: (id) => api.delete(`/trips/${id}`),
};

// Destination APIs
export const destinationAPI = {
    getAll: () => api.get('/destinations'),
    search: (query) => api.get(`/destinations/search?query=${query}`),
};

export default api;
