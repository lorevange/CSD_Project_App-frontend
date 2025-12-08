const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(path, options = {}) {
    if (!API_BASE_URL) {
        throw new Error('API base URL is not configured');
    }

    const url = new URL(path, API_BASE_URL).toString();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

    const response = await fetch(url, { ...options, headers });
    const contentType = response.headers.get('content-type') || '';

    let data;
    if (contentType.includes('application/json')) {
        try {
            data = await response.json();
        } catch {
            data = null;
        }
    } else {
        try {
            data = await response.text();
        } catch {
            data = null;
        }
    }

    if (!response.ok) {
        const detail = data?.detail;
        const detailMessage = Array.isArray(detail)
            ? detail.map((d) => d.msg || JSON.stringify(d)).join('; ')
            : (typeof detail === 'string' ? detail : null);
        const message = detailMessage || data?.message || (typeof data === 'string' && data) || response.statusText;
        throw new Error(message || 'Request failed');
    }

    return data;
}
