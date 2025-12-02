import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaWifi } from 'react-icons/fa';
import '../styles/OfflinePage.css';

const OfflinePage = () => {
    const { t } = useTranslation();

    return (
        <div className="offline-page">
            <div className="offline-content">
                <FaWifi className="offline-icon" />
                <h2>{t('offline.title', 'No Internet Connection')}</h2>
                <p>{t('offline.message', 'Please check your internet connection and try again.')}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    {t('offline.retry', 'Retry')}
                </button>
            </div>
        </div>
    );
};

export default OfflinePage;
