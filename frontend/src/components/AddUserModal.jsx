import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const AddUserModal = ({ isOpen, isEditMode, user, onClose, onUserUpdated }) => {
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [branch, setBranch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode && user) {
            setRole(user.role);
            setName(user.name);
            setEmail(user.email);
            setMobile(user.mobile);
            setBranch(user.branch);
        } else {
            setRole("");
            setName("");
            setEmail("");
            setMobile("");
            setBranch("");
        }
    }, [isEditMode, user]);

    
    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);
        setName(`${selectedRole}`); 
    };

    const handleSave = async () => {
        if (!role || !name || !email || !mobile || !branch) {
            alert("All fields are required.");
            return;
        }

        const endpoint = isEditMode
            ? `http://localhost:5000/api/users/${user.empId}`
            : "http://localhost:5000/api/adduser";
        const method = isEditMode ? "PUT" : "POST";

        const userData = { role, name, email, mobile, branch };

        setLoading(true);
        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Error Response:", error);
                throw new Error(error.message || "Failed to save user.");
            }

            const result = await response.json();

            console.log("User Save Response:", result);

            alert(result.success || "User saved successfully.");

            if (onUserUpdated) {
                onUserUpdated(result.user); 
            }

            onClose(); 
        } catch (err) {
            console.log("Error saving user:", err);
            alert("Error saving user. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <IoMdClose size={24} />
                </button>

                <h2 className="text-lg font-bold mb-4 text-gray-700 text-center">
                    {isEditMode ? "Edit User" : "Add New User"}
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
                        disabled={loading}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${loading ? "bg-gray-300 text-gray-600" : "bg-yellow-400 text-black hover:bg-yellow-500"
                            }`}
                    >
                        {loading ? "Saving..." : isEditMode ? "Edit" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;
