import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import { doctors } from '../data/mockData';
import '../styles/SearchResults.css';

const SearchResults = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('query') || '';
    const initialCity = searchParams.get('city') || '';

    const [filteredDoctors, setFilteredDoctors] = useState([]);

    useEffect(() => {
        const results = doctors.filter(doctor => {
            const queryLower = initialQuery.toLowerCase();
            const cityLower = initialCity.toLowerCase();

            // Check name
            const matchName = doctor.name.toLowerCase().includes(queryLower);

            // Check specialization in both languages
            const matchSpec =
                doctor.specialization.it.toLowerCase().includes(queryLower) ||
                doctor.specialization.en.toLowerCase().includes(queryLower);

            // Check services in both languages
            const matchServices =
                doctor.services.it.some(s => s.toLowerCase().includes(queryLower)) ||
                doctor.services.en.some(s => s.toLowerCase().includes(queryLower));

            const matchQuery = matchName || matchSpec || matchServices;

            const matchCity = doctor.city.toLowerCase().includes(cityLower);

            return matchQuery && matchCity;
        });
        setFilteredDoctors(results);
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
                    {filteredDoctors.length} {t('search_results.results_found')}
                    {initialCity && ` ${t('search_results.in')} ${initialCity}`}
                </h2>

                <div className="results-list">
                    {filteredDoctors.length > 0 ? (
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
            <Footer />
        </div>
    );
};

export default SearchResults;
