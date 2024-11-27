import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        { id: "contactNumberMobile", label: "Mobile Number", type: "phone", value: "" },
        { id: "contactNumberWork", label: "Work Number", type: "phone", value: "" },
    ]);

    const [dynamicFields, setDynamicFields] = useState([
        { id: "nationality", label: "Nationality", type: "text", value: "" },
        { id: "maritalStatus", label: "Marital Status", type: "select", options: ["Single", "Married"] },
        { id: "visaType", label: "Visa Type", type: "select", options: ["Tourist", "Work"] },
        { id: "otherIdType", label: "Other ID Type", type: "text", value: "" },
        { id: "otherIdValue", label: "Other ID Value", type: "text", value: "" },
    ]);

    const [countryCode, setCountryCode] = useState("+94");
    const [workCountryCode, setWorkCountryCode] = useState("+94");
    const [countryCodes, setCountryCodes] = useState([]);

    useEffect(() => {
        const fetchCountryCodes = async () => {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all");
                const data = await response.json();
                const codes = data
                    .map((country) => ({
                        name: country.name.common,
                        code: country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}` : null,
                    }))
                    .filter((item) => item.code);

                setCountryCodes(codes.sort((a, b) => a.name.localeCompare(b.name)));
            } catch (error) {
                console.error("Error fetching country codes:", error);
                toast.error("Failed to load country codes. Please try again later.", { position: "top-right" });
            }
        };

        fetchCountryCodes();
    }, []);

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
                if (field.id === "contactNumberMobile") {
                    // Prepend country code for mobile number
                    acc[field.id] = field.value.trim() ? `${countryCode}${field.value}` : null;
                } else if (field.id === "contactNumberWork") {
                    // Prepend country code for work number, or set as null
                    acc[field.id] = field.value.trim() ? `${workCountryCode}${field.value}` : null;
                } else {
                    // Assign value or null for all other fields
                    acc[field.id] = field.value.trim() ? field.value : null;
                }
                return acc;
            }, {});

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
                <div key={field.id} className="relative">
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                        {field.label} {field.id === "contactNumberWork" || dynamicFields.some((f) => f.id === field.id) ? "(Optional)" : ""}
                    </label>
                    {field.id === "contactNumberMobile" || field.id === "contactNumberWork" ? (
                        <div className="flex">
                            <select
                                value={field.id === "contactNumberMobile" ? countryCode : workCountryCode}
                                onChange={(e) =>
                                    field.id === "contactNumberMobile"
                                        ? setCountryCode(e.target.value)
                                        : setWorkCountryCode(e.target.value)
                                }
                                className="w-[220px] p-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:outline-none"
                            >
                                {countryCodes.map((country, index) => (
                                    <option key={index} value={country.code}>
                                        {`${country.name} (${country.code})`}
                                    </option>
                                ))}
                            </select>
                            <input
                                id={field.id}
                                type="text"
                                value={field.value}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    ) : field.type === "select" ? (
                        <select
                            id={field.id}
                            value={field.value}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none"
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
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none"
                        />
                    )}
                    {dynamicFields.some((f) => f.id === field.id) && (
                        <button
                            type="button"
                            onClick={() => handleRemoveField(field.id)}
                            className="absolute top-0 right-0 mt-1 text-red-500 hover:text-red-700"
                        >
                            <RemoveCircleIcon />
                        </button>
                    )}
                </div>
            ))}

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
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
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
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => handleRemoveField(field.id)}
                            className="absolute top-0 right-0 mt-1 text-red-500 hover:text-red-700"
                        >
                            <RemoveCircleIcon />
                        </button>
                    </div>
                ))}
        </>
    );

    return (
        <div className="flex h-screen bg-gray-100">
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

            <div className="w-3/4 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-md p-12">
                    <h1 className="text-2xl font-bold mb-6">Register Patient</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-8">{renderFields()}</div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white mt-6 p-3 rounded-lg hover:bg-blue-600 focus:outline-none"
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