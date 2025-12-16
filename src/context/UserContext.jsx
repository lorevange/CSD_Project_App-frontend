import { createContext, useEffect, useState } from "react";
import { updateUserFirstNameLastName } from '../api/updateUser';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
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
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
