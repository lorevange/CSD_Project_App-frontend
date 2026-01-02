import { apiRequest } from './client';

export async function getAppointments({ doctorId, userId, startFrom, startTo, status } = {}) {
    const params = new URLSearchParams();

    if (doctorId !== undefined && doctorId !== null) params.append('doctor_id', doctorId);
    if (userId) params.append('user_id', userId);
    if (startFrom) params.append('start_from', startFrom instanceof Date ? startFrom.toISOString() : startFrom);
    if (startTo) params.append('start_to', startTo instanceof Date ? startTo.toISOString() : startTo);
    if (status) params.append('status', status);

    const queryString = params.toString();
    const path = queryString ? `/appointments/?${queryString}` : '/appointments/';

    return apiRequest(path, {
        method: 'GET',
    });
}
