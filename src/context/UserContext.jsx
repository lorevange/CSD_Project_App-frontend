import React, { createContext, useState } from 'react';
import { updateUserFirstNameLastName } from '../api/updateUser';

export const UserContext = createContext();

const readStoredUser = () => {
    try {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        return null;
    }
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(readStoredUser);
    const [isAuthChecking, setIsAuthChecking] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);

    const login = (userData) => {
        setUser(userData);
        setSessionExpired(false);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const updateUser = async (partialUser) => {
        const nextUser = { ...(user || {}), ...(partialUser || {}) };
        setUser(nextUser);
        localStorage.setItem('user', JSON.stringify(nextUser));
        try {
            await updateUserFirstNameLastName(nextUser);
        } catch (err) {
            // Keep local changes but surface the failure for callers if needed
            console.error('Failed to update user on server', err);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                logout,
                updateUser,
                isAuthChecking,
                setIsAuthChecking,
                sessionExpired,
                setSessionExpired
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
