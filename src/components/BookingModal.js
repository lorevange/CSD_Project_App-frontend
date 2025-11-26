import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaCalendarAlt, FaClock, FaCheckCircle, FaUser } from 'react-icons/fa';
import '../styles/BookingModal.css';

const BookingModal = ({ isOpen, onClose, doctorName }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    if (!isOpen) return null;

    // Generate next 7 days
    const getNextDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i + 1); // Start from tomorrow
            days.push({
                day: date.toLocaleDateString('it-IT', { weekday: 'short' }),
                date: date.getDate(),
                fullDate: date
            });
        }
        return days;
    };

    // Mock time slots
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleConfirm = () => {
        setStep(2); // Move to success state
    };

    const resetAndClose = () => {
        setStep(1);
        setSelectedDate(null);
        setSelectedTime(null);
        onClose();
    };

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
                                <div className="times-grid">
                                    {timeSlots.map((time, index) => (
                                        <div
                                            key={index}
                                            className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                            onClick={() => handleTimeSelect(time)}
                                        >
                                            {time}
                                        </div>
                                    ))}
                                </div>
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
