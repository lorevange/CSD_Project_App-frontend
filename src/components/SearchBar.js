import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

const SearchBar = ({ initialQuery = '', initialCity = '' }) => {
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
                    placeholder="Dottore, specializzazione, patologia..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <div className="divider"></div>
            <div className="input-group">
                <FaMapMarkerAlt className="input-icon" />
                <input
                    type="text"
                    placeholder="Città (es. Roma)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <button type="submit" className="search-btn">
                Cerca
            </button>
        </form>
    );
};

export default SearchBar;
