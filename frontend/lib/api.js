import axios from 'axios';

const api = axios.create({
    // Hardcoded backend URL for Easypanel deployment
    // TODO: Move back to environment variable once build process is fixed
    baseURL: 'https://paninos-paninos-backend.ufiah8.easypanel.host/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;