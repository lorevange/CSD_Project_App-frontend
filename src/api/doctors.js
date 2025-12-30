import { apiRequest } from './client';

export async function searchDoctors(query, city) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (city) params.append('city', city);

    return apiRequest(`/doctors/search?${params.toString()}`, {
        method: 'GET',
    });
}
