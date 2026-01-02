import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaCalendarAlt, FaClock, FaCheckCircle, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/BookingModal.css';

const BookingModal = ({ isOpen, onClose, doctorName, appointments = [] }) => {
    const { t, i18n } = useTranslation();
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Generate next 7 days
    const getNextDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i + 1); // Start from tomorrow
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

    const handleConfirm = () => {
        setStep(2); // Move to success state
        toast.success(t('booking.success_message'));
    };

    const resetAndClose = () => {
        setStep(1);
        setSelectedDate(null);
        setSelectedTime(null);
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

                            {selectedDate && selectedTime && (
                                <div className="booking-summary">
                                    <div className="summary-item">
                                        <FaUser className="summary-icon" />
                                        <span>{doctorName}</span>
                                    </div>
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
                                disabled={!selectedDate || !selectedTime}
                                onClick={handleConfirm}
                            >
                                {t('booking.confirm')}
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
