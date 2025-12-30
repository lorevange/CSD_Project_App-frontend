import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

const SearchBar = ({ initialQuery = '', initialCity = '' }) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState(initialQuery);
    const [city, setCity] = useState(initialCity);
    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [placeholderHeight, setPlaceholderHeight] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (searchRef.current) {
                // Threshold to trigger sticky (approx height of header + some scroll)
                if (window.scrollY > 100) {
                    setIsSticky(true);
                    setPlaceholderHeight(searchRef.current.offsetHeight);
                } else {
                    setIsSticky(false);
                    setPlaceholderHeight(0);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/doctors/search?query=${query}&city=${city}`);
    };

    return (
        <>
            {isSticky && <div style={{ height: placeholderHeight }} />}
            <form
                ref={searchRef}
                className={`search-bar ${isSticky ? 'sticky' : ''}`}
                onSubmit={handleSearch}
            >
                <div className="input-group">
                    <FaSearch className="input-icon" />
                    <input
                        type="text"
                        placeholder={t('hero.search_placeholder')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="divider"></div>
                <div className="input-group city-input">
                    <FaMapMarkerAlt className="input-icon" />
                    <input
                        type="text"
                        placeholder={t('hero.city_placeholder')}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <button type="submit" className="search-btn">
                    {t('hero.search_button')}
                </button>
            </form>
        </>
    );
};

export default SearchBar;
