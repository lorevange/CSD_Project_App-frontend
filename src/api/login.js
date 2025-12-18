import { apiRequest } from './client';

export const tryLogin = async (email, password) => {
    const endpoint = '/users/login/';
    const payload = { email, password };

    // Ritorna l'intera risposta del backend
    // { access_token, token_type, user }
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};