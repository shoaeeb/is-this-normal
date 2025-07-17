import axios from 'axios';

// Create an axios instance with the base URL
// For a full-stack deployment, we don't need a base URL as the API is served from the same origin
const api = axios.create({
  baseURL: ''
});

export default api;