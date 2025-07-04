import React, { createContext, useContext, useState, useEffect } from "react";

const AuthUserContext = createContext();

export function AuthUserProvider({ children }) {
    function getStoredUser() {
        const user = localStorage.getItem("authUser");
        return user ? JSON.parse(user) : null;
    }

    function setStoredUser(user) {
        localStorage.setItem("authUser", JSON.stringify(user));
    }

    function clearStoredUser() {
        localStorage.removeItem("authUser");
    }

    const [authUser, setAuthUser] = useState(getStoredUser());

    const loginUser = async (credentials) => {
        try {
            const response = await fetch("http://localhost:5002/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (response.ok) {
                const { employeeId, name, role } = data;
                const user = { employeeId, name, role };
                setAuthUser(user);
                setStoredUser(user);
                return { success: true, role: user.role };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const logoutUser = () => {
        setAuthUser(null);
        clearStoredUser();
    };

    useEffect(() => {
        const storedUser = getStoredUser();
        if (storedUser) {
            setAuthUser(storedUser);
        }
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