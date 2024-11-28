import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CustomFieldGenerator from "./CustomFieldGenerator";
const PatientRegisterPage = () => {
    const [commonFields, setCommonFields] = useState([
        { id: "fullName", label: "Full Name", type: "text", value: "" },
        { id: "dateOfBirth", label: "Date of Birth", type: "date", value: "" },
        { id: "gender", label: "Gender", type: "select", value: "", options: ["Male", "Female"] },
        { id: "email", label: "Email", type: "email", value: "" },
        { id: "nationalId", label: "National ID", type: "text", value: "" },
    ]);

    const [dynamicFields, setDynamicFields] = useState([
        { id: "nationality", label: "Nationality", type: "text", value: "" },
        { id: "maritalStatus", label: "Marital Status", type: "select", options: ["Single", "Married"] },
        { id: "visaType", label: "Visa Type", type: "select", options: ["Tourist", "Work"] },
        { id: "otherIdType", label: "Other ID Type", type: "text", value: "" },
        { id: "otherIdValue", label: "Other ID Value", type: "text", value: "" },
    ]);

    const [mobileNumber, setMobileNumber] = useState("");
    const [workNumber, setWorkNumber] = useState("");

    const handleAddField = (fieldId) => {
        setDynamicFields((prev) =>
            prev.map((field) =>
                field.id === fieldId ? { ...field, isVisible: true } : field
            )
        );
    };

    const handleRemoveField = (fieldId) => {
        setDynamicFields((prev) =>
            prev.map((field) =>
                field.id === fieldId ? { ...field, isVisible: false } : field
            )
        );
    };

    const handleAddCustomField = (field) => {
        setDynamicFields((prev) => [...prev, field]);
    };

    const handleChange = (fieldId, value) => {
        const isDynamic = dynamicFields.some((field) => field.id === fieldId);

        if (isDynamic) {
            setDynamicFields((prev) =>
                prev.map((field) => (field.id === fieldId ? { ...field, value } : field))
            );
        } else {
            setCommonFields((prev) =>
                prev.map((field) => (field.id === fieldId ? { ...field, value } : field))
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dynamicData = dynamicFields
            .filter((field) => field.isVisible)
            .reduce((acc, field) => {
                acc[field.id] = field.value || null;
                return acc;
            }, {});

        const formData = [...commonFields, ...dynamicFields.filter((field) => field.isVisible)]
            .reduce((acc, field) => {
                acc[field.id] = field.value.trim() || null;
                return acc;
            }, {});

        formData.contactNumberMobile = mobileNumber || null;
        formData.contactNumberWork = workNumber || null;

        try {
            const response = await fetch("http://localhost:5000/api/patient-register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, ...dynamicData }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Patient registered successfully!", { position: "top-right" });
                // Reset fields after successful submission
                setCommonFields((fields) => fields.map((field) => ({ ...field, value: "" })));
                setDynamicFields((fields) => fields.map((field) => ({ ...field, value: "", isVisible: false })));
                setMobileNumber("");
                setWorkNumber("");
            } else {
                toast.error(data.message || "Failed to register patient", { position: "top-right" });
            }
        } catch (error) {
            console.error("Error registering patient:", error);
            toast.error("Something went wrong. Please try again later.", { position: "top-right" });
        }
    };

    const renderFields = () => (
        <>
            {commonFields.map((field) => (
                <div key={field.id}
                    className={`relative ${field.width ? field.width : "w-[300px]"
                        }`}
                >
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                        {field.label}
                    </label>
                    {field.type === "select" ? (
                        <select
                            id={field.id}
                            value={field.value}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none ${field.widthClass || "w-[300px]"
                                }`}
                        >
                            <option value="">Select {field.label}</option>
                            {field.options.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id={field.id}
                            type={field.type}
                            value={field.value}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none ${field.widthClass || "w-[300px]"
                                }`}
                        />
                    )}
                </div>
            ))}

            <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <PhoneInput
                    country={"ae"}
                    value={mobileNumber}
                    onChange={(value) => setMobileNumber(value)}
                    enableSearch={true}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Work Number</label>
                <PhoneInput
                    country={"ae"}
                    value={workNumber}
                    onChange={(value) => setWorkNumber(value)}
                    enableSearch={true}
                />
            </div>

            {dynamicFields
                .filter((field) => field.isVisible)
                .map((field) => (
                    <div key={field.id} className="relative">
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label}
                        </label>
                        {field.type === "select" ? (
                            <select
                                id={field.id}
                                value={field.value}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className={`mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none ${field.widthClass || "w-[300px]"
                                    }`}
                            >
                                <option value="">Select {field.label}</option>
                                {field.options.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                id={field.id}
                                type={field.type}
                                value={field.value}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className={`mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none ${field.widthClass || "w-[300px]"
                                    }`}
                                required
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => handleRemoveField(field.id)}
                            className="absolute top-1 right-[110px] mt-1 text-red-500 hover:text-red-700"
                        >
                            <RemoveCircleIcon />
                        </button>
                    </div>
                ))}
        </>
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-1/4 bg-blue-500 flex flex-col p-6 gap-8">
                <div className="mt-6">
                    <h2 className="text-xl font-bold text-white mb-4">Add More Fields</h2>
                    {dynamicFields
                        .filter((field) => !field.isVisible)
                        .map((field) => (
                            <div
                                key={field.id}
                                className="flex items-center bg-black text-white px-4 py-2 rounded-md text-sm mb-2 gap-4 justify-between"
                            >
                                <span>{field.label}</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleAddField(field.id)}
                                        className="flex items-center text-white px-2 py-1 rounded-md text-sm hover:bg-gray-500"
                                    >
                                        <AddCircleIcon />
                                    </button>

                                </div>
                            </div>
                        ))}
                </div>

                <CustomFieldGenerator onAddField={handleAddCustomField} />
            </div>

            <div className="w-3/4 p-6">
                <div className="bg-white rounded-lg shadow-md p-12">
                    <h1 className="text-2xl font-bold mb-6">Register Patient</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-8">
                            {renderFields()}
                        </div>
                        <button
                            type="submit"
                            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Register Patient
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientRegisterPage;
