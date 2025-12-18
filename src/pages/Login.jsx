import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Auth.css';

import { tryLogin } from '../api/login';
import { UserContext } from '../context/UserContext';

const Login = () => {
    const { t } = useTranslation();
    const { login } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoginError, setIsLoginError] = useState(false);

    const navigate = useNavigate();

    const resetErrorOnChange = (setter) => (value) => {
        setter(value);
        if (isLoginError) {
            setIsLoginError(false);
            setLoginErrorMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // ⬅️ risposta completa dal backend
            const data = await tryLogin(email, password);

            // ✅ salva token
            localStorage.setItem('token', data.access_token);

            // ✅ salva utente nel context (+ localStorage gestito dal context)
            login(data.user);

            navigate('/');

        } catch (error) {
            console.error('Login failed', error);
            setIsLoginError(true);
            setLoginErrorMessage(
                t('auth.login_error', 'Login failed, please try again.')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <Header />
            <div className="auth-container">
                <div className="auth-card">
                    <h2>{t('auth.login_title')}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>{t('auth.email')}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    resetErrorOnChange(setEmail)(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('auth.password')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    resetErrorOnChange(setPassword)(e.target.value)
                                }
                                required
                            />
                        </div>

                        {isLoginError && (
                            <div className="auth-error">
                                {loginErrorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={isSubmitting}
                        >
                            {t('auth.login_button')}
                        </button>
                    </form>

                    <p className="auth-footer">
                        {t('auth.no_account')}{' '}
                        <Link to="/register">
                            {t('auth.register_link')}
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;