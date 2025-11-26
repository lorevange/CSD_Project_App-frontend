import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3>MioDottoreClone</h3>
                    <p>La piattaforma leader per le prenotazioni sanitarie.</p>
                </div>
                <div className="footer-section">
                    <h4>Per i pazienti</h4>
                    <ul>
                        <li>Cerca dottori</li>
                        <li>Domande frequenti</li>
                        <li>App mobile</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Per i dottori</h4>
                    <ul>
                        <li>Registrati</li>
                        <li>Prezzi</li>
                        <li>Risorse</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} MioDottoreClone. Tutti i diritti riservati.</p>
            </div>
        </footer>
    );
};

export default Footer;
