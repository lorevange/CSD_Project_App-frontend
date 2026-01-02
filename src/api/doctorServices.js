import { apiRequest } from './client';

export async function createDoctorService({ name, price, doctorId }) {
    return apiRequest('/doctor-services/', {
        method: 'POST',
        body: JSON.stringify({
            name,
            price,
            doctor_id: doctorId,
        }),
    });
}