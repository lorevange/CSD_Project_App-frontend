import React from 'react';
import '../styles/SkeletonCard.css';

const SkeletonCard = () => {
    return (
        <div className="doctor-card skeleton-card">
            <div className="doctor-image-container skeleton-image"></div>
            <div className="doctor-info">
                <div className="skeleton-text skeleton-title"></div>
                <div className="skeleton-text skeleton-line"></div>
                <div className="skeleton-text skeleton-line"></div>
                <div className="skeleton-text skeleton-line short"></div>
                <div className="doctor-services">
                    <div className="skeleton-tag"></div>
                    <div className="skeleton-tag"></div>
                </div>
            </div>
            <div className="doctor-actions">
                <div className="skeleton-text skeleton-price"></div>
                <div className="skeleton-btn"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
