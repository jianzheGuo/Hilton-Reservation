export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'http://localhost:8080' 
    : 'http://localhost:8080'
};