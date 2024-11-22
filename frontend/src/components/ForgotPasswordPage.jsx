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
        <div className="flex h-screen items-center justify-center">
            <form onSubmit={handleForgotPassword} className="w-full max-w-md p-10 border rounded-lg">
                <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
                <label className="block mb-2 text-gray-700 text-[14px] font-normal">Enter your email</label>
                <input
                    type="email"
                    className="w-full h-[48px] p-2 border rounded-lg focus:outline-none mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full h-[48px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none mb-6"
                >
                    Send Reset Link
                </button>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;
