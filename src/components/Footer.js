import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Footer.css';

const Footer = () => {
    const { t } = useTranslation();
    const [openSections, setOpenSections] = React.useState({});

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3>{t('app.title')}</h3>
                    <p>{t('footer.about_text')}</p>
                </div>
                <div className="footer-section accordion-section">
                    <h4 onClick={() => toggleSection('links')} className="accordion-header">
                        {t('footer.links')}
                        <span className={`accordion-icon ${openSections['links'] ? 'open' : ''}`}>▼</span>
                    </h4>
                    <ul className={`accordion-content ${openSections['links'] ? 'open' : ''}`}>
                        <li>{t('hero.search_button')}</li>
                        <li>FAQ</li>
                        <li>App mobile</li>
                    </ul>
                </div>
                <div className="footer-section accordion-section">
                    <h4 onClick={() => toggleSection('doctors')} className="accordion-header">
                        {t('nav.doctor')}
                        <span className={`accordion-icon ${openSections['doctors'] ? 'open' : ''}`}>▼</span>
                    </h4>
                    <ul className={`accordion-content ${openSections['doctors'] ? 'open' : ''}`}>
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
