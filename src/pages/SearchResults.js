import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import { doctors } from '../data/mockData';
import '../styles/SearchResults.css';

const SearchResults = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get('query') || '';
    const initialCity = searchParams.get('city') || '';

    const [filteredDoctors, setFilteredDoctors] = useState([]);

    useEffect(() => {
        const results = doctors.filter(doctor => {
            const matchNameOrSpec =
                doctor.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
                doctor.specialization.toLowerCase().includes(initialQuery.toLowerCase());

            const matchCity =
                doctor.city.toLowerCase().includes(initialCity.toLowerCase());

            return matchNameOrSpec && matchCity;
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
                    {filteredDoctors.length} risultati trovati
                    {initialCity && ` a ${initialCity}`}
                </h2>

                <div className="results-list">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))
                    ) : (
                        <div className="no-results">
                            <p>Nessun dottore trovato con questi criteri di ricerca.</p>
                            <p>Prova a modificare i filtri o cerca in un'altra città.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SearchResults;
