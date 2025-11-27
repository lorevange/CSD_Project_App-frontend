import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

const SearchBar = ({ initialQuery = '', initialCity = '' }) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState(initialQuery);
    const [city, setCity] = useState(initialCity);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?query=${query}&city=${city}`);
    };

    return (
        <form className="search-bar" onSubmit={handleSearch}>
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
            <div className="input-group">
                <FaMapMarkerAlt className="input-icon" />
                <input
                    type="text"
                    placeholder={t('hero.city_placeholder')}
                    // Wait, original was "Città (es. Roma)". I should add a key for city placeholder.
                    // I will add it to en.json and it.json later or just use a generic one.
                    // Let's add 'hero.city_placeholder' to translations.
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <button type="submit" className="search-btn">
                {t('hero.search_button')}
            </button>
        </form>
    );
};

export default SearchBar;
