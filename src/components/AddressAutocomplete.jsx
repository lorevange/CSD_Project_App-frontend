import React, { useState } from 'react';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

const AddressAutocomplete = ({ onAddressSelect }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: libraries
    });

    const [autocomplete, setAutocomplete] = useState(null);

    const onLoad = (autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                console.log("Nessun dettaglio disponibile per l'input: '" + place.name + "'");
                return;
            }

            const addressData = {
                address: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                city: getCityFromAddressComponents(place.address_components)
            };

            onAddressSelect(addressData);
        } else {
            console.log('Autocomplete non è ancora caricato!');
        }
    };

    const getCityFromAddressComponents = (components) => {
        if (!components) return '';
        for (let component of components) {
            if (component.types.includes('locality')) {
                return component.long_name;
            }
        }
        return '';
    };

    if (!isLoaded) return <input type="text" placeholder="Caricamento..." disabled style={{ width: '100%', padding: '10px' }} />;

    return (
        <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
        >
            <input
                type="text"
                placeholder="Inserisci l'indirizzo dello studio"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
        </Autocomplete>
    );
};

export default AddressAutocomplete;
