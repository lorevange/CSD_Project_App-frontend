import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserContext } from '../context/UserContext';
import { getAppointments, cancelAppointment } from '../api/appointments';
import '../styles/Appointments.css';

const Appointments = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [isDoctorLoading, setIsDoctorLoading] = useState(false);
    const [doctorError, setDoctorError] = useState(null);
    const [cancelingId, setCancelingId] = useState(null);

    const userId = user?.id;
    const isDoctor = user?.profile === 'doctor';

    const fetchPatientAppointments = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAppointments({ userId, startFrom: new Date().toISOString() });
            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load appointments', err);
            setError(err.message || t('appointments.load_error', 'Unable to load appointments'));
        } finally {
            setIsLoading(false);
        }
    }, [t, userId]);

    const fetchDoctorAppointments = useCallback(async () => {
        if (!userId || !isDoctor) return;
        setIsDoctorLoading(true);
        setDoctorError(null);
        try {
            const data = await getAppointments({ doctorId: userId, startFrom: new Date().toISOString() });
            setDoctorAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load doctor appointments', err);
            setDoctorError(err.message || t('appointments.load_error', 'Unable to load appointments'));
        } finally {
            setIsDoctorLoading(false);
        }
    }, [isDoctor, t, userId]);

    useEffect(() => {
        fetchPatientAppointments();
        fetchDoctorAppointments();
    }, [fetchDoctorAppointments, fetchPatientAppointments]);

    const handleCancel = async (id) => {
        setCancelingId(id);
        try {
            await cancelAppointment(id);
            await Promise.all([fetchPatientAppointments(), fetchDoctorAppointments()]);
        } catch (err) {
            console.error('Failed to cancel appointment', err);
            setError(err.message || t('appointments.cancel_error', 'Unable to cancel appointment'));
        } finally {
            setCancelingId(null);
        }
    };

    const sortedAppointments = useMemo(() => {
        return [...appointments].sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
    }, [appointments]);

    const sortedDoctorAppointments = useMemo(() => {
        return [...doctorAppointments].sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
    }, [doctorAppointments]);

    return (
        <div className="appointments-page">
            <Header />
            <div className="container appointments-container">
                <h1>{t('appointments.title', 'Your scheduled appointments')}</h1>

                {!user && (
                    <p>{t('appointments.login_required', 'Please log in to view your appointments.')}</p>
                )}

                {user && (
                    <div className="appointments-grid">
                        <section className="appointments-section">
                            <h2>{t('appointments.as_patient', 'Your bookings')}</h2>
                            {isLoading && <p>{t('appointments.loading', 'Loading appointments...')}</p>}
                            {error && <p className="error">{error}</p>}
                            {!isLoading && !error && sortedAppointments.length === 0 && (
                                <p>{t('appointments.none', 'No appointments found.')}</p>
                            )}
                            <div className="appointments-list">
                                {sortedAppointments.map((appt) => {
                                    const isCancelled = String(appt.status || '').toLowerCase() === 'cancelled';
                                    const doctorName = appt.doctor?.first_name || appt.doctor?.last_name
                                        ? `${appt.doctor?.first_name || ''} ${appt.doctor?.last_name || ''}`.trim()
                                        : (appt.doctor_name || `${t('appointments.doctor_id', 'Doctor')} #${appt.doctor_id}`);
                                    return (
                                        <div key={appt.id} className={`appointment-card ${isCancelled ? 'cancelled' : ''}`}>
                                            <div>
                                                <div className="appt-row">
                                                    <span className="label">{t('appointments.doctor', 'Doctor')}</span>
                                                    {appt.doctor_id ? (
                                                        <Link to={`/doctor/${appt.doctor_id}`} className="link-inline">
                                                            {doctorName}
                                                        </Link>
                                                    ) : (
                                                        <span>{doctorName}</span>
                                                    )}
                                                </div>
                                                <div className="appt-row">
                                                    <span className="label">{t('appointments.service', 'Service')}</span>
                                                    <span>{appt.examination_type || appt.service_name || t('appointments.unknown_service', 'Service')}</span>
                                                </div>
                                                <div className="appt-row">
                                                    <span className="label">{t('appointments.date', 'Date')}</span>
                                                    <span>{new Date(appt.start_datetime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                                </div>
                                                <div className="appt-row">
                                                    <span className="label">{t('appointments.status', 'Status')}</span>
                                                    <span>{appt.status == 'scheduled' ? 'Scheduled' : 'Cancelled'}</span>
                                                </div>
                                            </div>
                                            {!isCancelled && (
                                                <button
                                                    className="profile-btn ghost"
                                                    disabled={cancelingId === appt.id}
                                                    onClick={() => handleCancel(appt.id)}
                                                >
                                                    {cancelingId === appt.id ? t('appointments.canceling', 'Canceling...') : t('appointments.cancel', 'Cancel')}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {isDoctor && (
                            <section className="appointments-section">
                                <h2>{t('appointments.as_doctor', 'Booked with you')}</h2>
                                {isDoctorLoading && <p>{t('appointments.loading', 'Loading appointments...')}</p>}
                                {doctorError && <p className="error">{doctorError}</p>}
                                {!isDoctorLoading && !doctorError && sortedDoctorAppointments.length === 0 && (
                                    <p>{t('appointments.none', 'No appointments found.')}</p>
                                )}
                                <div className="appointments-list">
                                    {sortedDoctorAppointments.map((appt) => {
                                        const isCancelled = String(appt.status || '').toLowerCase() === 'cancelled';
                                        const patientName = appt.user?.first_name || appt.user?.last_name
                                            ? `${appt.user?.first_name || ''} ${appt.user?.last_name || ''}`.trim()
                                            : (appt.user_name || appt.user_id || t('appointments.unknown_patient', 'Patient'));
                                        return (
                                            <div key={appt.id} className={`appointment-card ${isCancelled ? 'cancelled' : ''}`}>
                                                <div>
                                                    <div className="appt-row">
                                                        <span className="label">{t('appointments.patient', 'Patient')}</span>
                                                        <span>{patientName}</span>
                                                    </div>
                                                    <div className="appt-row">
                                                        <span className="label">{t('appointments.service', 'Service')}</span>
                                                        <span>{appt.examination_type || appt.service_name || t('appointments.unknown_service', 'Service')}</span>
                                                    </div>
                                                    <div className="appt-row">
                                                        <span className="label">{t('appointments.date', 'Date')}</span>
                                                    <span>{new Date(appt.start_datetime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                                    </div>
                                                    <div className="appt-row">
                                                        <span className="label">{t('appointments.status', 'Status')}</span>
                                                        <span>{appt.status == 'scheduled' ? 'Scheduled' : 'Cancelled'}</span>
                                                    </div>
                                                </div>
                                                {!isCancelled && (
                                                    <button
                                                        className="profile-btn ghost"
                                                        disabled={cancelingId === appt.id}
                                                        onClick={() => handleCancel(appt.id)}
                                                    >
                                                        {cancelingId === appt.id ? t('appointments.canceling', 'Canceling...') : t('appointments.cancel', 'Cancel')}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Appointments;
