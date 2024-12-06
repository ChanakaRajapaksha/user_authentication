import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleMicrosoftLogin = () => {
        window.location.href = "http://localhost:5000/auth/microsoft"; 
    };

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

                        <button
                            type="button"
                            className="w-full h-[48px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 flex items-center justify-center mb-4"
                            onClick={handleMicrosoftLogin}
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                                alt="Microsoft Icon"
                                className="h-6 w-6 mr-2"
                            />
                            Sign in with Microsoft
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
        </div>
    );
};

export default AuthPage;