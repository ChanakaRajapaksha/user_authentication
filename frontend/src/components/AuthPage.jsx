import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import useAuth from "../../hooks/useAuth";
import Message from "./Notifications/Message";
import { loginUserService } from "../services/authService";
import BranchSelector from "./BranchSelector";
import { motion } from 'framer-motion';

const branches = [
    { id: 1, name: "Dubai London Clinic and Speciality Hospital L.L.C." },
    { id: 2, name: "Dubai London Clinic and Speciality Hospital L.L.C. Br, DFC" },
    { id: 3, name: "Dubai London Clinic and Speciality Hospital L.L.C. Br, Villa" },
    { id: 4, name: "Dubai London Clinic and Speciality Hospital L.L.C. Br, Nakheel" },
    { id: 5, name: "Warehouse" },
    { id: 6, name: "Dubai London Clinic and Speciality Hospital L.L.C. Br, Dental Center" },
    { id: 7, name: "Dubai London Hospital L.L.C." },
];

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, y: '-100vh' },
    visible: { opacity: 1, y: '0' },
    exit: { opacity: 0, y: '100vh' },
};

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
    const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const showMessage = (msg, type = "error") => {
        setMessage(msg);
        setType(type);
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

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError("");
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);

    };
    const maskEmail = (email) => {
        if (!email) return '';
        const [localPart, domain] = email.split('@');
        const visibleChars = 3;
        const maskedLocalPart = localPart.slice(0, visibleChars) + '*'.repeat(localPart.length - visibleChars);
        return `${maskedLocalPart}@${domain}`;
    };
    const handleForgotPasswordClick = async (e) => {
        e.preventDefault();
        setUsernameError("");
        setPasswordError("");

        if (!username) {
            showMessage("Please provide your username to reset your password.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5000/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: username }),
            });

            const data = await response.json();
            if (response.ok) {
                setForgotPasswordEmail(data.email);
                setShowForgotPasswordPopup(true);
            } else {
                showMessage(data.message || "Error sending reset email.");
            }
        } catch (error) {
            console.error("Forgot Password Error:", error);
            showMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setUsernameError("");
        setPasswordError("");

        if (!username) {
            setUsernameError("Username cannot be empty.");
            return;
        }

        if (!password) {
            setPasswordError("Password cannot be empty.");
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
                    showMessage("Reset token is missing.");
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
                try {
                    const errorData = JSON.parse(error.message);
                    if (errorData.blocked) {
                        setBlockedMessage(errorData.message);
                        setIsBlockedPopupVisible(true);
                    } else {
                        showMessage(errorData.message || "Your account is inactive. Please contact the admin.");
                    }
                } catch (parseError) {
                    showMessage(error.message || "An error occurred. Please try again.");
                }
            } else if (error.status === 401) {
                if (typeof error.message === "string") {
                    const errorMessage = error.message;
                    if (errorMessage === "Invalid username.") {
                        setUsernameError(
                            "Entered Username is invalid, please check the username and try again."
                        );
                    } else if (errorMessage === "Invalid password.") {
                        setPasswordError(
                            "Entered Password is invalid, please check the password and try again."
                        );
                    } else {
                        setUsernameError(
                            "Entered Username is invalid, please check the username and try again."
                        );
                        setPasswordError(
                            "Entered Password is invalid, please check the password and try again."
                        );
                    }
                } else {
                    setUsernameError(
                        "Entered Username is invalid, please check the username and try again."
                    );
                    setPasswordError(
                        "Entered Password is invalid, please check the password and try again."
                    );
                }
            } else {
                showMessage(error.message || "An error occurred. Please try again.");
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
                    throw new Error(errorMessage || "Failed to update branch.");
                }
            } catch (error) {
                console.error("Error during branch update and role-based redirection:", error);
                showMessage(error.message || "Redirection failed.");
            } finally {
                setIsLoading(false);
            }

        }
    };

    const handleRoleBasedRedirection = async (data) => {
        const { roles = [], accessToken, username, branch } = data;
        if (!roles.length) {
            showMessage("User has no roles assigned!");
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
            showMessage(error.message || "Redirection failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const ForgotPasswordPopup = ({ email, onClose }) => {
        return (
            <motion.div
                className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                <motion.div
                    className="bg-gray-200 p-5 rounded-lg shadow-lg max-w-md w-full relative"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 focus:outline-none"
                        aria-label="Close"
                    >
                        <FaTimes size={20} />
                    </button>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 w-12 h-12">
                            <img src="/email_icon.png" alt="Email Icon" className="w-full h-full object-contain" />
                        </div>
                        <p className="text-base mb-4">
                            We've received your password reset request. A reset link will be sent to:
                            <br />
                            <span className="font-bold">{maskEmail(email)}</span>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row h-[100vh]">
            {/* Left Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-200 items-center justify-center">
                <img src="/login_image.jpg" className="h-full object-cover" alt="Login" />
            </div>

            {/* Right Section */}
            <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-12">
                <div className="w-full max-w-lg">
                    <h1 className="text-center text-3xl lg:text-4xl font-bold mb-6 lg:mb-8">Welcome!</h1>
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-[4px] mb-4">
                            <label className="block text-gray-700 text-[14px] font-medium">Username</label>
                            <input
                                type="text"
                                className={`w-full h-[48px] p-2 border rounded-lg focus:outline-none ${usernameError ? 'border-red-500' : ''}`}
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setUsernameError("");
                                }}
                                maxLength={15}
                            />
                            {usernameError && (
                                <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <label className="block text-gray-700 text-sm font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`w-full h-12 p-2 border rounded-lg focus:outline-none ${passwordError ? 'border-red-500' : ''}`}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    maxLength={12}
                                />
                                <span
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                    onClick={handleTogglePassword}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {passwordError && (
                                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                            )}
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
                            <a href="#"
                                onClick={handleForgotPasswordClick}
                                className="text-black text-[16px] font-medium">
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
            {showForgotPasswordPopup && (
                <ForgotPasswordPopup
                    email={forgotPasswordEmail}
                    onClose={() => setShowForgotPasswordPopup(false)}
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