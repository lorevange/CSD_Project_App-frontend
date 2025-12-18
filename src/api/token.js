import { apiRequest } from './client';

export const fetchCurrentUser = async () => {
    const data = await apiRequest('/users/me', { method: 'GET' });

    if (!data || !data.id || !data.email) {
        throw new Error('Invalid token');
    }

    return data;
};
