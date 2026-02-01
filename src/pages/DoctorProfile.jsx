import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import ReviewsList from '../components/ReviewsList';
import { FaStar, FaStarHalfAlt, FaMapMarkerAlt, FaStethoscope, FaCheckCircle } from 'react-icons/fa';
import '../styles/DoctorProfile.css';
import Map from '../components/Map';
import { getDoctorById } from '../api/doctors';
import { getAppointments } from '../api/appointments';
import { createReview, getReviewSummary, listReviewsForDoctor } from '../api/reviews';
import { normalizePhotoToDataUrl } from '../utils/photo';
import { UserContext } from '../context/UserContext';

const DoctorProfile = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const { user } = useContext(UserContext);
    const [doctor, setDoctor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [appointmentsError, setAppointmentsError] = useState(null);
    const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState(null);
    const [reviewSummaryByLanguage, setReviewSummaryByLanguage] = useState({ en: '', it: '' });
    const [summaryWordCount, setSummaryWordCount] = useState(0);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [reviewSummaryError, setReviewSummaryError] = useState(null);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewFormError, setReviewFormError] = useState(null);
    const reviewsSectionRef = useRef(null);

    const adaptDoctorData = useCallback((data = {}) => {
        const buildLocalizedText = (value, fallbackIt = '', fallbackEn = '') => {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                return {
                    it: value.it || value.en || fallbackIt || fallbackEn,
                    en: value.en || value.it || fallbackEn || fallbackIt,
                };
            }

            return {
                it: value || fallbackIt || fallbackEn,
                en: value || fallbackEn || fallbackIt,
            };
        };

        const normalizeServiceList = (list) => {
            if (!Array.isArray(list)) return [];
            return list.map((item) => {
                if (item && typeof item === 'object') {
                    return String(item.name ?? item.label ?? item.title ?? '');
                }
                return String(item ?? '');
            }).filter(Boolean);
        };

        const normalizeServiceOptions = (list) => {
            if (!Array.isArray(list)) return [];
            return list.map((item) => ({
                name: item?.name ?? item?.label ?? item?.title ?? String(item ?? ''),
                price: Number.isFinite(Number(item?.price)) ? Number(item.price) : 0,
                id: item?.id,
                doctorId: item?.doctor_id,
                isActive: item?.is_active,
            })).filter((opt) => Boolean(opt.name));
        };

        const servicesFromApi = data?.services;
        let localizedServices;
        let serviceOptions = [];
        if (Array.isArray(servicesFromApi)) {
            const normalized = normalizeServiceList(servicesFromApi);
            serviceOptions = normalizeServiceOptions(servicesFromApi);
            localizedServices = { it: normalized, en: normalized };
        } else if (servicesFromApi && typeof servicesFromApi === 'object') {
            const source = servicesFromApi.it || servicesFromApi.en || servicesFromApi;
            const itServices = normalizeServiceList(source);
            const enServices = normalizeServiceList(servicesFromApi.en || servicesFromApi.it || servicesFromApi);
            serviceOptions = normalizeServiceOptions(source);
            localizedServices = {
                it: itServices,
                en: enServices,
            };
        } else {
            localizedServices = { it: [], en: [] };
            serviceOptions = [];
        }

        const specialization = buildLocalizedText(
            data?.specialization,
            t('doctor_profile.specialization_placeholder', 'Specializzazione'),
            t('doctor_profile.specialization_placeholder', 'Specialization')
        );

        const bio = buildLocalizedText(data?.bio);

        const toNumberOr = (value, fallback) => {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : fallback;
        };

        const hasLatitude = data.latitude !== undefined && data.latitude !== null;
        const hasLongitude = data.longitude !== undefined && data.longitude !== null;
        const resolvedPhoto = normalizePhotoToDataUrl(data?.photo, 'image/png') || data?.image || data?.photo_url || data?.avatar || 'https://via.placeholder.com/150';
        const ratingValue = data.average_rating ?? data.avg_rating ?? data.rating;
        const reviewsTotal = data.reviewsCount ?? data.reviews_count ?? data.ratings_count ?? (Array.isArray(data.reviews) ? data.reviews.length : undefined);

        return {
            id: data.id ?? id,
            name: data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || t('doctor_profile.unknown_name', 'Doctor'),
            specialization,
            city: data.city || '',
            address: data.address || '',
            latitude: hasLatitude ? toNumberOr(data.latitude, null) : null,
            longitude: hasLongitude ? toNumberOr(data.longitude, null) : null,
            rating: ratingValue != null ? toNumberOr(ratingValue, 0) : 0,
            reviewsCount: reviewsTotal != null ? toNumberOr(reviewsTotal, 0) : 0,
            image: resolvedPhoto,
            services: localizedServices,
            serviceOptions,
            bio,
            information: data.information || '',
            price: data.price != null ? toNumberOr(data.price, 0) : 0,
            reviews: Array.isArray(data.reviews) ? data.reviews : [],
        };
    }, [id, t]);

    const normalizeReview = useCallback((review) => {
        const ratingValue = Number(review?.rating);
        const clampedRating = Number.isFinite(ratingValue)
            ? Math.min(5, Math.max(0, ratingValue))
            : 0;

        const author = review?.author || review?.user || {};
        const authorName = [`${author.first_name || ''}`.trim(), `${author.last_name || ''}`.trim()]
            .filter(Boolean)
            .join(' ')
            || author.name
            || author.username
            || review?.author_name
            || t('reviews.anonymous', 'Anonymous');
        const dateValue = review?.created_at || review?.createdAt || review?.date;
        const dateObj = dateValue ? new Date(dateValue) : null;
        const formattedDate = dateObj && !Number.isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString() : '';
        const photo = normalizePhotoToDataUrl(author?.photo, 'image/png');

        return {
            id: review?.id ?? review?.review_id ?? `${authorName || 'review'}-${dateValue || Math.random()}`,
            rating: clampedRating,
            comment: review?.comment || '',
            date: formattedDate,
            user: authorName,
            photo,
        };
    }, [t]);

    const fetchDoctor = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getDoctorById(id);
            setDoctor(adaptDoctorData(data));
        } catch (err) {
            console.error('Error fetching doctor profile:', err);
            setError(err.message || t('doctor_profile.load_error', 'Unable to load doctor details'));
        } finally {
            setIsLoading(false);
        }
    }, [adaptDoctorData, id, t]);

    const fetchAppointments = useCallback(async () => {
        setIsAppointmentsLoading(true);
        setAppointmentsError(null);
        try {
            const data = await getAppointments({ doctorId: id, status: 'scheduled', startFrom: new Date().toISOString() });
            const normalized = Array.isArray(data) ? data.map((appt) => ({
                id: appt.id,
                doctorId: appt.doctor_id,
                userId: appt.user_id,
                startDatetime: appt.start_datetime,
                endDatetime: appt.end_datetime,
                examinationType: appt.examination_type,
                notes: appt.notes,
                status: appt.status,
            })) : [];
            setAppointments(normalized);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setAppointmentsError(err.message || t('appointments.load_error', 'Unable to load appointments'));
        } finally {
            setIsAppointmentsLoading(false);
        }
    }, [id, t]);

    const fetchReviews = useCallback(async () => {
        setIsReviewsLoading(true);
        setReviewsError(null);
        try {
            const data = await listReviewsForDoctor(id);
            const normalized = Array.isArray(data) ? data.map((rev) => normalizeReview(rev)) : [];
            setReviews(normalized);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setReviewsError(err.message || t('reviews.load_error', 'Unable to load reviews'));
        } finally {
            setIsReviewsLoading(false);
        }
    }, [id, normalizeReview, t]);

    const parseBilingualSummary = useCallback((rawSummary) => {
        if (typeof rawSummary !== 'string') return { en: '', it: '' };

        const text = rawSummary.trim();
        if (!text) return { en: '', it: '' };

        const enMatch = text.match(/EN:\s*([\s\S]*?)(?:\s+IT:|$)/i);
        const itMatch = text.match(/IT:\s*([\s\S]*)/i);
        const en = enMatch ? enMatch[1].trim() : '';
        const it = itMatch ? itMatch[1].trim() : '';

        if (!en && !it) {
            return { en: text, it: text };
        }

        return {
            en: en || it,
            it: it || en,
        };
    }, []);

    const fetchReviewSummary = useCallback(async () => {
        setIsSummaryLoading(true);
        setReviewSummaryError(null);
        try {
            const data = await getReviewSummary(id);
            const summaryText = typeof data?.summary === 'string' ? data.summary : '';
            setReviewSummaryByLanguage(parseBilingualSummary(summaryText));
            setSummaryWordCount(Number.isFinite(Number(data?.word_count)) ? Number(data.word_count) : 0);
        } catch (err) {
            console.error('Error fetching review summary:', err);
            setReviewSummaryError(err.message || t('reviews.summary_error', 'Unable to load review summary'));
        } finally {
            setIsSummaryLoading(false);
        }
    }, [id, parseBilingualSummary, t]);

    useEffect(() => {
        let isActive = true;
        const loadSequentially = async () => {
            await fetchDoctor();
            if (!isActive) return;
            await fetchAppointments();
            if (!isActive) return;
            await fetchReviews();
            if (!isActive) return;
            await fetchReviewSummary();
        };

        loadSequentially();
        return () => {
            isActive = false;
        };
    }, [id]);

    const activeReviewSummary = useMemo(() => {
        const preferred = reviewSummaryByLanguage[i18n.language];
        if (preferred) return preferred;
        return reviewSummaryByLanguage.en || reviewSummaryByLanguage.it || '';
    }, [i18n.language, reviewSummaryByLanguage]);

    const doctorAppointments = useMemo(() => {
        const docId = Number(doctor?.id);
        if (!Number.isFinite(docId)) return [];
        return appointments.filter((appt) => Number(appt.doctorId) === docId);
    }, [appointments, doctor]);

    const averageRating = useMemo(() => {
        if (reviews.length > 0) {
            const total = reviews.reduce((sum, rev) => sum + (Number.isFinite(rev.rating) ? rev.rating : 0), 0);
            return total / reviews.length;
        }
        if (Number.isFinite(doctor?.rating)) return doctor.rating;
        return 0;
    }, [doctor, reviews]);

    const totalReviews = useMemo(() => {
        if (reviews.length > 0) return reviews.length;
        const fromDoctor = doctor?.reviewsCount ?? doctor?.reviews_count ?? doctor?.ratings_count;
        if (Number.isFinite(Number(fromDoctor))) return Number(fromDoctor);
        return 0;
    }, [doctor, reviews]);

    const handleSubmitReview = async (event) => {
        event.preventDefault();
        if (!user) {
            setReviewFormError(t('reviews.auth_required', 'Please sign in to leave a review'));
            return;
        }
        if (!doctor?.id) return;

        const clampedRating = Math.min(5, Math.max(0, Number(newRating) || 0));
        const trimmedComment = newComment.trim();
        if (!trimmedComment) {
            setReviewFormError(t('reviews.comment_required', 'Please add a comment'));
            return;
        }

        setIsSubmittingReview(true);
        setReviewFormError(null);
        try {
            await createReview(doctor.id, {
                rating: clampedRating,
                comment: trimmedComment,
            });
            setNewRating(0);
            setNewComment('');
            fetchReviews();
            fetchReviewSummary();
        } catch (err) {
            console.error('Error submitting review:', err);
            setReviewFormError(err.message || t('reviews.submit_error', 'Unable to submit review'));
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (isLoading) {
        return (
            <div className="profile-page">
                <Header />
                <div className="container profile-container">
                    <p>{t('doctor_profile.loading', 'Loading doctor...')}</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="profile-page">
                <Header />
                <div className="container profile-container">
                    <p>{error || t('doctor_profile.not_found')}</p>
                </div>
                <Footer />
            </div>
        );
    }

    const hasValidCoords = Number.isFinite(doctor.latitude) && Number.isFinite(doctor.longitude);

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
                            {[...Array(5)].map((_, i) => {
                                const delta = (averageRating || 0) - i;
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
                            <span
                                className="rating-count"
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    const el = reviewsSectionRef.current;
                                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        const el = reviewsSectionRef.current;
                                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                            >
                                {totalReviews} {t('doctors.reviews')}
                            </span>
                        </div>
                        <div className="review-summary">
                            <h3 className="review-summary-title">
                                {t('reviews.summary_title', 'Review summary')}
                            </h3>
                            {isSummaryLoading && (
                                <p className="review-summary-meta">
                                    {t('reviews.summary_loading', 'Generating summary...')}
                                </p>
                            )}
                            {!isSummaryLoading && reviewSummaryError && (
                                <p className="review-summary-error">{reviewSummaryError}</p>
                            )}
                            {!isSummaryLoading && !reviewSummaryError && activeReviewSummary && (
                                <p className="review-summary-text">{activeReviewSummary}</p>
                            )}
                            {!isSummaryLoading && !reviewSummaryError && !activeReviewSummary && (
                                <p className="review-summary-meta">
                                    {t('reviews.summary_empty', 'No reviews summary available yet.')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-left">
                        <section className="profile-section">
                            <h2>{t('doctor_profile.info')}</h2>
                            <p className="profile-bio">{doctor.information || doctor.bio[i18n.language]}</p>
                        </section>

                        <section className="profile-section">
                            <h2>{t('doctor_profile.services')}</h2>
                            <ul className="services-list">
                                {(doctor.serviceOptions && doctor.serviceOptions.length > 0
                                    ? doctor.serviceOptions.map((service, index) => (
                                        <li key={service.id ?? index} className="service-item">
                                            <FaCheckCircle className="check-icon" /> {service.name}
                                            {service.price != null && (
                                                <span className="service-price" style={{ marginLeft: '8px' }}>€{service.price}</span>
                                            )}
                                        </li>
                                    ))
                                    : doctor.services[i18n.language].map((service, index) => (
                                        <li key={index} className="service-item">
                                            <FaCheckCircle className="check-icon" /> {service}
                                        </li>
                                    )))}
                            </ul>
                        </section>

                        <section className="profile-section">
                            <h2>{t('doctor_profile.address')}</h2>
                            <p className="profile-address">
                                <FaMapMarkerAlt className="icon" /> {doctor.address}, {doctor.city}
                            </p>
                            <div className="map-placeholder" style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                                {hasValidCoords ? (
                                    <Map center={{ lat: doctor.latitude, lng: doctor.longitude }} markers={[{ lat: doctor.latitude, lng: doctor.longitude }]} />
                                ) : (
                                    <div>{t('doctor_profile.map_placeholder')}</div>
                                )}
                            </div>
                        </section>

                        <section className="profile-section">
                            <h2>{t('reviews.leave_review', 'Leave a review')}</h2>
                            {!user && (
                                <p className="review-auth-hint">
                                    {t('reviews.auth_required', 'Please sign in to leave a review')}
                                </p>
                            )}
                            <form className="review-form" onSubmit={handleSubmitReview}>
                                <label className="review-label">{t('reviews.your_rating', 'Your rating')}</label>
                                <div className="review-stars-input">
                                    {[...Array(5)].map((_, i) => {
                                        const value = i + 1;
                                        return (
                                            <button
                                                type="button"
                                                key={value}
                                                className={`star-input ${value <= newRating ? 'filled' : ''}`}
                                                onClick={() => {
                                                    setNewRating(value);
                                                    setReviewFormError(null);
                                                }}
                                                aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                                            >
                                                <FaStar />
                                            </button>
                                        );
                                    })}
                                </div>

                                <label className="review-label" htmlFor="review-comment">
                                    {t('reviews.your_comment', 'Your comment')}
                                </label>
                                <textarea
                                    id="review-comment"
                                    value={newComment}
                                    onChange={(e) => {
                                        setNewComment(e.target.value.slice(0, 1000));
                                        setReviewFormError(null);
                                    }}
                                    placeholder={t('reviews.comment_placeholder', 'Share your experience...')}
                                    maxLength={1000}
                                    rows={4}
                                    disabled={!user}
                                />

                                {reviewFormError && <p className="review-error">{reviewFormError}</p>}

                                <button
                                    type="submit"
                                    className="book-btn-lg"
                                    disabled={isSubmittingReview || !user}
                                >
                                    {isSubmittingReview
                                        ? t('reviews.submitting', 'Submitting...')
                                        : t('reviews.submit', 'Post review')}
                                </button>
                            </form>
                        </section>

                        <div ref={reviewsSectionRef}>
                            <ReviewsList
                                reviews={reviews}
                                averageRating={averageRating}
                                totalReviews={totalReviews}
                                isLoading={isReviewsLoading}
                                error={reviewsError}
                            />
                        </div>
                    </div>

                    <div className="profile-right">
                        <div className="booking-card">
                            <h3>{t('booking.title')}</h3>
                            <button className="book-btn-lg" onClick={() => setIsModalOpen(true)}>{t('booking.book_now')}</button>
                            <p className="booking-note">{t('booking.no_prepayment')}</p>
                            {isAppointmentsLoading && (
                                <p className="booking-note">{t('booking.checking_availability', 'Checking availability...')}</p>
                            )}
                            {appointmentsError && (
                                <p className="booking-note">{appointmentsError}</p>
                            )}
                            {!isAppointmentsLoading && !appointmentsError && (
                                <p className="booking-note">
                                    {t('booking.existing_appointments', { count: doctorAppointments.length, defaultValue: `${doctorAppointments.length} existing appointments` })}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                doctorName={doctor.name}
                doctorId={doctor.id}
                appointments={doctorAppointments}
                services={doctor.serviceOptions.filter((svc) => svc.isActive)}
                onAppointmentBooked={fetchAppointments}
            />

            <Footer />
        </div>
    );
};

export default DoctorProfile;
