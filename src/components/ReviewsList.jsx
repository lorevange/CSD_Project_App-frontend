import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import '../styles/ReviewsList.css';

const ReviewsList = ({ reviews, averageRating, totalReviews, isLoading = false, error = null }) => {
    const { t } = useTranslation();
    const safeAverage = Number.isFinite(Number(averageRating)) ? Number(averageRating) : 0;
    const clampedAverage = Math.min(5, Math.max(0, safeAverage));
    const safeTotalReviews = Number.isFinite(Number(totalReviews))
        ? Number(totalReviews)
        : (Array.isArray(reviews) ? reviews.length : 0);
    const shouldShowError = error && (!reviews || reviews.length === 0);

    return (
        <section className="reviews-section">
            <h2>{t('reviews.title')}</h2>

            <div className="reviews-summary">
                <div className="average-rating">{clampedAverage.toFixed(1)}</div>
                <div className="summary-stars">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => {
                            const delta = clampedAverage - i;
                            const isFull = delta >= 1;
                            const isHalf = !isFull && delta >= 0.5;
                            const Icon = isHalf ? FaStarHalfAlt : FaStar;
                            return (
                                <Icon
                                    key={i}
                                    className={`${isFull ? 'filled' : ''} ${isHalf ? 'half' : ''}`}
                                    style={{ color: (isFull || isHalf) ? 'var(--star-filled)' : 'var(--star-empty)' }}
                                />
                            );
                        })}
                    </div>
                    <span className="total-reviews">{safeTotalReviews} {t('doctors.reviews')}</span>
                </div>
            </div>

            <div className="reviews-list">
                {isLoading ? (
                    <div className="no-reviews">{t('reviews.loading', 'Loading reviews...')}</div>
                ) : shouldShowError ? (
                    <div className="no-reviews">{error}</div>
                ) : reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="review-user-info">
                                    {review.photo ? (
                                        <img src={review.photo} alt={review.user} className="review-avatar" />
                                    ) : (
                                        <div className="review-avatar placeholder">{(review.user || '?').charAt(0)}</div>
                                    )}
                                    <div>
                                        <span className="review-user">{review.user}</span>
                                        <span className="review-date">{review.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        style={{ color: i < review.rating ? 'var(--star-filled)' : 'var(--star-empty)' }}
                                    />
                                ))}
                            </div>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-reviews">{t('reviews.no_reviews')}</div>
                )}
            </div>
        </section>
    );
};

export default ReviewsList;
