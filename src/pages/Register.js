import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Auth.css';

const Register = () => {
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
        alert(`Registrazione ${userType === 'doctor' ? 'Dottore' : 'Paziente'} effettuata!`);
        navigate('/login');
    };

    return (
        <div className="auth-page">
            <Header />
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Registrati</h2>

                    <div className="auth-tabs">
                        <button
                            className={`tab-btn ${userType === 'patient' ? 'active' : ''}`}
                            onClick={() => setUserType('patient')}
                        >
                            Paziente
                        </button>
                        <button
                            className={`tab-btn ${userType === 'doctor' ? 'active' : ''}`}
                            onClick={() => setUserType('doctor')}
                        >
                            Dottore
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nome e Cognome</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
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
                                    <label>Specializzazione</label>
                                    <select
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleziona...</option>
                                        <option value="Cardiologo">Cardiologo</option>
                                        <option value="Dermatologo">Dermatologo</option>
                                        <option value="Dentista">Dentista</option>
                                        {/* Add more options */}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Città</label>
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

                        <button type="submit" className="auth-btn">Registrati</button>
                    </form>
                    <p className="auth-footer">
                        Hai già un account? <Link to="/login">Accedi</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
