export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.your-production-server.com' 
    : 'http://localhost:8080'
};