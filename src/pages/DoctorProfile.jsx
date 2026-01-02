import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import ReviewsList from '../components/ReviewsList';
import { FaStar, FaMapMarkerAlt, FaStethoscope, FaCheckCircle } from 'react-icons/fa';
import '../styles/DoctorProfile.css';
import Map from '../components/Map';
import { getDoctorById } from '../api/doctors';
import { getAppointments } from '../api/appointments';
import { normalizePhotoToDataUrl } from '../utils/photo';

const DoctorProfile = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const [doctor, setDoctor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [appointmentsError, setAppointmentsError] = useState(null);
    const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(false);

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

        return {
            id: data.id ?? id,
            name: data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || t('doctor_profile.unknown_name', 'Doctor'),
            specialization,
            city: data.city || '',
            address: data.address || '',
            latitude: hasLatitude ? toNumberOr(data.latitude, null) : null,
            longitude: hasLongitude ? toNumberOr(data.longitude, null) : null,
            rating: data.rating != null ? toNumberOr(data.rating, 0) : 0,
            reviewsCount: data.reviewsCount ?? data.reviews_count ?? 0,
            image: resolvedPhoto,
            services: localizedServices,
            serviceOptions,
            bio,
            price: data.price != null ? toNumberOr(data.price, 0) : 0,
            reviews: data.reviews || [],
        };
    }, [id, t]);

    useEffect(() => {
        const fetchDoctor = async () => {
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
        };

        fetchDoctor();
    }, [id, adaptDoctorData, t]);

    const fetchAppointments = useCallback(async () => {
        setIsAppointmentsLoading(true);
        setAppointmentsError(null);
        try {
            const data = await getAppointments({ doctorId: id, status: 'scheduled' });
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

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const doctorAppointments = useMemo(() => {
        const docId = Number(doctor?.id);
        if (!Number.isFinite(docId)) return [];
        return appointments.filter((appt) => Number(appt.doctorId) === docId);
    }, [appointments, doctor]);

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
                            <div className="map-placeholder" style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                                {hasValidCoords ? (
                                    <Map center={{ lat: doctor.latitude, lng: doctor.longitude }} markers={[{ lat: doctor.latitude, lng: doctor.longitude }]} />
                                ) : (
                                    <div>{t('doctor_profile.map_placeholder')}</div>
                                )}
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
                services={doctor.serviceOptions}
                onAppointmentBooked={fetchAppointments}
            />

            <Footer />
        </div>
    );
};

export default DoctorProfile;
