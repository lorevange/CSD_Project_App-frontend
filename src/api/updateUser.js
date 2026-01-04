import { apiRequest } from './client';

export const updateUserFirstNameLastName = async (user) => {
    const endpoint = '/users/update/';
    const payload = {
        first_name: user.first_name,
        last_name: user.last_name,
        identity_number: user.identity_number,
        photo: user.photo,
        information: user.information
    };
    
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};
