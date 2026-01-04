import { apiRequest } from './client';

export async function listReviewsForDoctor(doctorId, { skip = 0, limit = 50 } = {}) {
    const params = new URLSearchParams();
    if (skip) params.append('skip', skip);
    if (limit) params.append('limit', limit);
    const query = params.toString();
    const path = query ? `/doctors/${doctorId}/reviews?${query}` : `/doctors/${doctorId}/reviews`;

    return apiRequest(path, { method: 'GET' });
}

export async function createReview(doctorId, { rating, comment }) {
    return apiRequest(`/doctors/${doctorId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
    });
}

export async function updateReview(reviewId, { rating, comment }) {
    return apiRequest(`/reviews/${reviewId}`, {
        method: 'PATCH',
        body: JSON.stringify({ rating, comment }),
    });
}

export async function deleteReview(reviewId) {
    return apiRequest(`/reviews/${reviewId}`, {
        method: 'DELETE',
    });
}
