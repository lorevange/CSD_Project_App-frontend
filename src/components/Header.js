import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUserMd, FaUser } from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="header">
            <div className="container header-container">
                <Link to="/" className="logo">
                    <FaUserMd className="logo-icon" />
                    <span>MioDottoreClone</span>
                </Link>

                <div className="mobile-menu-icon" onClick={toggleMenu}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </div>

                <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/" className="nav-link" onClick={toggleMenu}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/login" className="nav-link btn-login" onClick={toggleMenu}>
                                <FaUser className="icon" /> Accedi / Registrati
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register?type=doctor" className="nav-link btn-doctor" onClick={toggleMenu}>
                                Sei un dottore?
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
