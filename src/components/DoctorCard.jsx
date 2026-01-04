import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar, FaStarHalfAlt, FaMapMarkerAlt, FaStethoscope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/DoctorCard.css';

const DoctorCard = ({ doctor, isHighlighted }) => {
    const { t, i18n } = useTranslation();
    const cardRef = useRef(null);

    useEffect(() => {
        if (isHighlighted && cardRef.current) {
            cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isHighlighted]);

    const minServicePrice = (() => {
        if (!Array.isArray(doctor.services)) return null;
        const prices = doctor.services
            .filter((s) => s.is_active)
            .map((s) => Number(s.price))
            .filter((p) => Number.isFinite(p));
        if (!prices.length) return null;
        return Math.min(...prices);
    })();

    const displayedPrice = minServicePrice != null ? minServicePrice : doctor.price;
    const normalizedRating = (() => {
        const value = Number(doctor.rating);
        if (!Number.isFinite(value)) return 0;
        return Math.min(5, Math.max(0, value));
    })();
    const filledStars = Math.floor(normalizedRating);
    const normalizedReviewsCount = Number.isFinite(Number(doctor.reviewsCount))
        ? Number(doctor.reviewsCount)
        : 0;

    return (
        <div className={`doctor-card ${isHighlighted ? 'highlighted' : ''}`} ref={cardRef}>
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
                    {[...Array(5)].map((_, i) => {
                        const delta = normalizedRating - i;
                        const isFull = delta >= 1;
                        const isHalf = !isFull && delta >= 0.5;
                        const Icon = isHalf ? FaStarHalfAlt : FaStar;
                        return (
                            <Icon
                                key={i}
                                className={`star ${isFull ? 'filled' : ''} ${isHalf ? 'half' : ''}`}
                                style={{ color: (isFull || isHalf) ? 'var(--star-filled)' : 'var(--star-empty)' }}
                            />
                        );
                    })}
                    <span className="rating-text">
                        {normalizedRating.toFixed(1)} ({normalizedReviewsCount} {t('doctors.reviews')})
                    </span>
                </div>
            </div>
            <div className="doctor-actions">
                {displayedPrice ? (
                    <div className="price-tag">Da €{displayedPrice}</div>
                ) : (
                    <div className="price-tag">{t('doctors.price_unavailable', 'Price unavailable')}</div>
                )}
                <Link to={`/doctor/${doctor.id}`} className="book-btn">
                    {t('doctors.book')}
                </Link>
            </div>
        </div>
    );
};

export default DoctorCard;
