import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaClock } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { verifyEmail, resendVerification } from '../api/verification';
import '../styles/Auth.css';

const VerifyEmail = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const initialEmail = useMemo(() => {
        const stateEmail = location.state?.email;
        const queryEmail = new URLSearchParams(location.search).get('email');
        return stateEmail || queryEmail || '';
    }, [location]);

    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const subtitleText = t('auth.verify_email_subtitle', {
        defaultValue: 'Enter the 5-digit code sent to {{email}}',
        email: email || t('auth.your_email', 'your email'),
    });
    const validityText = t('auth.verification_validity', {
        defaultValue: 'The code is valid for 10 minutes.',
    });

    const handleVerify = async (event) => {
        event.preventDefault();
        setError('');

        if (!email) {
            setError(t('auth.email_required', 'Please enter your email.'));
            toast.error(t('auth.email_required', 'Please enter your email.'));
            return;
        }

        if (code.length !== 5) {
            setError(t('auth.verification_code_invalid', 'Please enter the 5-digit code.'));
            toast.error(t('auth.verification_code_invalid', 'Please enter the 5-digit code.'));
            return;
        }

        setIsSubmitting(true);
        try {
            await verifyEmail(email, code);
            toast.success(t('auth.verification_success', 'Email verified successfully. You can now log in.'));
            navigate('/login');
        } catch (err) {
            console.error('Email verification failed', err);
            setError(err?.message || t('auth.verification_error', 'The code is invalid or expired.'));
            toast.error(err?.message || t('auth.verification_error', 'The code is invalid or expired.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        setError('');

        if (!email) {
            setError(t('auth.email_required', 'Please enter your email.'));
            return;
        }

        setIsResending(true);
        try {
            await resendVerification(email);
            toast.success(t('auth.resend_success', 'Verification email resent.'));
        } catch (err) {
            console.error('Resend verification failed', err);
            setError(err?.message || t('auth.resend_error', 'Unable to resend verification email.'));
            toast.error(err?.message || t('auth.resend_error', 'Unable to resend verification email.'));
        } finally {
            setIsResending(false);
        }
    };

    const handleCodeChange = (value) => {
        const digitsOnly = value.replace(/\D/g, '').slice(0, 5);
        setCode(digitsOnly);
        if (error) {
            setError('');
        }
    };

    return (
        <div className="auth-page">
            <Header />
            <div className="auth-container">
                <div className="auth-card">
                    <h2>{t('auth.verify_email_title', 'Verify your email')}</h2>
                    <p className="auth-subtitle">
                        {subtitleText}
                    </p>
                    <p className="verification-note">
                        <FaClock aria-hidden="true" />
                        <span>{validityText}</span>
                    </p>

                    <form onSubmit={handleVerify}>
                        <div className="form-group">
                            <label>{t('auth.email')}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('auth.email_placeholder', 'you@example.com')}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('auth.verification_code_label', 'Verification Code')}</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={5}
                                autoComplete="one-time-code"
                                value={code}
                                onChange={(e) => handleCodeChange(e.target.value)}
                                placeholder={t('auth.verification_code_placeholder', 'Enter 5-digit code')}
                                className="code-input"
                                required
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <div className="verification-actions">
                            <button
                                type="submit"
                                className="auth-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('auth.verifying', 'Verifying...') : t('auth.verify_email_button', 'Verify and continue')}
                            </button>
                            <button
                                type="button"
                                className="auth-btn secondary"
                                onClick={handleResend}
                                disabled={isResending || !email}
                            >
                                {isResending ? t('auth.resending', 'Sending...') : t('auth.resend_verification_button', 'Resend verification email')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default VerifyEmail;
