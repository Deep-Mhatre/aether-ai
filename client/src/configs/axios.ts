import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL || 'http://localhost:3000',
    withCredentials: true
})

api.interceptors.request.use(async (config) => {
    const clerk = (window as any).Clerk;
    let token: string | undefined;

    try {
        token = await clerk?.session?.getToken?.();
    } catch (error) {
        console.error('Failed to retrieve Clerk token', { err: error });
    }

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api
