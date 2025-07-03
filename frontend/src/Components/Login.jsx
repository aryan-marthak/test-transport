import React, { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white p-8 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <div className="mb-4">
                    <label className="block mb-1 text-gray-700">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-1 text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
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
