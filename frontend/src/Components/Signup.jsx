import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [errors, setErrors] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        if (!employeeId) newErrors.employeeId = "Employee ID is required";
        if (!name) newErrors.name = "Name is required";
        if (!email) newErrors.email = "Email is required";
        if (!department) newErrors.department = "Department is required";
        if (!password) newErrors.password = "Password is required";
        if (!confirmPassword) newErrors.confirmPassword = "Password is required";
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch("http://localhost:5002/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeId, name, email, password, department }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Signup successful!");
                // Optionally, redirect to login
            } else {
                alert("Signup failed: " + data.error);
            }
        } catch (err) {
            alert("Signup failed: " + err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                className="bg-white p-8 rounded shadow-md w-96"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">Name</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">Department</label>
                    <select
                        className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring focus:border-blue-300"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    >
                        <option value="" className="font-light text-gray-400">
                            Select your department
                        </option>
                        <option value="ER">ER</option>
                        <option value="HR">HR</option>
                        <option value="IT">IT</option>
                        <option value="MECHANICAL">MECHANICAL</option>
                        <option value="CIVIL">CIVIL</option>
                        <option value="CHEMICAL">CHEMICAL</option>
                        {/* Add more options as needed */}
                    </select>
                    {errors.department && (
                        <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block mb-1 text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">Employee ID</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="Enter your employee ID"
                    />
                    {errors.employeeId && (
                        <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
                >
                    Sign Up
                </button>
                <p className="text-center text-gray-500 mt-4">
                    Already have an account?
                    <span className="text-blue-500 cursor-pointer"> Login</span>
                </p>
            </form>
        </div>
    );
};

export default Signup;
