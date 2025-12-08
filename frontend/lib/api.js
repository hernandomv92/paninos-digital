import axios from 'axios';

const api = axios.create({
    // Lee la URL que configuramos en Easypanel, o usa localhost si falla
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://paninos-paninos-backend.ufiah8.easypanel.host',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;