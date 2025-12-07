import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUserMd, FaUser, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import '../styles/Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    const toggleMenu = () => setIsOpen(!isOpen);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
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
                            <Link to="/" className="nav-link" onClick={toggleMenu}>{t('nav.home')}</Link>
                        </li>
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
                        <li className="nav-item language-switcher">
                            <button onClick={() => changeLanguage('it')} className={`lang-btn ${i18n.language === 'it' ? 'active' : ''}`}>IT</button>
                            <span className="lang-separator">|</span>
                            <button onClick={() => changeLanguage('en')} className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}>EN</button>
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
    );
};

export default Header;
