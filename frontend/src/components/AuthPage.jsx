import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth";
import { ClipLoader } from "react-spinners";

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
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

        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        setPasswordStrength(strength);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isEmailValid) {
            toast.error("Invalid email format.", { position: "top-right" });
            return;
        }

        if (!password) {
            toast.error("Password cannot be empty.", { position: "top-right" });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                const { masterPassword, resetToken } = data;
              
                if (masterPassword) {
                    if (resetToken) {
                        navigate(`/reset-password/${resetToken}`);
                    } else {
                        toast.error("Reset token is missing.", { position: "top-right" });
                    }
                    return;
                } else {
                    handleRoleBasedRedirection(data); 
                }

                if (response.status === 403) {
                    toast.error("Your account is inactive. Please contact the admin.", { position: "top-right" });
                    return;
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleBasedRedirection = async (data) => {
        const { roles = [], accessToken, username } = data;

        if (!roles.length) {
            toast.error("User has no roles assigned!", { position: "top-right" });
            setIsLoading(false);
            return;
        }

        setAuth({ email, roles, accessToken, username });

        const role = roles[0]; 

        const roleEndpoints = {
            admin: "/api/dashboard",
            Doctor: "/api/doctor-home",
            Nurse: "/api/nurse-home",
            Staff: "/api/staff-home",
            MLT: "/api/mlt-home",
        };

        const roleRedirections = {
            admin: "/dashboard",
            Doctor: "/doctor-home",
            Nurse: "/nurse-home",
            Staff: "/staff-home",
            MLT: "/mlt-home",
        };

        try {
            const response = await fetch(`http://localhost:5000${roleEndpoints[role]}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                navigate(roleRedirections[role]);
            } else {
                throw new Error("Access denied or unexpected role.");
            }
        } catch (error) {
            toast.error(error.message || "Redirection failed.", { position: "top-right" });
        } finally {
            setIsLoading(false);
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
                                className={`w-full h-[48px] p-2 border rounded-lg focus:outline-none ${isEmailValid ? "" : "border-red-500"}`}
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                            {!isEmailValid && <span className="text-red-500 text-sm">Invalid email format</span>}
                        </div>

                        <div className="flex flex-col gap-[4px] mb-4">
                            <label className="block text-gray-700 text-[14px] font-normal">Your password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full h-[48px] p-2 border rounded-lg focus:outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
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
                                                    : "bg-gray-500"}`}
                                    style={{ width: `${passwordStrength * 25}%` }}
                                ></div>
                            </div>
                            <span className="text-gray-600 text-sm">
                                {["Too Weak", "Weak", "Fair", "Strong", "Very Strong"][passwordStrength]}
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[48px] bg-black text-white font-medium p-2 rounded-lg mb-4"
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

            {isLoading && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <ClipLoader size={50} color={"#ffffff"} />
                </div>
            )}
        </div>
    );
};

export default AuthPage;
