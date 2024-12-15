import { useState, useEffect } from "react";
import { FaEdit, FaToggleOn, FaToggleOff, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";
import AddUserModal from "./AddUserModal";

const UserTable = () => {
    const [userList, setUserList] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/users");
                if (response.ok) {
                    const data = await response.json();
                    setUserList(data);
                } else {
                    alert("Failed to fetch users.");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                alert("Error fetching users.");
            }
        };

        fetchUsers();
    }, []);

    const totalPages = Math.ceil(userList.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = userList.slice(startIndex, startIndex + rowsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleToggleClick = (user) => {
        setModalData(user);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    const handleConfirmToggle = async () => {
        const newStatus = modalData.status === "Active" ? "Inactive" : "Active";

        try {
            const response = await fetch(`http://localhost:5000/api/users/${modalData.empId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Update the UI with the new status
                setUserList((prevList) =>
                    prevList.map((user) =>
                        user.empId === modalData.empId ? { ...user, status: newStatus } : user
                    )
                );

                setModalData(null);
            } else {
                alert("Failed to update user status.");
            }
        } catch (error) {
            console.error("Error updating user status:", error);
            alert("Error updating user status.");
        }
    };

    const handleEditUser = (user) => {
        if (user.status === "Inactive") {
            alert("Cannot edit details of an inactive user.");
            return;
        }

        setEditingUser(user); // Pass user details to modal
        setIsEditMode(true); // Switch modal to edit mode
        setIsModalOpen(true); // Open modal
    };

    const onUserUpdated = (updatedUser) => {
        if (!updatedUser) {
            console.error("No user data provided.");
            return;
        }

        setUserList((prevList) => {
            if (isEditMode) {
                // Update existing user
                return prevList.map((user) =>
                    user.empId === updatedUser.empId ? { ...user, ...updatedUser } : user
                );
            } else {
                // Add new user
                return [...prevList, updatedUser];
            }
        });

        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingUser(null);
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-100">
                        {["EmpId", "Name", "Email", "Mobile", "Branch", "Role", "Status", "Actions"].map((col, index) => (
                            <th key={index} className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((user, index) => (
                        <tr key={user.empId} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
                            <td className="py-3 px-4 text-sm">{user.empId}</td>
                            <td className="py-3 px-4 text-sm">{user.name}</td>
                            <td className="py-3 px-4 text-sm">{user.email}</td>
                            <td className="py-3 px-4 text-sm">{user.mobile}</td>
                            <td className="py-3 px-4 text-sm">{user.branch}</td>
                            <td className="py-3 px-4 text-sm">{user.role}</td>
                            <td
                                className={`py-3 px-4 text-sm font-semibold ${user.status === "Active" ? "text-green-700" : "text-red-700"}`}
                            >
                                {user.status}
                            </td>
                            <td className="py-3 px-4 text-sm flex items-center space-x-4">
                                <button
                                    onClick={() => handleToggleClick(user)}
                                    className="flex items-center justify-center"
                                >
                                    {user.status === "Active" ? (
                                        <FaToggleOn className="text-green-500 w-6 h-6" />
                                    ) : (
                                        <FaToggleOff className="text-red-500 w-6 h-6" />
                                    )}
                                </button>
                                <FaEdit
                                    className={`cursor-pointer ${user.status === "Inactive" ? "text-gray-400 cursor-not-allowed" : "text-yellow-500 hover:text-yellow-600"
                                        }`}
                                    size={18}
                                    onClick={() => {
                                        if (user.status === "Active") handleEditUser(user);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center space-x-2 bg-gray-300 py-2 px-4 rounded-md text-sm font-medium ${currentPage === 1 ? "text-gray-500" : "text-black"}`}
                >
                    <FaArrowLeft className={`${currentPage === 1 ? "text-gray-400" : "text-black"}`} />
                    <span>Previous</span>
                </button>
                <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center space-x-2 bg-gray-300 py-2 px-4 rounded-md text-sm font-medium ${currentPage === totalPages ? "text-gray-500" : "text-black"}`}
                >
                    <span>Next</span>
                    <FaArrowRight className={`${currentPage === totalPages ? "text-gray-400" : "text-black"}`} />
                </button>
            </div>

            {/* Place AddUserModal Here */}
            <AddUserModal
                isOpen={isModalOpen}
                isEditMode={isEditMode}
                user={editingUser}
                onClose={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setEditingUser(null);
                }}
                onUserUpdated={onUserUpdated} // Refresh user list after save
            />

            {/* Confirmation Modal */}
            {modalData && (
                <ConfirmationModal
                    isOpen={!!modalData}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmToggle}
                    user={modalData}
                />
            )}
        </div>
    );
};

export default UserTable;
