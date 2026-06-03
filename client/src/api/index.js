import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// Add token to headers if it exists
API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`;
  }
  return req;
});

// Events
export const fetchEvents = (keyword = '', category = '', location = '') => {
  let url = '/events?';
  if (keyword) url += `keyword=${keyword}&`;
  if (category) url += `category=${category}&`;
  if (location) url += `location=${location}`;
  return API.get(url);
};

export const fetchEventById = (id) => API.get(`/events/${id}`);
export const createEvent = (newEvent) => API.post('/events', newEvent);
export const updateEvent = (id, updatedEvent) => API.put(`/events/${id}`, updatedEvent);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// Users
export const loginUser = (formData) => API.post('/users/login', formData);
export const registerUser = (formData) => API.post('/users/register', formData);
export const getUserProfile = () => API.get('/users/profile');
export const updateUserProfile = (profileData) => API.put('/users/profile', profileData);

// Bookings
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const fetchMyBookings = () => API.get('/bookings/mybookings');

// Suggestions & Recommendations
export const fetchEventSuggestions = (keyword) => API.get(`/events/suggestions?keyword=${keyword}`);
export const fetchEventRecommendations = (viewed = '') => API.get(`/events/recommendations?viewed=${viewed}`);

// Admin Stats & Requests
export const fetchAdminStats = () => API.get('/admin/stats');
export const fetchPermissionRequests = () => API.get('/admin/requests');
export const updatePermissionRequest = (id, status) => API.put(`/admin/requests/${id}`, { status });
