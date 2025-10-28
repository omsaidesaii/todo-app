const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://todo-app-of29.onrender.com';

export const API_URL = API_BASE_URL;
export const AUTH_API = `${API_BASE_URL}/api/auth`;
export const TODOS_API = `${API_BASE_URL}/api/todos`;

