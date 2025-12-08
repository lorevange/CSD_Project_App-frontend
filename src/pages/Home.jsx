import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import { specializations } from '../data/mockData';
import { FaHeartbeat, FaTooth, FaEye, FaUserMd, FaBone, FaBrain, FaBaby, FaAppleAlt, FaStethoscope } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const { t, i18n } = useTranslation();

  const getIconForSpecialization = (iconName) => {
    switch (iconName) {
      case 'heartbeat': return <FaHeartbeat />;
      case 'tooth': return <FaTooth />;
      case 'eye': return <FaEye />;
      case 'bone': return <FaBone />;
      case 'brain': return <FaBrain />;
      case 'baby': return <FaBaby />;
      case 'apple': return <FaAppleAlt />;
      case 'stethoscope': return <FaStethoscope />;
      case 'user-md': return <FaUserMd />;
      default: return <FaUserMd />;
    }
  };

  return (
    <div className="home-page">
      <Header />

      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">{t('hero.title')}</h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <div className="hero-search">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="specializations-section container">
        <h2 className="section-title">{t('specializations.title')}</h2>
        <div className="specializations-grid">
          {specializations.slice(0, 12).map((spec, index) => (
            <div key={index} className="specialization-card">
              <div className="spec-icon">{getIconForSpecialization(spec.icon)}</div>
              <h3 className="spec-name">{spec.name[i18n.language]}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <div className="container info-grid">
          <div className="info-card">
            <h3>{t('doctors.title')}</h3>
            <p>{t('footer.about_text')}</p>
          </div>
          <div className="info-card">
            <h3>{t('doctors.reviews')}</h3>
            <p>{t('hero.subtitle')}</p>
          </div>
          <div className="info-card">
            <h3>{t('doctors.book')}</h3>
            <p>{t('hero.title')}</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;