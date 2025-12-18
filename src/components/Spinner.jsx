import React from 'react';
import '../styles/Header.css';

const Spinner = ({ show, message }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="logout-overlay" role="status" aria-live="polite">
            <div className="logout-card">
                <div className="logout-spinner" />
                {message ? <p className="logout-message">{message}</p> : null}
            </div>
        </div>
    );
};

export default Spinner;
