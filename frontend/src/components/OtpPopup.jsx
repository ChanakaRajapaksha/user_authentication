import React, { useState } from "react";
import { toast } from "react-toastify";

const OtpPopup = ({ email, onClose, onVerify }) => {
    const [otp, setOtp] = useState("");

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                onVerify(data.accessToken); // Pass the token or role to the parent
            } else {
                toast.error(data.message || "Invalid OTP.", { position: "top-right" });
            }
        } catch (error) {
            toast.error("An error occurred during OTP verification.", { position: "top-right" });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
                <form onSubmit={handleOtpSubmit}>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full p-2 border rounded-lg mb-4"
                        required
                    />
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Verify
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OtpPopup;
