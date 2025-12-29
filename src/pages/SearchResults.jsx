import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import SkeletonCard from '../components/SkeletonCard';
import { doctors } from '../data/mockData';
import Map from '../components/Map';
import { searchDoctors } from '../api/doctors';
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

    useEffect(() => {
        const fetchDoctors = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const results = await searchDoctors(initialQuery, initialCity);

                // Adapt API response to match frontend DoctorCard expectations
                // Backend returns: { first_name, last_name, specialization, city, address, latitude, longitude, ... }
                // Frontend expects: { id, name, specialization: {it, en}, services: {it, en}, rating, reviewsCount, image, ... }
                const adaptedResults = results.map(doc => ({
                    id: doc.identity_number,
                    name: `${doc.first_name} ${doc.last_name}`,
                    specialization: {
                        it: doc.specialization,
                        en: doc.specialization // Fallback as backend is single language
                    },
                    city: doc.city,
                    address: doc.address,
                    latitude: doc.latitude,
                    longitude: doc.longitude,
                    // Mock/Placeholder for missing backend fields
                    rating: 0,
                    reviewsCount: 0,
                    image: "https://via.placeholder.com/150",
                    services: { it: ["Servizio Base"], en: ["Base Service"] },
                    price: 0,
                    reviews: []
                }));

                setFilteredDoctors(adaptedResults);
            } catch (err) {
                console.error("Error fetching doctors:", err);
                setError(t('search_results.error', 'Error loading results'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
    }, [initialQuery, initialCity]);

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
                                // Render 3 skeleton cards while loading
                                [...Array(3)].map((_, index) => <SkeletonCard key={index} />)
                            ) : filteredDoctors.length > 0 ? (
                                filteredDoctors.map(doctor => (
                                    <DoctorCard key={doctor.id} doctor={doctor} />
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
                                center={filteredDoctors[0]?.latitude ? { lat: filteredDoctors[0].latitude, lng: filteredDoctors[0].longitude } : { lat: 41.9028, lng: 12.4964 }}
                                markers={filteredDoctors.filter(d => d.latitude && d.longitude).map(d => ({ lat: d.latitude, lng: d.longitude }))}
                                zoom={12}
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
