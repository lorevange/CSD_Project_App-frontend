import { useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { fetchCurrentUser } from '../api/token';

const AuthBootstrap = () => {
    const { user, login, logout, setIsAuthChecking, setSessionExpired } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const lastValidationKeyRef = useRef(null);
    const inFlightRef = useRef(false);

    useEffect(() => {
        const handleUnauthorized = () => {
            setSessionExpired(true);
            logout();
            navigate('/');
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [logout, navigate, setSessionExpired]);

    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem('token');
        const validationKey = token ? `${token}-${location.key}` : null;

        if (!token) {
            setIsAuthChecking(false);
            lastValidationKeyRef.current = null;
            return;
        }

        if (inFlightRef.current || lastValidationKeyRef.current === validationKey) {
            return;
        }

        lastValidationKeyRef.current = validationKey;

        const validateToken = async () => {
            inFlightRef.current = true;
            setIsAuthChecking(true);
            try {
                const me = await fetchCurrentUser();
                if (me && !user) {
                    login(me);
                }
            } catch (error) {
                if (!isMounted) {
                    return;
                }
                setSessionExpired(true);
                logout();
                navigate('/');
            } finally {
                inFlightRef.current = false;
                if (isMounted) {
                    setIsAuthChecking(false);
                }
            }
        };

        validateToken();

        return () => {
            isMounted = false;
        };
    }, [location.key, login, logout, navigate, setIsAuthChecking, setSessionExpired, user]);

    return null;
};

export default AuthBootstrap;
