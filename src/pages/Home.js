import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import { specializations } from '../data/mockData';
import { FaHeartbeat, FaTooth, FaEye, FaUserMd } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const getIconForSpecialization = (spec) => {
    switch (spec) {
      case 'Cardiologo': return <FaHeartbeat />;
      case 'Dentista': return <FaTooth />;
      case 'Oculista': return <FaEye />;
      default: return <FaUserMd />;
    }
  };

  return (
    <div className="home-page">
      <Header />

      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Trova il tuo specialista e prenota una visita</h1>
          <p className="hero-subtitle">Oltre 2 milioni di pazienti trovano il loro dottore ogni mese</p>
          <div className="hero-search">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="specializations-section container">
        <h2 className="section-title">Le specializzazioni più cercate</h2>
        <div className="specializations-grid">
          {specializations.slice(0, 8).map((spec, index) => (
            <div key={index} className="specialization-card">
              <div className="spec-icon">{getIconForSpecialization(spec)}</div>
              <h3 className="spec-name">{spec}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="info-section">
        <div className="container info-grid">
          <div className="info-card">
            <h3>Cerca dottori</h3>
            <p>Trova lo specialista più adatto alle tue esigenze tra migliaia di profili verificati.</p>
          </div>
          <div className="info-card">
            <h3>Leggi le recensioni</h3>
            <p>Scegli basandoti sulle esperienze reali di altri pazienti.</p>
          </div>
          <div className="info-card">
            <h3>Prenota online</h3>
            <p>Prenota la tua visita in pochi click, 24 ore su 24, 7 giorni su 7.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;