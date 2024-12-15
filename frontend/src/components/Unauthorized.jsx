import React from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory

const Unauthorized = () => {
    const navigate = useNavigate();  // Replace history with navigate

    const handleRedirect = () => {
        navigate('/login');  // Redirect to the login page using navigate
    };

    return (
        <div className="flex h-[100vh] items-center justify-center bg-gray-100">
            <div className="max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-red-500 mb-4">Unauthorized</h2>
                <p className="text-lg text-gray-700 mb-6">
                    You do not have permission to view this page. Please check your credentials or contact an administrator.
                </p>
                <button
                    onClick={handleRedirect}
                    className="bg-black text-white font-medium px-6 py-2 rounded-lg"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
