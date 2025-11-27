import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Auth.css';

import { specializations } from '../data/mockData'; // Import specializations

const Register = () => {
    const { t, i18n } = useTranslation(); // Add i18n
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialType = searchParams.get('type') === 'doctor' ? 'doctor' : 'patient';

    const [userType, setUserType] = useState(initialType);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
        city: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock registration
        alert(t('auth.registration_success')); // Localized alert
        navigate('/login');
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
                            <label>{t('auth.name_surname')}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
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

                        {userType === 'doctor' && (
                            <>
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
                                    <label>{t('auth.city')}</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="auth-btn">{t('auth.register_button')}</button>
                    </form>
                    <p className="auth-footer">
                        {t('auth.already_account')} <Link to="/login">{t('auth.login_link')}</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
