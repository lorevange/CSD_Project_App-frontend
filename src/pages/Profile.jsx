import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserContext } from '../context/UserContext';
import '../styles/Profile.css';
import { normalizePhotoToDataUrl } from '../utils/photo';
import { activateDoctorService, createDoctorService, deactivateDoctorService, getDoctorServices } from '../api/doctorServices';

const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, updateUser } = useContext(UserContext);

    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoData, setPhotoData] = useState(user?.photo || null);
    const [statusMessage, setStatusMessage] = useState('');
    const [information, setInformation] = useState(user?.information || user?.doctor?.information || '');
    const fileInputRef = useRef(null);
    const [serviceName, setServiceName] = useState('');
    const [servicePrice, setServicePrice] = useState('');
    const [serviceSaving, setServiceSaving] = useState(false);
    const [serviceError, setServiceError] = useState(null);
    const [serviceSuccess, setServiceSuccess] = useState(false);
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [servicesError, setServicesError] = useState(null);
    const [showServiceForm, setShowServiceForm] = useState(false);

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setPhotoData(user.photo || null);
            setPhotoPreview(null);
            setInformation(user.information || user?.doctor?.information || '');
        }
    }, [user]);

    useEffect(() => {
        const fetchServices = async () => {
            if (user?.profile !== 'doctor') return;
            setServicesLoading(true);
            setServicesError(null);
            try {
                const doctorId = Number(user.id);
                const data = await getDoctorServices(doctorId, { includeInactive: true });
                if (Array.isArray(data)) {
                    setServices(data);
                } else {
                    setServices([]);
                }
            } catch (err) {
                console.error('Failed to load doctor services', err);
                setServicesError(err.message || t('profile.services_load_error', 'Unable to load services'));
                setServices([]);
            } finally {
                setServicesLoading(false);
            }
        };

        fetchServices();
    }, [user, t]);

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
    const committedInformation = user?.information || user?.doctor?.information || '';
    const isDirty = firstName !== committedFirstName || lastName !== committedLastName || photoData !== committedPhoto || information !== committedInformation;

    const handleNamesSave = (e) => {
        e.preventDefault();
        updateUser?.({
            identity_number: user?.identity_number,
            first_name: firstName,
            last_name: lastName,
            photo: photoData,
            information
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

    const handleServiceSave = async (e) => {
        e.preventDefault();
        setServiceError(null);
        setServiceSuccess(false);
        setServiceSaving(true);
        try {
            const parsedPrice = Math.round(Number(servicePrice));
            if (!Number.isFinite(parsedPrice)) {
                throw new Error(t('profile.invalid_price', 'Please enter a valid price'));
            }
            const doctorId = Number(user?.id);
            if (!Number.isFinite(doctorId)) {
                throw new Error(t('profile.missing_doctor_id', 'Doctor id not found'));
            }
            await createDoctorService({ name: serviceName, price: parsedPrice, doctorId });
            setShowServiceForm(false);
            setServiceSuccess(true);
            setServiceName('');
            setServicePrice('');
            const refreshed = await getDoctorServices(doctorId, { includeInactive: true });
            setServices(Array.isArray(refreshed) ? refreshed : []);
        } catch (err) {
            console.error('Failed to create doctor service', err);
            setServiceError(err.message || t('profile.service_save_error', 'Unable to save service'));
        } finally {
            setServiceSaving(false);
        }
    };

    const handleServiceDeactivate = async (serviceId) => {
        setServiceError(null);
        try {
            await deactivateDoctorService(serviceId);
            const doctorId = Number(user?.id);
            const refreshed = await getDoctorServices(doctorId, { includeInactive: true });
            setServices(Array.isArray(refreshed) ? refreshed : []);
        } catch (err) {
            console.error('Failed to deactivate doctor service', err);
            setServiceError(err.message || t('profile.service_deactivate_error', 'Unable to deactivate service'));
        }
    };

    const handleServiceActivate = async (serviceId) => {
        setServiceError(null);
        try {
            await activateDoctorService(serviceId);
            const doctorId = Number(user?.id);
            const refreshed = await getDoctorServices(doctorId, { includeInactive: true });
            setServices(Array.isArray(refreshed) ? refreshed : []);
        } catch (err) {
            console.error('Failed to activate doctor service', err);
            setServiceError(err.message || t('profile.service_activate_error', 'Unable to activate service'));
        }
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
                                <div className="form-row form-row-full">
                                    <label>{t('profile.information', 'Information')}</label>
                                    <textarea
                                        value={information}
                                        onChange={(e) => setInformation(e.target.value)}
                                        rows={4}
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

                    {user?.profile === 'doctor' && (
                        <div className="panel">
                            <div className="panel-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p className="eyebrow">{t('profile.doctor_services', 'Examination types')}</p>
                                    <h3>{t('profile.add_service_title', 'Services')}</h3>
                                </div>
                                <button
                                    type="button"
                                    className="profile-btn primary"
                                    onClick={() => setShowServiceForm((v) => !v)}
                                >
                                    {showServiceForm ? t('common.close', 'Close') : t('profile.add_service', 'Add service')}
                                </button>
                            </div>

                            {servicesLoading && <div className="profile-status">{t('profile.loading_services', 'Loading services...')}</div>}
                            {servicesError && <div className="auth-error">{servicesError}</div>}

                            {!servicesLoading && services.length > 0 && (
                                <div className="services-list">
                                    {services.map((svc) => (
                                        <div key={svc.id} className={`service-row ${svc.is_active === false ? 'inactive' : ''}`}>
                                            <div>
                                                <div className="service-name">{svc.name}</div>
                                                <div className="service-price">€{svc.price}</div>
                                                {svc.is_active === false && (
                                                    <span className="service-status inactive">{t('profile.inactive', 'Inactive')}</span>
                                                )}
                                            </div>
                                            {svc.is_active === false ? (
                                                <button
                                                    type="button"
                                                    className="profile-btn ghost activate"
                                                    onClick={() => handleServiceActivate(svc.id)}
                                                >
                                                    {t('profile.activate', 'Activate')}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="profile-btn ghost deactivate"
                                                    onClick={() => handleServiceDeactivate(svc.id)}
                                                >
                                                    {t('profile.deactivate', 'Deactivate')}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {showServiceForm && (
                                <form className="profile-form" onSubmit={handleServiceSave}>
                                    <div className="form-grid">
                                        <div className="form-row">
                                            <label>{t('profile.service_name', 'Name')}</label>
                                            <input
                                                type="text"
                                                value={serviceName}
                                                onChange={(e) => setServiceName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-row">
                                            <label>{t('profile.service_price', 'Price (€)')}</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={servicePrice}
                                                onChange={(e) => setServicePrice(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {serviceError && <div className="auth-error">{serviceError}</div>}
                                    {serviceSuccess && <div className="profile-status">{t('profile.service_saved', 'Service saved')}</div>}
                                    <div className="profile-actions">
                                        <button type="submit" className="profile-btn primary" disabled={serviceSaving}>
                                            {serviceSaving ? t('profile.saving', 'Saving...') : t('profile.save_service', 'Save service')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {statusMessage && <div className="profile-status">{statusMessage}</div>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
