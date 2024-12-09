import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        const savedEmail = sessionStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        calculatePasswordStrength(password);
    }, [password]);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(value));
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;

        // Check for length
        if (password.length >= 8) strength++;

        // Check for uppercase letters
        if (/[A-Z]/.test(password)) strength++;

        // Check for numbers
        if (/[0-9]/.test(password)) strength++;

        // Check for special characters
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        setPasswordStrength(strength);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isEmailValid) {
            toast.error("Invalid email format.", { position: "top-right" });
            return;
        }

        if (passwordStrength < 2) {
            toast.error("Password is too weak. Please use a stronger password.", { position: "top-right" });
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                if (data.otpRequired) {
                    toast.info("OTP sent to your email address.", { position: "top-right" });
                } else {
                    handleRoleBasedRedirection(data);
                }

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
        const { roles = [], accessToken, username } = data;

        if (!roles.length) {
            toast.error("User has no roles assigned!", { position: "top-right" });
            return;
        }

        setAuth({ email, roles, accessToken, username });

        const role = roles.includes("admin") ? "admin" : "doctor";
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

    return (
        <div className="flex h-[100vh]">
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
                                className={`w-full h-[48px] p-2 border rounded-lg focus:outline-none ${isEmailValid ? "" : "border-red-500"
                                    }`}
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                            {!isEmailValid && <span className="text-red-500 text-sm">Invalid email format</span>}
                        </div>

                        <div className="flex flex-col gap-[4px] mb-4">
                            <label className="block text-gray-700 text-[14px] font-normal">Your password</label>
                            <input
                                type="password"
                                className="w-full h-[48px] p-2 border rounded-lg focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-8">
                            <div className="w-full bg-gray-200 h-2 rounded-lg">
                                <div
                                    className={`h-full rounded-lg ${passwordStrength === 1
                                            ? "bg-red-500"
                                            : passwordStrength === 2
                                                ? "bg-orange-500"
                                                : passwordStrength === 3
                                                    ? "bg-yellow-500"
                                                    : passwordStrength === 4
                                                        ? "bg-green-500"
                                                        : "bg-gray-500"
                                        }`}
                                    style={{ width: `${passwordStrength * 25}%` }}
                                ></div>
                            </div>
                            <span className="text-gray-600 text-sm">
                                {["Too Weak", "Weak", "Fair", "Strong", "Very Strong"][passwordStrength]}
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[48px] bg-black text-white p-2 rounded-lg mb-4"
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
                            <a href="/forgot-password" className="text-black text-[16px] font-medium">
                                Forgot password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
