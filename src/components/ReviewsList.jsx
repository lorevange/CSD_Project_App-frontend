import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa';
import '../styles/ReviewsList.css';

const ReviewsList = ({ reviews, averageRating, totalReviews }) => {
    const { t } = useTranslation();

    return (
        <section className="reviews-section">
            <h2>{t('reviews.title')}</h2>

            <div className="reviews-summary">
                <div className="average-rating">{averageRating}</div>
                <div className="summary-stars">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={i < Math.round(averageRating) ? 'filled' : 'empty'}
                                style={{ color: i < Math.round(averageRating) ? 'var(--star-filled)' : 'var(--star-empty)' }}
                            />
                        ))}
                    </div>
                    <span className="total-reviews">{totalReviews} {t('doctors.reviews')}</span>
                </div>
            </div>

            <div className="reviews-list">
                {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <span className="review-user">{review.user}</span>
                                <span className="review-date">{review.date}</span>
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
