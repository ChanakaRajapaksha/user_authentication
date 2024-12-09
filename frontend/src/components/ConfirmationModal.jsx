import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, user }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-lg font-bold mb-4 text-gray-700">
                    {user.status === "Active" ? "Deactivate User" : "Activate User"}
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to {user.status === "Active" ? "deactivate" : "activate"} this user?
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-500 text-sm text-white font-medium rounded-lg hover:bg-blue-600"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
