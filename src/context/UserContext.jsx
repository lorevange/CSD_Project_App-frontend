import React, { createContext, useState, useEffect } from 'react';
import { updateUserFirstNameLastName } from '../api/updateUser';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Carica l’utente da localStorage al mount
    useEffect(() => {
    try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        setUser(null);
    }
}, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const updateUser = async (partialUser) => {
        const nextUser = { ...(user || {}), ...(partialUser || {}) };
        setUser(nextUser);
        localStorage.setItem("user", JSON.stringify(nextUser));
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
        <UserContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
