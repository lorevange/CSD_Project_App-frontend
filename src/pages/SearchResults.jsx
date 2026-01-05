import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import Map from '../components/Map';
import { searchDoctors, getDoctorById } from '../api/doctors';
import { normalizePhotoToDataUrl } from '../utils/photo';
import '../styles/SearchResults.css';

const SearchResults = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('query') || '';
    const initialCity = searchParams.get('city') || '';

    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [highlightedId, setHighlightedId] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 41.9028, lng: 12.4964 });

    useEffect(() => {
        const fetchDoctors = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const results = await searchDoctors(initialQuery, initialCity);
                const list = Array.isArray(results)
                    ? results
                    : Array.isArray(results?.items)
                        ? results.items
                        : Array.isArray(results?.data)
                            ? results.data
                            : Array.isArray(results?.results)
                                ? results.results
                                : [];

                // Adapt API response to match frontend DoctorCard expectations
                // Backend returns: { first_name, last_name, specialization, city, address, latitude, longitude, ... }
                // Frontend expects: { id, name, specialization: {it, en}, services: {it, en}, rating, reviewsCount, image, ... }
                const baseResults = list.map(doc => ({
                    id: doc.id,
                    name: `${doc.first_name} ${doc.last_name}`,
                    specialization: {
                        it: doc.specialization,
                        en: doc.specialization // Fallback as backend is single language
                    },
                    city: doc.city,
                    address: doc.address,
                    latitude: doc.latitude,
                    longitude: doc.longitude,
                    rating: Number.isFinite(Number(doc.average_rating ?? doc.avg_rating ?? doc.rating))
                        ? Number(doc.average_rating ?? doc.avg_rating ?? doc.rating)
                        : 0,
                    reviewsCount: Number.isFinite(Number(doc.reviews_count ?? doc.reviewsCount ?? doc.reviews_total))
                        ? Number(doc.reviews_count ?? doc.reviewsCount ?? doc.reviews_total)
                        : (Array.isArray(doc.reviews) ? doc.reviews.length : 0),
                    image: normalizePhotoToDataUrl(doc?.photo, 'image/png') || 'https://picsum.photos/200/300',
                    services: doc.services,
                    price: 0,
                    reviews: []
                }));

                const enrichedResults = await Promise.all(baseResults.map(async (doc) => {
                    if (!doc.id) return doc;
                    try {
                        const detail = await getDoctorById(doc.id);
                        return {
                            ...doc,
                            rating: Number.isFinite(Number(detail?.average_rating ?? detail?.avg_rating ?? detail?.rating))
                                ? Number(detail.average_rating ?? detail.avg_rating ?? detail.rating)
                                : doc.rating,
                            reviewsCount: Number.isFinite(Number(detail?.ratings_count ?? detail?.reviews_count ?? detail?.reviewsCount))
                                ? Number(detail.ratings_count ?? detail.reviews_count ?? detail.reviewsCount)
                                : doc.reviewsCount,
                            image: normalizePhotoToDataUrl(detail?.photo, 'image/png') || doc.image,
                        };
                    } catch (err) {
                        console.warn('Failed to load doctor detail for search card', err);
                        return doc;
                    }
                }));

                setFilteredDoctors(enrichedResults);
                const firstWithCoords = enrichedResults.find((d) => d.latitude && d.longitude);
                if (firstWithCoords) {
                    setMapCenter({ lat: firstWithCoords.latitude, lng: firstWithCoords.longitude });
                } else {
                    setMapCenter({ lat: 41.9028, lng: 12.4964 });
                }
            } catch (err) {
                console.error("Error fetching doctors:", err);
                setError(t('search_results.error', 'Error loading results'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
    }, [initialQuery, initialCity, t]);

    const handleMarkerClick = (id) => {
        setHighlightedId(id);
        setTimeout(() => setHighlightedId(null), 3000);
        const doc = filteredDoctors.find((d) => d.id === id);
        if (doc?.latitude && doc?.longitude) {
            setMapCenter({ lat: doc.latitude, lng: doc.longitude });
        }
    };

    const handleCardSelect = (doctor) => {
        setHighlightedId(doctor.id);
        if (doctor.latitude && doctor.longitude) {
            setMapCenter({ lat: doctor.latitude, lng: doctor.longitude });
        }
    };

    return (
        <div className="search-results-page">
            <Header />
            <div className="search-header">
                <div className="container">
                    <SearchBar initialQuery={initialQuery} initialCity={initialCity} />
                </div>
            </div>

            <div className="container results-container">
                <h2 className="results-title">
                    {isLoading ? (
                        t('search_results.searching', 'Searching...')
                    ) : (
                        <>
                            {filteredDoctors.length} {t('search_results.results_found')}
                            {initialCity && ` ${t('search_results.in')} ${initialCity}`}
                        </>
                    )}
                </h2>

                <div className="search-content">
                    <div className="results-column">
                        <div className="results-list">
                            {isLoading ? (
                                <div className="results-spinner">
                                    <div className="spinner-ring" />
                                    <span>{t('search_results.loading', 'Loading doctors...')}</span>
                                </div>
                            ) : filteredDoctors.length > 0 ? (
                                filteredDoctors.map(doctor => (
                                    <DoctorCard
                                        key={doctor.id}
                                        doctor={doctor}
                                        isHighlighted={doctor.id === highlightedId}
                                        onSelect={() => handleCardSelect(doctor)}
                                    />
                                ))
                            ) : (
                                <div className="no-results">
                                    <p>{t('search_results.no_results')}</p>
                                    <p>{t('search_results.try_modifying')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="map-column">
                        {!isLoading && filteredDoctors.length > 0 && (
                            <Map
                                center={mapCenter}
                                markers={filteredDoctors
                                    .filter(d => d.latitude && d.longitude)
                                    .map(d => ({ lat: d.latitude, lng: d.longitude, id: d.id }))}
                                zoom={12}
                                onMarkerClick={handleMarkerClick}
                            />
                        )}
                        {!isLoading && filteredDoctors.length === 0 && (
                            <Map center={{ lat: 41.9028, lng: 12.4964 }} zoom={10} />
                        )}
                        {isLoading && (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' }}>
                                Loading Map...
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SearchResults;
