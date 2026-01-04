export const hexToBase64 = (hexString) => {
    if (!hexString || typeof hexString !== 'string') return null;
    const trimmed = hexString.trim();
    const clean = trimmed.startsWith('\\x') || trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
    if (clean.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(clean)) return null;

    let binary = '';
    for (let i = 0; i < clean.length; i += 2) {
        const byte = parseInt(clean.slice(i, i + 2), 16);
        if (Number.isNaN(byte)) return null;
        binary += String.fromCharCode(byte);
    }

    try {
        return btoa(binary);
    } catch (err) {
        console.error('Failed to convert hex to base64', err);
        return null;
    }
};

const bufferLikeToBase64 = (value) => {
    if (!value) return null;

    if (value instanceof ArrayBuffer) {
        const bytes = new Uint8Array(value);
        return bufferLikeToBase64(bytes);
    }

    if (ArrayBuffer.isView(value)) {
        let binary = '';
        for (let i = 0; i < value.byteLength; i += 1) {
            binary += String.fromCharCode(value[i]);
        }
        return btoa(binary);
    }

    if (typeof value === 'object' && Array.isArray(value.data)) {
        const bytes = new Uint8Array(value.data);
        return bufferLikeToBase64(bytes);
    }

    return null;
};

export const normalizePhotoToDataUrl = (photoValue, mime = 'image/jpeg') => {
    if (!photoValue) return null;

    if (typeof photoValue === 'string') {
        const trimmed = photoValue.trim();
        if (trimmed.startsWith('data:')) return trimmed;

        const compact = trimmed.replace(/\s+/g, '');

        const hexEncoded = hexToBase64(compact);
        if (hexEncoded) return `data:${mime};base64,${hexEncoded}`;

        const base64Candidate = compact.includes(',') ? compact.split(',').pop() : compact;
        if (/^[A-Za-z0-9+/=]+$/.test(base64Candidate)) {
            return `data:${mime};base64,${base64Candidate}`;
        }
    }

    // Handle Buffer-like structures returned by some clients
    const bufferEncoded = bufferLikeToBase64(photoValue);
    if (bufferEncoded) return `data:${mime};base64,${bufferEncoded}`;

    return null;
};
