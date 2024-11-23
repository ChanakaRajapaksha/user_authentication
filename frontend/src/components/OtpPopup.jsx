import { useState } from "react";
import { toast } from "react-toastify";

const OtpPopup = ({ email, onClose, onVerify }) => {
    const [otp, setOtp] = useState("");

    const handleOtpSubmit = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Login successful!");
                onVerify(data.accessToken);
            } else {
                toast.error(data.message || "Invalid OTP.");
            }
        } catch (error) {
            console.error("OTP Verification Error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
                <input
                    type="text"
                    className="w-full mb-4 p-2 border rounded"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                />
                <button
                    onClick={handleOtpSubmit}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
                >
                    Verify
                </button>
                <button onClick={onClose} className="mt-4 text-red-500">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default OtpPopup;
