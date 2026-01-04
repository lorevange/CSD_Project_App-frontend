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

export async function getDoctorServices(doctorId, { includeInactive } = {}) {
    const params = new URLSearchParams();
    if (doctorId !== undefined && doctorId !== null) {
        params.append('doctor_id', doctorId);
    }
    if (includeInactive) {
        params.append('include_inactive', 'True');
    }
    const query = params.toString();
    const path = query ? `/doctor-services/?${query}` : '/doctor-services/';
    return apiRequest(path, { method: 'GET' });
}

export async function deactivateDoctorService(serviceId) {
    return apiRequest(`/doctor-services/${serviceId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: false }),
    });
}

export async function activateDoctorService(serviceId) {
    return apiRequest(`/doctor-services/${serviceId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: true }),
    });
}
