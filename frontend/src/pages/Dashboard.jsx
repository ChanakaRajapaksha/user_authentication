import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch("/api/doctors");
                if (!response.ok) throw new Error("Failed to fetch doctors");
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error(error.message);
            }
        };

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

        // fetchDoctors();
        fetchPatients();
    }, []);

    const handlePatientClick = async (patientId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/patients/${patientId}`);
            if (!response.ok) throw new Error("Failed to fetch patient details");
            const data = await response.json();
            setSelectedPatient(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Left Sidebar */}
            <aside className="w-1/4 bg-gradient-to-b from-indigo-600 to-purple-600 text-white flex flex-col shadow-md">
                <div className="flex-grow overflow-y-auto">
                    {/* Doctor List */}
                    <div className="p-6 border-b border-purple-700">
                        <h3 className="text-lg font-semibold">Doctors</h3>
                        <ul className="mt-2 space-y-2">
                            {doctors.map((doctor) => (
                                <li
                                    key={doctor.id}
                                    className="text-sm px-2 py-1 bg-indigo-700 rounded-lg shadow-md"
                                >
                                    {doctor.name}
                                </li>
                            ))}
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
            <main className="flex-grow bg-gray-100 p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-700">Patient Details</h2>
                {selectedPatient ? (
                    <div className="bg-white p-6 shadow-lg rounded-lg">
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <tbody>
                                {[
                                    ["Full Name", selectedPatient.fullName],
                                    ["Date of Birth", new Date(selectedPatient.dateOfBirth).toLocaleDateString()],
                                    ["Age", selectedPatient.age],
                                    ["Gender", selectedPatient.gender],
                                    ["Nationality", selectedPatient.nationality],
                                    ["Email", selectedPatient.email],
                                    ["Marital Status", selectedPatient.maritalStatus],
                                    ["National ID", selectedPatient.nationalId],
                                    ["Other ID Type", selectedPatient.otherIdType],
                                    ["Other ID Value", selectedPatient.otherIdValue],
                                    ["Contact (Mobile)", selectedPatient.contactNumberMobile],
                                    ["Contact (Work)", selectedPatient.contactNumberWork],
                                ].map(([key, value], index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="px-4 py-2 font-semibold text-gray-600">{key}</td>
                                        <td className="px-4 py-2 text-gray-800">{value}</td>
                                    </tr>
                                ))}
                                {selectedPatient.customFields.map((field, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="px-4 py-2 font-semibold text-gray-600">
                                            {field.key.charAt(0).toUpperCase() + field.key.slice(1).toLowerCase()}
                                        </td>
                                        <td className="px-4 py-2 text-gray-800">{field.value}</td>
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
            </main>
        </div>
    );
};

export default Dashboard;
