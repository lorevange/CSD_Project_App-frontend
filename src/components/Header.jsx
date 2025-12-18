import React, { useState, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserMd, FaUser, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import '../styles/Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const logoutTimerRef = useRef(null);

    const toggleMenu = () => setIsOpen(!isOpen);
    const changeLanguage = (lng) => i18n.changeLanguage(lng);
    const handleLogout = () => {
        if (isLoggingOut) {
            return;
        }
        setIsLoggingOut(true);
        setIsOpen(false);
        logoutTimerRef.current = setTimeout(() => {
            logout();
            navigate('/');
            setIsLoggingOut(false);
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current);
            }
        };
    }, []);

    return (
        <>
            <header className="header">
                <div className="container header-container">
                    <Link to="/" className="logo">
                        <FaUserMd className="logo-icon" />
                        <span>{t('app.title')}</span>
                    </Link>

                    <div className="mobile-menu-icon" onClick={toggleMenu}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </div>

                    <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
                        <ul className="nav-list">
                            <li className="nav-item">
                                <Link to="/" className="nav-link" onClick={toggleMenu}>
                                    {t('nav.home')}
                                </Link>
                            </li>

                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <Link to="/profile" className="nav-link header-user" onClick={toggleMenu}>
                                            {user.first_name} {user.last_name}
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn-logout" onClick={handleLogout} disabled={isLoggingOut}>
                                            {t('nav.logout', 'Logout')}
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link btn-login" onClick={toggleMenu}>
                                            <FaUser className="icon" /> {t('nav.login')}
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/register?type=doctor" className="nav-link btn-doctor" onClick={toggleMenu}>
                                            {t('nav.doctor')}
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li className="nav-item language-switcher">
                                <button
                                    onClick={() => changeLanguage('it')}
                                    className={`lang-btn ${i18n.language === 'it' ? 'active' : ''}`}
                                >
                                    IT
                                </button>
                                <span className="lang-separator">|</span>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                                >
                                    EN
                                </button>
                            </li>

                            <li className="nav-item theme-toggle">
                                <button onClick={toggleTheme} className="theme-btn">
                                    {theme === 'light' ? <FaMoon /> : <FaSun />}
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            {isLoggingOut && (
                <div className="logout-overlay" role="status" aria-live="polite">
                    <div className="logout-card">
                        <div className="logout-spinner" />
                        <p className="logout-message">
                            You are being logged out. Sign in again to continue booking appointments.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
