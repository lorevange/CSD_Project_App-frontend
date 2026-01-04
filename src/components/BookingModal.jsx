import React, { useMemo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaCalendarAlt, FaClock, FaCheckCircle, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/BookingModal.css';
import { UserContext } from '../context/UserContext';
import { createAppointment } from '../api/appointments';

const holidayCache = {};

const formatIsoDate = (date) => date.toISOString().slice(0, 10);

const computeEasterMonday = (year) => {
    // Meeus/Jones/Butcher algorithm for Easter Sunday, then add one day
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    const easterSunday = new Date(Date.UTC(year, month, day));
    const easterMonday = new Date(easterSunday);
    easterMonday.setUTCDate(easterSunday.getUTCDate() + 1);
    return formatIsoDate(easterMonday);
};

const getItalianHolidays = (year) => {
    const fixed = [
        '01-01', // Capodanno
        '01-06', // Epifania
        '04-25', // Liberazione
        '05-01', // Lavoro
        '06-02', // Repubblica
        '08-15', // Ferragosto
        '11-01', // Ognissanti
        '12-08', // Immacolata
        '12-25', // Natale
        '12-26', // Santo Stefano
    ].map((d) => `${year}-${d}`);

    const easterMonday = computeEasterMonday(year);
    return new Set([...fixed, easterMonday]);
};

const isHolidayOrWeekend = (date) => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return true; // Sunday or Saturday

    const year = date.getFullYear();
    if (!holidayCache[year]) {
        holidayCache[year] = getItalianHolidays(year);
    }
    return holidayCache[year].has(formatIsoDate(date));
};

const BookingModal = ({ isOpen, onClose, doctorName, doctorId, appointments = [], services = [], onAppointmentBooked }) => {
    const { t, i18n } = useTranslation();
    const { user } = useContext(UserContext);
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generate next 7 available days (skip weekends and Italian holidays)
    const getNextDays = () => {
        const days = [];
        let offset = 1; // start from tomorrow
        while (days.length < 7 && offset < 60) {
            const date = new Date();
            date.setDate(date.getDate() + offset);
            offset += 1;

            if (isHolidayOrWeekend(date)) continue;

            days.push({
                day: date.toLocaleDateString(i18n.language, { weekday: 'short' }),
                date: date.getDate(),
                fullDate: date
            });
        }
        return days;
    };

    const bookedSlotsForSelectedDate = useMemo(() => {
        if (!selectedDate || !appointments.length) return new Set();

        const normalizeTime = (value) => {
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return null;
            const hours = `${date.getHours()}`.padStart(2, '0');
            const minutes = `${date.getMinutes()}`.padStart(2, '0');
            return `${hours}:${minutes}`;
        };

        const normalizeDay = (value) => {
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return null;
            return date.toISOString().slice(0, 10); // YYYY-MM-DD
        };

        const selectedDayKey = normalizeDay(selectedDate.fullDate);
        if (!selectedDayKey) return new Set();

        return appointments.reduce((acc, appt) => {
            const apptDay = normalizeDay(appt.startDatetime);
            if (apptDay !== selectedDayKey) return acc;
            const slot = normalizeTime(appt.startDatetime);
            if (slot) acc.add(slot);
            return acc;
        }, new Set());
    }, [appointments, selectedDate]);

    // Mock time slots (shown only after a date is selected)
    const timeSlots = selectedDate ? [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30'
    ] : [];

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleTimeSelect = (time) => {
        if (bookedSlotsForSelectedDate.has(time)) return;
        setSelectedTime(time);
    };

    const handleServiceSelect = (serviceId) => {
        setSelectedServiceId(serviceId);
    };

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTime || !selectedServiceId || !doctorId) return;

        const buildStartDateTime = () => {
            const base = new Date(selectedDate.fullDate);
            const [hours, minutes] = selectedTime.split(':').map((v) => Number(v));
            if (Number.isFinite(hours) && Number.isFinite(minutes)) {
                base.setHours(hours, minutes, 0, 0);
            }
            return base.toISOString();
        };

        const payload = {
            doctorId: Number(doctorId),
            userId: Number(user?.id),
            doctorServiceId: Number(selectedServiceId),
            startDatetime: buildStartDateTime(),
        };

        setIsSubmitting(true);
        try {
            await createAppointment(payload);
            setStep(2); // Move to success state
            onAppointmentBooked?.();
            toast.success(t('booking.success_message'));
        } catch (err) {
            console.error('Failed to create appointment', err);
            toast.error(err.message || t('booking.error', 'Unable to book appointment'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedServiceId(null);
        setStep(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="booking-modal-overlay" onClick={resetAndClose}>
            <div className="booking-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{step === 1 ? t('booking.title') : t('booking.success')}</h2>
                    <button className="close-btn" onClick={resetAndClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-content">
                    {step === 1 ? (
                        <>
                            <div className="date-selection">
                                <span className="section-label">{t('booking.select_date')}</span>
                                <div className="dates-grid">
                                    {getNextDays().map((day, index) => (
                                        <div
                                            key={index}
                                            className={`date-card ${selectedDate?.date === day.date ? 'selected' : ''}`}
                                            onClick={() => handleDateSelect(day)}
                                        >
                                            <span className="day">{day.day}</span>
                                            <span className="date">{day.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="time-selection">
                                <span className="section-label">{t('booking.select_time')}</span>
                                {selectedDate ? (
                                    <div className="times-grid">
                                        {timeSlots.map((time, index) => {
                                            const isBooked = bookedSlotsForSelectedDate.has(time);
                                            return (
                                                <div
                                                    key={index}
                                                    className={`time-slot ${selectedTime === time ? 'selected' : ''} ${isBooked ? 'disabled' : ''}`}
                                                    onClick={() => handleTimeSelect(time)}
                                                    aria-disabled={isBooked}
                                                >
                                                    {time}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="booking-note">{t('booking.select_date_first', 'Select a date to view available times')}</p>
                                )}
                            </div>

                            <div className="service-selection">
                                <span className="section-label">{t('booking.select_service', 'Select an examination')}</span>
                                {services.length > 0 ? (
                                    <div className="services-grid">
                                        {services.length > 0 ? services.map((service) => (
                                            <button
                                                key={service.id ?? service.name}
                                                type="button"
                                                className={`service-option ${selectedServiceId === service.id ? 'selected' : ''}`}
                                                onClick={() => handleServiceSelect(service.id)}
                                            >
                                                <div className="service-name">{service.name}</div>
                                                <div className="service-price">€{service.price ?? 0}</div>
                                            </button>
                                        )) :
                                        <p>{t('booking.no_services', 'No services available')}</p>}
                                    </div>
                                ) : (
                                    <p className="booking-note">{t('booking.no_services', 'No services available')}</p>
                                )}
                            </div>

                            {selectedDate && selectedTime && (
                                <div className="booking-summary">
                                    <div className="summary-item">
                                        <FaUser className="summary-icon" />
                                        <span>{doctorName}</span>
                                    </div>
                                    {selectedServiceId && (
                                        <div className="summary-item">
                                            <FaCheckCircle className="summary-icon" />
                                            <span>
                                                {services.find((s) => s.id === selectedServiceId)?.name}
                                                {services.find((s) => s.id === selectedServiceId)?.price != null
                                                    ? ` - €${services.find((s) => s.id === selectedServiceId)?.price}`
                                                    : ''}
                                            </span>
                                        </div>
                                    )}
                                    <div className="summary-item">
                                        <FaCalendarAlt className="summary-icon" />
                                        <span>{selectedDate.day} {selectedDate.date}</span>
                                    </div>
                                    <div className="summary-item">
                                        <FaClock className="summary-icon" />
                                        <span>{selectedTime}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="success-state">
                            <FaCheckCircle className="success-icon" />
                            <h3>{t('booking.success')}</h3>
                            <p>{t('booking.success_message')}</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {step === 1 ? (
                        <>
                            <button className="btn-cancel" onClick={resetAndClose}>
                                {t('common.cancel')}
                            </button>
                            <button
                                className="btn-confirm"
                                disabled={!selectedDate || !selectedTime || !selectedServiceId || isSubmitting}
                                onClick={handleConfirm}
                            >
                                {isSubmitting ? t('booking.saving', 'Saving...') : t('booking.confirm')}
                            </button>
                        </>
                    ) : (
                        <button className="btn-confirm" onClick={resetAndClose}>
                            {t('common.close')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
