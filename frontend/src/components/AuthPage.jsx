import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth";
import OtpPopup from "./OtpPopup"; // Import the OtpPopup component

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showOtpPopup, setShowOtpPopup] = useState(false); // State to toggle OTP popup
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                if (data.otpRequired) {
                    // Display toast and show OTP popup if OTP is required
                    toast.info("OTP sent to your email address.", { position: "top-right" });
                    setShowOtpPopup(true);
                } else {
                    // If OTP is not required, proceed with login
                    setAuth({ email: data.email, roles: data.roles, accessToken: data.accessToken });
                    navigate("/dashboard");
                }
            } else {
                toast.error(data.message || "Login failed.", { position: "top-right" });
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    const handleOtpVerify = (accessToken) => {
        // Callback when OTP is successfully verified
        setAuth({ email, accessToken });
        setShowOtpPopup(false);
        navigate("/dashboard");
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/2 bg-gray-200 flex items-center justify-center">
                <div className="rounded-full bg-gray-300 w-96 h-96"></div>
            </div>
            <div className="w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-lg">
                    <h1 className="flex justify-center text-[46px] font-bold mb-8 leading-[58px]">Welcome!</h1>
                    <form onSubmit={handleLogin}>
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
                            <label className="block text-gray-700 text-[14px] font-normal">Your password</label>
                            <input
                                type="password"
                                className="w-full h-[48px] p-2 border rounded-lg focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full h-[48px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 mb-4"
                        >
                            Log in
                        </button>

                        <div className="flex justify-between items-center mb-6">
                            <label className="flex items-center text-[16px] font-medium">
                                <input
                                    type="checkbox"
                                    className="mr-2 w-[24px] h-[24px]"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember me
                            </label>
                            <a href="/forgot-password" className="text-blue-500 text-[16px] font-medium">
                                Forgot password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            {/* Render OTP popup when showOtpPopup is true */}
            {showOtpPopup && (
                <OtpPopup
                    email={email}
                    onClose={() => setShowOtpPopup(false)}
                    onVerify={handleOtpVerify}
                />
            )}
        </div>
    );
};

export default AuthPage;
