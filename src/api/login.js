import { apiRequest } from './client';

export const tryLogin = async (email, password) => {
    const endpoint = '/users/login/';
    const payload = { email: email, password: password };
    
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};
