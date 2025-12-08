import { apiRequest } from './client';

const buildRegistrationPayload = (userType, data) => {
    let payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        identity_number: data.identity_number,
        email: data.email,
        phone_number: data.phone || undefined,
        password: data.password
    }
    switch (userType) {
        case 'doctor':
            return { ...payload,
                license_number: data.license_number,
                specialization: data.specialization,
                city: data.city,
                profile: 'doctor'
            };
        case 'patient':
            return { ...payload,
                profile: 'patient'
            };
        default:
            return null;
    }
};

export const registerUser = async (userType, formData) => {
    const endpoint = userType === 'doctor' ? '/doctors/' : '/patients/';
    const payload = buildRegistrationPayload(userType, formData);

    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};
