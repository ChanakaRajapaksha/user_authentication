import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import useAuth from "../../hooks/useAuth";
import Message from "./Notifications/Message";
import { loginUserService } from "../services/authService";
import BranchSelector from "./BranchSelector";

const branches = [
    { id: 1, name: "Dubai London Clinic and Speciality Hospital L.L.C." },
    { id: 2, name: "Dubai London Clinic and Speciality Hospital L.L.C. Br, DFC" },
    { id: 3, name: "Dubai London Clinic and Speciality Hospital L.L.C. Br, Villa" },
    { id: 4, name: "Dubai London Clinic and Speciality Hospital L.L.C. Br, Nakheel" },
    { id: 5, name: "Warehouse" },
    { id: 6, name: "Dubai London Clinic and Speciality Hospital L.L.C. Br, Dental Center" },
    { id: 7, name: "Dubai London Hospital L.L.C." },
];

const AuthPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);
    const [showBranchSelector, setShowBranchSelector] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [authData, setAuthData] = useState(null);


    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const showMessage = (msg) => {
        setMessage(msg);
        setMessageVisible(true);
    };

    const closeMessage = () => {
        setMessageVisible(false);
    };

    useEffect(() => {
        const savedUsername = sessionStorage.getItem("rememberedUsername");
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username) {
            toast.error("Username cannot be empty.", { position: "top-right" });
            return;
        }

        if (!password) {
            toast.error("Password cannot be empty.", { position: "top-right" });
            return;
        }

        setIsLoading(true);

        try {
            const data = await loginUserService(username, password);
            const { masterPassword, resetToken } = data;

            if (masterPassword) {
                if (resetToken) {
                    navigate(`/reset-password/${resetToken}`);
                } else {
                    toast.error("Reset token is missing.", { position: "top-right" });
                }
                return;
            }


            setAuthData(data);
            setShowBranchSelector(true);

            if (rememberMe) {
                sessionStorage.setItem("rememberedUsername", username);
            } else {
                sessionStorage.removeItem("rememberedUsername");
            }
        } catch (error) {
            if (error.status === 403) {
                toast.error("Your account is inactive. Please contact the admin.", { position: "top-right" });
            } else {
                console.error("Error", error);
                toast.error(error.message || "An error occurred. Please try again.", { position: "top-right" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBranchSelection = async (selectedBranch) => {
        setSelectedBranch(selectedBranch);
        setShowBranchSelector(false);

        if (authData) {
            setIsLoading(true)
            try {
                const { accessToken, roles, username } = authData
                const response = await fetch(`http://localhost:5000/auth/update-branch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ branch: selectedBranch }),
                });

                if (response.ok) {
                    const updatedUserData = await response.json();
                    handleRoleBasedRedirection({ ...authData, branch: updatedUserData.branch });
                } else {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || "Failed to update branch.")
                }
            } catch (error) {
                console.error("Error during branch update and role-based redirection:", error);
                toast.error(error.message || "Redirection failed.", { position: "top-right" });
            } finally {
                setIsLoading(false);
            }

        }
    };


    const handleRoleBasedRedirection = async (data) => {
        const { roles = [], accessToken, username, branch } = data;
        if (!roles.length) {
            toast.error("User has no roles assigned!", { position: "top-right" });
            setIsLoading(false);
            return;
        }


        setAuth({ roles, accessToken, username });

        const role = roles[0];


        const roleEndpoints = {
            super_admin: "/api/super-dashboard",
            admin: "/api/dashboard",
            Doctor: "/api/doctor-home",
            Nurse: "/api/nurse-home",
            Staff: "/api/staff-home",
            MLT: "/api/mlt-home",
        };

        const roleRedirections = {
            super_admin: "/super-dashboard",
            admin: "/dashboard",
            Doctor: "/doctor-home",
            Nurse: "/nurse-home",
            Staff: "/staff-home",
            MLT: "/mlt-home",
        };

        try {
            const endpoint = roleEndpoints[role];
            const redirectionPath = roleRedirections[role];

            if (!endpoint || !redirectionPath) {
                throw new Error(`Unknown role: ${role}`);
            }


            const response = await fetch(`http://localhost:5000${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                navigate(redirectionPath);
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Access denied or unexpected role.");
            }
        } catch (error) {
            console.error("Error during role-based redirection:", error);
            toast.error(error.message || "Redirection failed.", { position: "top-right" });
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="flex flex-col lg:flex-row h-screen">
            {/* Left Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-200 items-center justify-center">
                <img src="/login_image.jpg" className="h-full object-cover" alt="Login" />
            </div>

            {/* Right Section */}
            <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-12">
                <div className="w-full max-w-lg">
                    <h1 className="text-center text-3xl lg:text-4xl font-bold mb-6 lg:mb-8">Welcome!</h1>
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-[4px] mb-8">
                            <label className="block text-gray-700 text-[14px] font-medium">Username</label>
                            <input
                                type="text"
                                className="w-full h-[48px] p-2 border rounded-lg focus:outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-[4px] mb-8">
                            <label className="block text-gray-700 text-[14px] font-medium">
                                Your password
                            </label>
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

                        <div className="flex justify-start items-center mb-6">
                            <label className="flex items-center text-[16px] font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="mr-2 w-[24px] h-[24px] accent-black cursor-pointer"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[48px] bg-black text-white font-medium p-2 rounded-lg mb-4"
                        >
                            Log in
                        </button>

                        <div className="flex justify-center mb-6">
                            <a href="/forgot-password" className="text-black text-[16px] font-medium">
                                Forgot password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
            <Message
                isVisible={isMessageVisible}
                onClose={closeMessage}
                msg={message}
                type={type}
            />
            {showBranchSelector && (
                <BranchSelector
                    branches={branches}
                    onSelectBranch={handleBranchSelection}
                    onClose={() => setShowBranchSelector(false)}
                />
            )}

            {/* Preloader */}
            {isLoading && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <ClipLoader size={50} color={"#ffffff"} />
                </div>
            )}
        </div>
    );
};

export default AuthPage;