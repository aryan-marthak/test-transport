import { useState, useEffect } from "react";

const ADMIN_CREDENTIALS = {
    employeeId: "admin123",
    email: "admin@example.com",
    password: "adminpassword",
};

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

const useAuthUser = () => {
    const [authUser, setAuthUser] = useState(getStoredUser());

    // Function to determine role based on credentials
    const determineRole = (userData) => {
        if (
            userData.employeeId === ADMIN_CREDENTIALS.employeeId &&
            userData.email === ADMIN_CREDENTIALS.email
        ) {
            return "admin";
        }
        return "employee";
    };

    // Function to login user and set role
    const loginUser = (userData) => {
        const role = determineRole(userData);
        const userWithRole = { ...userData, role };
        setAuthUser(userWithRole);
        setStoredUser(userWithRole);
    };

    // Function to logout user
    const logoutUser = () => {
        setAuthUser(null);
        clearStoredUser();
    };

    useEffect(() => {
        // On mount, sync state with localStorage
        const storedUser = getStoredUser();
        if (storedUser) {
            setAuthUser(storedUser);
        }
    }, []);

    return { authUser, loginUser, logoutUser };
};

export default useAuthUser;
