import React, { createContext, useContext, useState, useEffect } from "react";

const AuthUserContext = createContext();

export function AuthUserProvider({ children }) {
    const [authUser, setAuthUser] = useState(undefined); // undefined means loading

    // Fetch user info from backend
    const fetchUser = async () => {
        try {
            const response = await fetch("http://localhost:5002/api/me", {
                credentials: "include"
            });
            if (response.ok) {
                const user = await response.json();
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        } catch {
            setAuthUser(null);
        }
    };

    const loginUser = async (credentials) => {
        try {
            const response = await fetch("http://localhost:5002/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (response.ok) {
                // After login, fetch user info from /api/me
                await fetchUser();
                return { success: true, role: data.role };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const logoutUser = async () => {
        try {
            await fetch("http://localhost:5002/api/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch {}
        setAuthUser(null);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthUserContext.Provider value={{ authUser, loginUser, logoutUser }}>
            {children}
        </AuthUserContext.Provider>
    );
}

export default function useAuthUser() {
    return useContext(AuthUserContext);
} 