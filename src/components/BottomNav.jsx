import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaUser, FaUserMd } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/UserContext';
import '../styles/BottomNav.css';

const BottomNav = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <nav className="bottom-nav">
            <NavLink
                to="/"
                className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                end
                onClick={scrollToTop}
            >
                <FaHome className="nav-icon" />
                <span className="nav-label">{t('nav.home')}</span>
            </NavLink>
            <NavLink
                to="/search"
                className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                onClick={scrollToTop}
            >
                <FaSearch className="nav-icon" />
                <span className="nav-label">{t('hero.search_button')}</span>
            </NavLink>
            <NavLink
                to="/register?type=doctor"
                className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                onClick={scrollToTop}
            >
                <FaUserMd className="nav-icon" />
                <span className="nav-label">{t('nav.doctor')}</span>
            </NavLink>
            {user ? (
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                    onClick={scrollToTop}
                >
                    <FaUser className="nav-icon" />
                    <span className="nav-label">{t('nav.profile', 'Profile')}</span>
                </NavLink>
            ) : (
                <NavLink
                    to="/login"
                    className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                    onClick={scrollToTop}
                >
                    <FaUser className="nav-icon" />
                    <span className="nav-label">{t('nav.login')}</span>
                </NavLink>
            )}
        </nav>
    );
};

export default BottomNav;
