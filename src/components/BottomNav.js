import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaUser, FaUserMd } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../styles/BottomNav.css';

const BottomNav = () => {
    const { t } = useTranslation();

    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
                <FaHome className="nav-icon" />
                <span className="nav-label">{t('nav.home')}</span>
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <FaSearch className="nav-icon" />
                <span className="nav-label">{t('hero.search_button')}</span>
            </NavLink>
            <NavLink to="/register?type=doctor" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <FaUserMd className="nav-icon" />
                <span className="nav-label">{t('nav.doctor')}</span>
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <FaUser className="nav-icon" />
                <span className="nav-label">{t('nav.login')}</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
