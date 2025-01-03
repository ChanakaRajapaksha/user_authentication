import React, { useState } from "react";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const branches = [
    { id: 1, name: "Branch One" },
    { id: 2, name: "Branch Two" },
    { id: 3, name: "Branch Three" },
];

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [branch, setBranch] = useState(""); 

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Registration successful!", { position: "top-right" });
                setUsername("");
                setEmail("");
                setPassword("");
            } else {
                toast.error(data.message || "Failed to register", { position: "top-right" });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again later.", { position: "top-right" });
        }
    };

    return (
        <div className="flex h-[100vh]">
            <div className="w-1/2 bg-gray-200 flex items-center justify-center">
                <div className="rounded-full bg-gray-300 w-96 h-96"></div>
            </div>
            <div className="w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-lg">
                    <h1 className="flex justify-center text-[46px] font-bold mb-8 leading-[58px]">Register</h1>
                    <form onSubmit={handleRegister}>
                        <div className="flex flex-col gap-[4px] mb-8">
                            <label className="block text-gray-700 text-[14px] font-normal">Username</label>
                            <input
                                type="text"
                                className="w-full h-[48px] p-2 border rounded-lg focus:outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-[4px] mb-8">
                            <label className="block text-gray-700 text-[14px] font-normal">Email address</label>
                            <input
                                type="email"
                                className="w-full h-[48px] p-2 border rounded-lg focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-[4px] mb-10">
                            <label className="block text-gray-700 text-[14px] font-normal">Password</label>
                            <input
                                type="password"
                                className="w-full h-[48px] p-2 border rounded-lg focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-[4px] mb-10">
                            <label className="block text-gray-700 text-[14px] font-normal">Branch</label>
                            <select
                                className="w-full h-[48px] p-2 border rounded-lg focus:outline-none"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Select Branch
                                </option>
                                {branches.map((b) => (
                                    <option key={b.id} value={b.name}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[48px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 mb-4"
                        >
                            Register
                        </button>
                    </form>
                    <p className="text-center text-[16px] font-medium">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-500 text-[16px] font-medium">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
