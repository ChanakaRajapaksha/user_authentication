import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import OtpPopup from "./OtpPopup";

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    // Prefill email if saved in sessionStorage
    useEffect(() => {
        const savedEmail = sessionStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await response.json();

            console.log("Login response data:", data);

            if (response.ok) {
                if (data.otpRequired) {
                    toast.info("OTP sent to your email address.", { position: "top-right" });
                    setShowOtpPopup(true);
                } else {
                    handleRoleBasedRedirection(data); // Redirect after successful login
                }

                // Save email if "Remember Me" is checked
                if (rememberMe) {
                    sessionStorage.setItem("rememberedEmail", email);
                } else {
                    sessionStorage.removeItem("rememberedEmail");
                }
            } else {
                toast.error(data.message || "Login failed.", { position: "top-right" });
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.", { position: "top-right" });
        }
    };

    const handleRoleBasedRedirection = async (data) => {
        const roles = data.roles?.length ? data.roles : [];
        const accessToken = data.accessToken;

        if (!roles.length) {
            toast.error("User has no roles assigned!", { position: "top-right" });
            return;
        }

        setAuth({ email: data.email, roles, accessToken });

        const role = roles.includes("admin") ? "admin" : "doctor"; // Default to 'doctor' if no admin role
        const endpoint = role === "admin" ? "/api/dashboard" : "/api/doctor";

        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                navigate(role === "admin" ? "/dashboard" : "/doctor");
            } else {
                throw new Error("Access denied or unexpected role.");
            }
        } catch (error) {
            toast.error(error.message || "Redirection failed.", { position: "top-right" });
        }
    };

    const handleOtpVerify = (accessToken) => {
        const roles = accessToken?.roles || ["doctor"]; // Default to 'doctor' if roles are undefined
        const email = accessToken?.email || "Unknown";

        handleRoleBasedRedirection({ email, roles, accessToken });
        setShowOtpPopup(false);
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
