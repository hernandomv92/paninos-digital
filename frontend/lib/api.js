import axios from 'axios';

const api = axios.create({
    // Lee la URL que configuramos en Easypanel, o usa localhost si falla
    baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;