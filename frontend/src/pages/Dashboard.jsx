import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import UserTable from "../components/UserTable";
import AddUserModal from "../components/AddUserModal";

const Dashboard = () => {
    const [userList, setUserList] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [currentView, setCurrentView] = useState("userDetails"); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/patients");
                if (!response.ok) throw new Error("Failed to fetch patients");
                const data = await response.json();
                setPatients(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchPatients();
    }, []);

    const handlePatientClick = async (patientId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/patients/${patientId}`);
            if (!response.ok) throw new Error("Failed to fetch patient details");
            const data = await response.json();
            setSelectedPatient(data);
            setCurrentView("patients"); 
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <aside className="w-1/6 bg-gradient-to-b from-indigo-600 to-purple-600 text-white flex flex-col shadow-md">
                <div className="flex-grow overflow-y-auto">
                    <div className="p-6 border-b border-purple-700">
                        <h3 className="text-lg font-semibold">Users</h3>
                        <ul className="mt-2 space-y-2">
                            <li
                                className={`cursor-pointer text-sm px-2 py-1 rounded-lg shadow-md ${currentView === "userDetails" ? "bg-purple-800" : "bg-purple-700 hover:bg-purple-800"
                                    }`}
                                onClick={() => setCurrentView("userDetails")}
                            >
                                User Details
                            </li>
                            <li
                                className={`cursor-pointer text-sm px-2 py-1 rounded-lg shadow-md ${currentView === "manageUsers" ? "bg-purple-800" : "bg-purple-700 hover:bg-purple-800"
                                    }`}
                                onClick={() => setCurrentView("manageUsers")}
                            >
                                Manage Users
                            </li>
                        </ul>
                    </div>
                    {/* Patient List */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold">Patients</h3>
                        <ul className="mt-2 space-y-2">
                            {patients.map((patient) => (
                                <li
                                    key={patient.patientId}
                                    className="cursor-pointer text-sm px-2 py-1 bg-purple-700 rounded-lg shadow-md hover:bg-purple-800"
                                    onClick={() => handlePatientClick(patient.patientId)}
                                >
                                    {patient.fullName}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow bg-gray-100 p-8 overflow-y-auto">
                {currentView === "userDetails" && (
                    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-6 text-gray-700">User Details</h2>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-col relative w-[300px]">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="border rounded-lg h-10 pl-2 pr-10 focus:outline-none"
                                />

                                <div className="absolute inset-y-0 right-2 top-2 p-1 bg-blue-100 w-6 h-6 rounded-md flex items-center">
                                    <FaSearch className="text-black h-4 w-4" />
                                </div>
                            </div>
                           
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center bg-black text-white py-2 px-4 rounded-md text-sm font-medium shadow-md"
                            >
                                <span className="mr-2">Add</span>
                                <IoMdPersonAdd />
                            </button>
                        </div>
                        <UserTable userList={userList} />
                    </div>
                )}

                <AddUserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    setUserList={setUserList}
                    onUserAdded={(newUser) => setUserList((prevList) => [...prevList, newUser])}
                    onUserUpdated={(updatedUser) =>
                        setUserList((prevList) =>
                            prevList.map((user) =>
                                user.empId === updatedUser.empId ? updatedUser : user
                            )
                        )
                    }
                />

                {currentView === "manageUsers" && (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-gray-700">Manage Users</h2>
                        <div className="text-gray-600 text-lg font-semibold">Manage users section content goes here.</div>
                    </div>
                )}
                {currentView === "patients" && selectedPatient && (
                    <div className="flex-grow bg-gray-100 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-6 text-gray-700">Patient Details</h2>
                        {selectedPatient ? (
                            <div className="bg-white p-4 shadow-lg rounded-lg max-w-8xl mx-auto">
                                <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
                                    <tbody>
                                        {[
                                            ["Full Name", selectedPatient.fullName || "N/A"],
                                            ["Date of Birth", selectedPatient.dateOfBirth ? new Date(selectedPatient.dateOfBirth).toLocaleDateString() : "N/A"],
                                            ["Age", selectedPatient.age || "N/A"],
                                            ["Gender", selectedPatient.gender || "N/A"],
                                            ["Nationality", selectedPatient.nationality || "N/A"],
                                            ["Email", selectedPatient.email || "N/A"],
                                            ["Contact (Mobile)", selectedPatient.contactNumberMobile || "N/A"],
                                            ["Contact (Work)", selectedPatient.contactNumberWork || "N/A"],
                                            ["National ID", selectedPatient.nationalId || "N/A"],
                                            ["Marital Status", selectedPatient.maritalStatus || "N/A"],
                                            ["Visa Type", selectedPatient.visaType || "N/A"],
                                            ["Other ID Type", selectedPatient.otherIdType || "N/A"],
                                            ["Other ID Value", selectedPatient.otherIdValue || "N/A"],
                                            ["Consultation Type", selectedPatient.consultationType || "N/A"],
                                            ["Doctor Name", selectedPatient.doctorName || "N/A"],
                                            ["Appointment Date", selectedPatient.appointmentDate || "N/A"],
                                            ["Speciality", selectedPatient.speciality || "N/A"],
                                            ["Consultation Reason", selectedPatient.consultationReason || "N/A"],
                                            ["Payment Type", selectedPatient.paymentType
                                                ? selectedPatient.paymentType.charAt(0).toUpperCase() + selectedPatient.paymentType.slice(1)
                                                : "N/A"],
                                            ["Insurance Card Number", selectedPatient.insuranceCardNumber || "N/A"],
                                            ["Insurance Provider", selectedPatient.insuranceProvider || "N/A"],
                                            ["Insurance Sub Provider", selectedPatient.insuranceSubProvider || "N/A"],
                                            ["Insurance Plan", selectedPatient.insurancePlan || "N/A"],
                                            ["Policy Number", selectedPatient.policyNumber || "N/A"],
                                            ["Policy Expiry Date", selectedPatient.policyExpiryDate || "N/A"]
                                        ].map(([key, value], index) => (
                                            <tr key={index} className="border-b border-gray-200">
                                                <td className="px-1 py-1 font-semibold text-gray-600">{key}</td>
                                                <td className="px-1 py-1 text-gray-800">{value}</td>
                                            </tr>
                                        ))}
                                        {selectedPatient.customFields &&
                                            Array.isArray(selectedPatient.customFields) &&
                                            selectedPatient.customFields
                                                .filter((field) => {
                                                    const lowerCaseKey = field.key.toLowerCase();
                                                    return !["insurancedetails", "customfields"].includes(lowerCaseKey);
                                                })
                                                .map((field, index) => (
                                                    <tr key={index} className="border-b border-gray-200">
                                                        <td className="px-1 py-1 font-semibold text-gray-600">
                                                            {field.key
                                                                .replace(/_/g, " ") // Replace underscores with spaces
                                                                .replace(/\b\w/g, (char) => char.toUpperCase())} {/* Capitalize the first letter of each word */}
                                                        </td>
                                                        <td className="px-1 py-1 text-gray-800">
                                                            {typeof field.value === "object" && field.value !== null
                                                                ? JSON.stringify(field.value, null, 2)
                                                                : field.value || "N/A"}
                                                        </td>
                                                    </tr>
                                                ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-gray-600 text-lg font-semibold">
                                Select a patient to view details.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
