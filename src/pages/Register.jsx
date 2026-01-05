import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Auth.css';

import { specializations } from '../data/mockData'; // Import specializations
import { registerUser } from '../api/registration';
import AddressAutocomplete from '../components/AddressAutocomplete';

const Register = () => {
    const { t, i18n } = useTranslation(); // Add i18n
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialType = searchParams.get('type') === 'doctor' ? 'doctor' : 'patient';

    const [userType, setUserType] = useState(initialType);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        identity_number: '',
        email: '',
        phone: '',
        license_number: '',
        password: '',
        confirm_password: '',
        specialization: '',
        city: '',
        address: '',
        latitude: null,
        longitude: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [firstNameError, setFirstNameError] = useState(null);
    const [lastNameError, setLastNameError] = useState(null);
    const [identityNumberError, setIdentityNumberError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const nextData = { ...formData, [name]: value };
        setFormData(nextData);

        switch (name) {
            case 'password':
            case 'confirm_password':
                setPasswordError(validatePassword(nextData));
                break;
            case 'first_name':
                setFirstNameError(validateFirstName(value));
                break;
            case 'last_name':
                setLastNameError(validateLastName(value));
                break;
            case 'identity_number':
                setIdentityNumberError(validateIdentityNumber(value));
                break;
            case 'email':
                setEmailError(validateEmail(value));
                break;
            case 'phone':
                setPhoneError(validatePhone(value));
                break;
            default:
                break;
        }
    };

    const handleAddressSelect = (addressData) => {
        setFormData(prev => ({
            ...prev,
            address: addressData.address,
            city: addressData.city,
            latitude: addressData.lat,
            longitude: addressData.lng
        }));
    };

    const validatePassword = (data = formData) => {
        const password = data.password || '';
        const confirm = data.confirm_password || '';

        if (password.length < 8) return t('auth.password_length', 'Password must be at least 8 characters.');
        if (!/[0-9]/.test(password)) return t('auth.password_number', 'Password must contain at least one number.');
        if (!/[a-z]/.test(password)) return t('auth.password_lowercase', 'Password must contain at least one lowercase letter.');
        if (!/[A-Z]/.test(password)) return t('auth.password_uppercase', 'Password must contain at least one uppercase letter.');
        if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~]/.test(password)) return t('auth.password_special', 'Password must contain at least one special character.');
        if (password !== confirm) return t('auth.password_match', 'Passwords must match.');
        return null;
    };

    const validateFirstName = (value) => {
        if (!value || value.length < 2) {
            return t('auth.first_name_length', 'First name must be at least 2 characters.');
        }
        if (/[^a-zA-ZÀ-ÿ\s]/.test(value)) {
            return t('auth.first_name_invalid', 'First name cannot contain numbers or special characters.');
        }
        return null;
    };

    const validateLastName = (value) => {
        if (!value || value.length < 2) {
            return t('auth.last_name_length', 'Last name must be at least 2 characters.');
        }
        if (/[^a-zA-ZÀ-ÿ\s]/.test(value)) {
            return t('auth.last_name_invalid', 'Last name cannot contain numbers or special characters.');
        }
        return null;
    };
    const validateIdentityNumber = (value) => {
        if (!value || value.length !== 16) {
            return t('auth.identity_number_length', 'Identity Number must be 16 characters.');
        }
        if (!/^[A-Z0-9]+$/i.test(value)) {
            return t('auth.identity_number_invalid', 'Identity Number can only contain letters and numbers.');
        } 
    return null;
    };
    const validateEmail = (value) => {
        if (value.length < 3) {
            return t('auth.email_length', 'Email must be at least 3 characters.');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!emailRegex.test(value)) {
            return t('auth.email_invalid', 'Please enter a valid email address.');
        }
        return null;
    };
    const validatePhone = (value) => {
        if (!value) {
            return t('auth.phone_required', 'Phone number is required.');
        }
        if (!/^\d{10}$/.test(value)) {
            return t('auth.phone_invalid', 'Phone number must be exactly 10 digits and contain only numbers.');
        }
        return null;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {
            password: validatePassword(),
            first_name: validateFirstName(formData.first_name),
            last_name: validateLastName(formData.last_name),
            identity_number: validateIdentityNumber(formData.identity_number),
            email: validateEmail(formData.email),
            phone: validatePhone(formData.phone),
        };

        for (const key in errors) {
            if (errors[key]) {
                alert(errors[key]);
                return; 
            }
        }
        setIsSubmitting(true);

        try {
            await registerUser(userType, formData);
            alert(t('auth.registration_success'));
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
            const message = error?.message;
            if (message) {
                alert(message);
            } else {
                alert(t('auth.registration_error', 'Registration failed, please try again.'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <Header />
            <div className="auth-container">
                <div className="auth-card">
                    <h2>{t('auth.register_title')}</h2>

                    <div className="auth-tabs">
                        <button
                            className={`tab-btn ${userType === 'patient' ? 'active' : ''}`}
                            onClick={() => setUserType('patient')}
                        >
                            {t('auth.patient')}
                        </button>
                        <button
                            className={`tab-btn ${userType === 'doctor' ? 'active' : ''}`}
                            onClick={() => setUserType('doctor')}
                        >
                            {t('auth.doctor')}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>{t('auth.first_name')}</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                            {firstNameError && (
                                <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}>
                                    {firstNameError}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>{t('auth.last_name')}</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                            {lastNameError && (
                                <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}>
                                    {lastNameError}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>{t('auth.identity_number')}</label>
                            <input
                                type="text"
                                name="identity_number"
                                value={formData.identity_number}
                                onChange={handleChange}
                                required
                            />
                            {identityNumberError && (
                                <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}>
                                    {identityNumberError}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>{t('auth.email')}</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {emailError && (
                                <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}>
                                    {emailError}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>{t('auth.phone', 'Phone Number')}</label>
                            <input
                                type="tel"
                                name="phone"
                                inputMode="numeric"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            {phoneError && (
                                <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}>
                                    {phoneError}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>{t('auth.password')}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('auth.confirm_password', 'Confirm Password')}</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                            />
                            {passwordError && (
                                <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '4px' }}>
                                    {passwordError}
                                </p>
                            )}
                        </div>

                        {userType === 'doctor' && (
                            <>
                                <div className="form-group">
                                    <label>{t('auth.license_number', 'License Number')}</label>
                                    <input
                                        type="text"
                                        name="license_number"
                                        value={formData.license_number}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('auth.specialization')}</label>
                                    <select
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">{t('auth.select')}</option>
                                        {specializations.map((spec, index) => (
                                            <option key={index} value={spec.name.it}>
                                                {spec.name[i18n.language]}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>{t('auth.address', 'Address')}</label>
                                    <AddressAutocomplete onAddressSelect={handleAddressSelect} />
                                </div>
                                <div className="form-group">
                                    <label>{t('auth.city')}</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        readOnly
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="auth-btn" disabled={isSubmitting}>
                            {t('auth.register_button')}
                        </button>
                    </form>
                    <p className="auth-footer">
                        {t('auth.already_account')} <Link to="/login">{t('auth.login_link')}</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div >
    );
};

export default Register;
