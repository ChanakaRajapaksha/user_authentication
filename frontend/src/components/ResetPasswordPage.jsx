import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
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
        <div className="flex h-[100vh] items-center justify-center">
            <form onSubmit={handleResetPassword} className="w-full max-w-md p-10 border rounded-lg">
                <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                <label className="block mb-2 text-gray-700 text-[14px] font-normal">Enter new password</label>
                <input
                    type="password"
                    className="w-full h-[48px] p-2 border rounded-lg focus:outline-none mb-4"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full h-[48px] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none mb-6"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
