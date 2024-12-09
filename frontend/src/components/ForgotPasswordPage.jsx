import { useState } from "react";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Password reset email sent. Check your inbox!");
                setEmail("");
            } else {
                toast.error(data.message || "Error sending reset email.");
            }
        } catch (error) {
            console.error("Forgot Password Error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div
            className="flex h-[100vh] items-center justify-center bg-slate-100"
        >
            <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
                <p className="text-gray-600 text-center mb-8">
                    Enter your email address to receive a password reset link.
                </p>
                <form onSubmit={handleForgotPassword}>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                    <input
                        type="email"
                        className="w-full h-[48px] p-2 border border-gray-300 rounded-lg focus:outline-none mb-6"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g., chanaka@example.com"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full h-[48px] bg-black text-white font-medium rounded-lg shadow-lg"
                    >
                        Send Reset Link
                    </button>
                </form>
                <div className="text-center mt-6">
                    <a
                        href="/login"
                        className="text-balck font-medium text-sm"
                    >
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
