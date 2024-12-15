import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { resetToken } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!resetToken) {
            toast.error("Reset token is missing or invalid. Redirecting to login...");
            setTimeout(() => navigate("/login"), 3000); 
        }
    }, [resetToken, navigate]);


    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validate password match
        if (newPassword !== confirmPassword) {
            setPasswordMatch(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/auth/reset-password/${resetToken}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Password reset successfully. Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                toast.error(data.message || "Error resetting password.");
            }
        } catch (error) {
            console.error("Reset Password Error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex h-[100vh] items-center justify-center bg-slate-100">
            <form 
                onSubmit={handleResetPassword} 
                className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>
                <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={`w-full p-3 border ${passwordMatch ? "border-gray-300" : "border-red-500"
                                } rounded-lg focus:outline-none`}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setPasswordMatch(true);
                            }}
                            required
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {!passwordMatch && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-black text-white font-semibold rounded-lg focus:outline-none"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
