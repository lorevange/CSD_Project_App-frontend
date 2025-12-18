import { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { fetchCurrentUser } from '../api/token';

const AuthBootstrap = () => {
    const { user, login, logout, setIsAuthChecking, setSessionExpired } = useContext(UserContext);
    const navigate = useNavigate();
    const lastValidatedTokenRef = useRef(null);
    const inFlightRef = useRef(false);

    useEffect(() => {
        let isMounted = true;
        const token = localStorage.getItem('token');

        if (!token) {
            setIsAuthChecking(false);
            lastValidatedTokenRef.current = null;
            return;
        }

        if (inFlightRef.current || lastValidatedTokenRef.current === token) {
            return;
        }

        lastValidatedTokenRef.current = token;

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
    }, [login, logout, navigate, setIsAuthChecking, user]);

    return null;
};

export default AuthBootstrap;
