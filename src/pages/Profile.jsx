import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserContext } from '../context/UserContext';
import '../styles/Profile.css';
import { normalizePhotoToDataUrl } from '../utils/photo';

const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, updateUser } = useContext(UserContext);

    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoData, setPhotoData] = useState(user?.photo || null);
    const [statusMessage, setStatusMessage] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setPhotoData(user.photo || null);
            setPhotoPreview(null);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="profile-page">
                <Header />
                <div className="profile-container">
                    <div className="profile-card">
                        <p>{t('profile.login_prompt', 'Please log in to view your profile.')}</p>
                        <button className="profile-btn primary" onClick={() => navigate('/login')}>
                            {t('nav.login')}
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const formattedUserPhoto = photoPreview || normalizePhotoToDataUrl(photoData, 'image/png');
    const displayedPhoto = formattedUserPhoto || null;
    const committedFirstName = user?.first_name || '';
    const committedLastName = user?.last_name || '';
    const avatarLetters = committedFirstName.slice(0, 1) + committedLastName.slice(0, 1);
    const committedPhoto = user?.photo || null;
    const isDirty = firstName !== committedFirstName || lastName !== committedLastName || photoData !== committedPhoto;

    const handleNamesSave = (e) => {
        e.preventDefault();
        updateUser?.({
            identity_number: user?.identity_number,
            first_name: firstName,
            last_name: lastName,
            photo: photoData
        });
        setStatusMessage(t('profile.save_success', 'Profile updated.'));
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === 'string') {
                setPhotoData(result);
                setPhotoPreview(result);
                setStatusMessage(t('profile.photo_ready', 'Picture ready to upload. Save to apply.'));
            }
        };

        reader.readAsDataURL(file);
    };

    const handleAvatarEdit = () => {
        fileInputRef.current?.click();
    };

    const handleResetPassword = () => {
        setStatusMessage(t('profile.reset_placeholder', 'Password reset will be available soon.'));
    };

    return (
        <div className="profile-page">
            <Header />
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="avatar-wrapper elevated">
                            <div className="avatar">
                                {displayedPhoto ? (
                                    <img src={displayedPhoto} alt={t('profile.avatar_alt', 'Profile')} />
                                ) : (
                                    <span>{avatarLetters}</span>
                                )}
                            </div>
                            <button type="button" className="avatar-edit" onClick={handleAvatarEdit}>
                                {t('profile.edit_photo', 'Edit')}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className="profile-header-details">
                            <div className="profile-title-row">
                                <div>
                                    <p className="eyebrow">{t('profile.greeting', 'Your profile')}</p>
                                    <h2>{`${committedFirstName} ${committedLastName}`.trim() || t('profile.no_name', 'Unnamed user')}</h2>
                                    <p className="profile-subtitle">{user.email}</p>
                                    <div className="profile-meta">
                                        {user.profile && <span className="role-chip">{user.profile.charAt(0).toUpperCase()+user.profile.slice(1)}</span>}
                                        {user.identity_number && <span className="pill">{user.identity_number}</span>}
                                        {user.phone_number && <span className="pill">{user.phone_number}</span>}
                                    </div>
                                </div>
                                <button type="button" className="profile-btn ghost header-reset" onClick={handleResetPassword}>
                                    {t('profile.reset_password', 'Reset password (coming soon)')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-header">
                            <div>
                                <p className="eyebrow">{t('profile.details', 'Details')}</p>
                                <h3>{t('profile.edit_name_title', 'Update your info')}</h3>
                            </div>
                        </div>
                        <form className="profile-form" onSubmit={handleNamesSave}>
                            <div className="form-grid">
                                <div className="form-row">
                                    <label>{t('auth.first_name')}</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <label>{t('auth.last_name')}</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="profile-actions">
                                <button type="submit" className="profile-btn primary" disabled={!isDirty}>
                                    {t('profile.save_changes', 'Save changes')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {statusMessage && <div className="profile-status">{statusMessage}</div>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
