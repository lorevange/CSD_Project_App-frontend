import '../styles/Footer.css';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="footer-simple">
            <p className="footer-text">&copy; {new Date().getFullYear()} {t('app.title')}. {t('footer.rights')}</p>
        </footer>
    );
};

export default Footer;
