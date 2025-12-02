import React from 'react';
import '../styles/Map.css';

const Map = ({ address, city }) => {
    // Construct the query string for the map
    const query = encodeURIComponent(`${address}, ${city}`);

    // API Key - In a real app, this should be in an environment variable
    // For now, we use a placeholder that the user needs to replace
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

    if (!address || !city) return null;

    return (
        <div className="map-container">
            <iframe
                title="Doctor Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`}
            ></iframe>
        </div>
    );
};

export default Map;
