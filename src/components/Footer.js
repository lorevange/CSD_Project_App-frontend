import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Footer.css';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3>{t('app.title')}</h3>
                    <p>{t('footer.about_text')}</p>
                </div>
                <div className="footer-section">
                    <h4>{t('footer.links')}</h4>
                    <ul>
                        <li>{t('hero.search_button')}</li>
                        <li>FAQ</li>
                        <li>App mobile</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>{t('nav.doctor')}</h4>
                    <ul>
                        <li>{t('nav.login')}</li>
                        <li>{t('doctors.price')}</li>
                        <li>{t('footer.contact')}</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} {t('app.title')}. {t('footer.rights')}</p>
            </div>
        </footer>
    );
};

export default Footer;
