import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { doctors } from '../data/mockData';
import { FaStar, FaMapMarkerAlt, FaStethoscope, FaCheckCircle } from 'react-icons/fa';
import '../styles/DoctorProfile.css';

const DoctorProfile = () => {
    const { id } = useParams();
    const doctor = doctors.find(d => d.id === parseInt(id));

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!doctor) {
        return <div>Dottore non trovato</div>;
    }

    return (
        <div className="profile-page">
            <Header />

            <div className="container profile-container">
                <div className="profile-header">
                    <div className="profile-image-wrapper">
                        <img src={doctor.image} alt={doctor.name} className="profile-image" />
                    </div>
                    <div className="profile-main-info">
                        <h1 className="profile-name">{doctor.name}</h1>
                        <p className="profile-specialization">
                            <FaStethoscope className="icon" /> {doctor.specialization}
                        </p>
                        <div className="profile-rating">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`star ${i < Math.round(doctor.rating) ? 'filled' : ''}`}
                                />
                            ))}
                            <span className="rating-count">{doctor.reviewsCount} recensioni</span>
                        </div>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-left">
                        <section className="profile-section">
                            <h2>Informazioni</h2>
                            <p className="profile-bio">{doctor.bio}</p>
                        </section>

                        <section className="profile-section">
                            <h2>Servizi offerti</h2>
                            <ul className="services-list">
                                {doctor.services.map((service, index) => (
                                    <li key={index} className="service-item">
                                        <FaCheckCircle className="check-icon" /> {service}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="profile-section">
                            <h2>Indirizzo</h2>
                            <p className="profile-address">
                                <FaMapMarkerAlt className="icon" /> {doctor.address}, {doctor.city}
                            </p>
                            {/* Placeholder for map */}
                            <div className="map-placeholder">Mappa non disponibile</div>
                        </section>
                    </div>

                    <div className="profile-right">
                        <div className="booking-card">
                            <h3>Prenota una visita</h3>
                            <div className="price-info">
                                <span>Prima visita</span>
                                <span className="price">€{doctor.price}</span>
                            </div>
                            <button className="book-btn-lg" onClick={() => setIsModalOpen(true)}>Prenota Ora</button>
                            <p className="booking-note">Nessun pagamento anticipato richiesto</p>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                doctorName={doctor.name}
            />

            <Footer />
        </div>
    );
};

export default DoctorProfile;
