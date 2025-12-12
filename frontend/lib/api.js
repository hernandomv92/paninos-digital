import axios from 'axios';

const api = axios.create({
    // Use environment variable if available, otherwise fallback to the new custom domain
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.paninos.co/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;