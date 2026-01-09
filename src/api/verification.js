import { apiRequest } from './client';

export const verifyEmail = async (email, code) => {
    const endpoint = '/users/verify-email';
    const payload = { email, code };

    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const resendVerification = async (email) => {
    const endpoint = '/users/resend-verification';
    const payload = { email };

    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};
