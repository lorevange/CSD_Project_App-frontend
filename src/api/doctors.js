import { apiRequest } from './client';

export async function searchDoctors(query, city) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (city) params.append('city', city);

    return apiRequest(`/doctors/search?${params.toString()}`, {
        method: 'GET',
    });
}

export async function getDoctorById(doctorId) {
    return apiRequest(`/doctors/${doctorId}`, {
        method: 'GET',
    });
}

export async function getDoctorProfileBundle(
    doctorId,
    {
        appointmentsStatus,
        appointmentsStartFrom,
        appointmentsStartTo,
        reviewsSkip = 0,
        reviewsLimit = 50,
        reviewSummaryLanguage,
    } = {}
) {
    return apiRequest('/doctors/profile', {
        method: 'POST',
        body: JSON.stringify({
            doctorId,
            include: ['appointments', 'reviews', 'reviewSummary'],
            appointments: {
                status: appointmentsStatus,
                startFrom: appointmentsStartFrom instanceof Date
                    ? appointmentsStartFrom.toISOString()
                    : appointmentsStartFrom,
                startTo: appointmentsStartTo instanceof Date
                    ? appointmentsStartTo.toISOString()
                    : appointmentsStartTo,
            },
            reviews: {
                skip: reviewsSkip,
                limit: reviewsLimit,
            },
            reviewSummary: {
                language: reviewSummaryLanguage,
            },
        }),
    });
}
