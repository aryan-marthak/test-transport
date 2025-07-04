import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [errors, setErrors] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        if (!employeeId) newErrors.employeeId = "Employee ID is required";
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch("http://localhost:5002/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeId, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Login successful!");
                navigate("/employee-dashboard");
            } else {
                alert("Login failed: " + data.error);
            }
        } catch (err) {
            alert("Login failed: " + err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white p-8 rounded shadow-md w-80" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <div className="mb-8 gap-4">
                    <div className="pb-2">
                        <label className="block mb-1 text-gray-700 font-semibold">Employee ID</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="Enter your Employee ID"
                        />
                    </div>
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>
                    )}
                    <div className="flex items-center justify-center ">
                        <h4 className="text-gray-700 font-light">OR</h4>
                    </div>
                    <div className="mt-[-14px]">
                        <label className="block mb-1 text-gray-700 font-semibold">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block mb-1 text-gray-700 font-semibold">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Login
                </button>
                <p className="text-center text-gray-500 mt-4">Don't have an account? <span className='text-blue-500 cursor-pointer'>Signup</span></p>
            </form>
        </div>
    );
};

export default Login;
