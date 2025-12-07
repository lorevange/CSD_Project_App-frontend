import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar, FaMapMarkerAlt, FaStethoscope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/DoctorCard.css';

const DoctorCard = ({ doctor }) => {
    const { t, i18n } = useTranslation();
    return (
        <div className="doctor-card">
            <div className="doctor-image-container">
                <img src={doctor.image} alt={doctor.name} className="doctor-image" />
            </div>
            <div className="doctor-info">
                <h3 className="doctor-name">
                    <Link to={`/doctor/${doctor.id}`}>{doctor.name}</Link>
                </h3>
                <p className="doctor-specialization">
                    <FaStethoscope className="icon" /> {doctor.specialization[i18n.language]}
                </p>
                <p className="doctor-address">
                    <FaMapMarkerAlt className="icon" /> {doctor.address}, {doctor.city}
                </p>
                <div className="doctor-rating">
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            className={`star ${i < Math.round(doctor.rating) ? 'filled' : ''}`}
                        />
                    ))}
                    <span className="rating-text">
                        {doctor.rating} ({doctor.reviewsCount} {t('doctors.reviews')})
                    </span>
                </div>
                <div className="doctor-services">
                    {doctor.services[i18n.language].slice(0, 2).map((service, index) => (
                        <span key={index} className="service-tag">{service}</span>
                    ))}
                    {doctor.services[i18n.language].length > 2 && (
                        <span className="service-tag more">+{doctor.services[i18n.language].length - 2} altri</span>
                    )}
                </div>
            </div>
            <div className="doctor-actions">
                <div className="price-tag">Da €{doctor.price}</div>
                <Link to={`/doctor/${doctor.id}`} className="book-btn">
                    {t('doctors.book')}
                </Link>
            </div>
        </div>
    );
};

export default DoctorCard;
