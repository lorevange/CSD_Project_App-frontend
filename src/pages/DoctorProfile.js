import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import ReviewsList from '../components/ReviewsList';
import { doctors } from '../data/mockData';
import { FaStar, FaMapMarkerAlt, FaStethoscope, FaCheckCircle } from 'react-icons/fa';
import '../styles/DoctorProfile.css';
import Map from '../components/Map';

const DoctorProfile = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const doctor = doctors.find(d => d.id === parseInt(id));

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!doctor) {
        return <div>{t('doctor_profile.not_found')}</div>;
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
                            <FaStethoscope className="icon" /> {doctor.specialization[i18n.language]}
                        </p>
                        <div className="profile-rating">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`star ${i < Math.round(doctor.rating) ? 'filled' : ''}`}
                                />
                            ))}
                            <span className="rating-count">{doctor.reviewsCount} {t('doctors.reviews')}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-left">
                        <section className="profile-section">
                            <h2>{t('doctor_profile.info')}</h2>
                            <p className="profile-bio">{doctor.bio[i18n.language]}</p>
                        </section>

                        <section className="profile-section">
                            <h2>{t('doctor_profile.services')}</h2>
                            <ul className="services-list">
                                {doctor.services[i18n.language].map((service, index) => (
                                    <li key={index} className="service-item">
                                        <FaCheckCircle className="check-icon" /> {service}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="profile-section">
                            <h2>{t('doctor_profile.address')}</h2>
                            <p className="profile-address">
                                <FaMapMarkerAlt className="icon" /> {doctor.address}, {doctor.city}
                            </p>
                            {/* Placeholder for map */}
                            <div className="map-wrapper">
                                <Map address={doctor.address} city={doctor.city} />
                            </div>
                        </section>

                        <ReviewsList
                            reviews={doctor.reviews}
                            averageRating={doctor.rating}
                            totalReviews={doctor.reviewsCount}
                        />
                    </div>

                    <div className="profile-right">
                        <div className="booking-card">
                            <h3>{t('booking.title')}</h3>
                            <div className="price-info">
                                <span>{t('doctor_profile.first_visit')}</span>
                                <span className="price">€{doctor.price}</span>
                            </div>
                            <button className="book-btn-lg" onClick={() => setIsModalOpen(true)}>{t('booking.book_now')}</button>
                            <p className="booking-note">{t('booking.no_prepayment')}</p>
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
