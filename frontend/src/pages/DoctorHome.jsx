import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorHome = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/dashboard");
    };

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            <h1 className="text-3xl font-bold">Welcome to the Doctor Home Page!</h1>
            <button
                onClick={handleNavigation}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Go to the Dashboard Home Page
            </button>
        </div>
    );
};

export default DoctorHome;
