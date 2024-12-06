import React, { useState } from "react";
import { IoMdClose } from "react-icons/io"; 

const AddUserModal = ({ isOpen, onClose, onSave }) => {
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [branch, setBranch] = useState("");

    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);
        setName(`${selectedRole}`); // Auto-fill name based on role
    };

    const handleSave = () => {
        onSave({ role, name, email, mobile, branch });
        onClose(); 
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
                {/* Cancel Icon */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <IoMdClose size={24} />
                </button>

                <h2 className="text-lg font-bold mb-4 text-gray-700 text-center">
                    Add New User
                </h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                        value={role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="border rounded-lg w-full h-10 px-2 focus:outline-none"
                    >
                        <option value="" disabled>
                            Select a role
                        </option>
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Staff">Staff</option>
                        <option value="MLT">MLT</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        className="border rounded-lg w-full h-10 px-2 focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        className="border rounded-lg w-full h-10 px-2 focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                    <input
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Enter mobile number"
                        className="border rounded-lg w-full h-10 px-2 focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                    <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="Enter branch"
                        className="border rounded-lg w-full h-10 px-2 focus:outline-none"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-yellow-400 text-black font-medium rounded-md hover:bg-yellow-500"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;
