import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CustomFieldGenerator from "./CustomFieldGenerator";

const PatientRegisterPage = () => {
    const [selectedFieldGroup, setSelectedFieldGroup] = useState("patientDetails");

    const [commonFields, setCommonFields] = useState([
        { id: "fullName", label: "Full Name", type: "text", value: "", width: "col-span-4" },
        { id: "dateOfBirth", label: "Date of Birth", type: "date", value: "", width: "col-span-3" },
        { id: "gender", label: "Gender", type: "select", value: "", options: ["Male", "Female"], width: "col-span-2" },
        { id: "email", label: "Email", type: "email", value: "", width: "col-span-2" },
        {
            id: "contactNumberMobile",
            label: "Mobile Number",
            type: "phone",
            value: "",
            width: "col-span-2",
        },
        {
            id: "contactNumberWork",
            label: "Work Number",
            type: "phone",
            value: "",
            width: "col-span-2",
        },
        { id: "nationalId", label: "National ID", type: "text", value: "", width: "col-span-2" },
    ]);

    const [patientDynamicFields, setPatientDynamicFields] = useState([
        { id: "nationality", label: "Nationality", type: "text", value: "", width: "col-span-3", isVisible: false },
        { id: "maritalStatus", label: "Marital Status", type: "select", options: ["Single", "Married"], width: "col-span-4", isVisible: false },
        { id: "visaType", label: "Visa Type", type: "select", options: ["Tourist", "Work"], width: "col-span-4", isVisible: false },
        { id: "otherIdType", label: "Other ID Type", type: "text", value: "", width: "col-span-3", isVisible: false },
        { id: "otherIdValue", label: "Other ID Value", type: "text", value: "", width: "col-span-3", isVisible: false },
    ]);

    const [consultationDynamicFields, setConsultationDynamicFields] = useState([
        { id: "speciality", label: "Speciality", type: "select", options: ["Cardiology", "Dermatology", "Pediatrics", "Orthopedics"], width: "col-span-4", isVisible: false },
        { id: "consultationReason", label: "Consultation Reason", type: "textarea", width: "col-span-5", isVisible: false },
    ]);

    const [insuranceDynamicFields, setInsuranceDynamicFields] = useState([
        { id: "insurancePlan", label: "Insurance Plan", type: "select", options: ["Silver Plan", "Basic Health"], width: "col-span-4", isVisible: false },
        { id: "policynumber", label: "Policy Number", type: "number", width: "col-span-4", isVisible: false },
        { id: "policyExpiryDate", label: "Policy Expiry Date", type: "date", width: "col-span-4", isVisible: false },
    ]);

    const [consultationDetails, setConsultationDetails] = useState([
        { id: "consultationType", label: "Consultation Type", type: "select", options: ["General", "Specialist"], width: "col-span-2" },
        { id: "doctorName", label: "Doctor Name", type: "select", options: ["Dr. John Smith", "Dr. Sarah Connor", "Dr. Mark Robinson"], width: "col-span-2" },
        { id: "appointmentDate", label: "Appointment Date", type: "date", width: "col-span-2" },
    ]);

    const [paymentType, setPaymentType] = useState("");
    const [insuranceDetails, setInsuranceDetails] = useState({
        cardNumber: "",
        provider: "",
        subProvider: "",
    });

    const handleAddField = (fieldId, fieldGroup) => {
        if (fieldGroup === 'patientDetails') {
            setPatientDynamicFields((prev) =>
                prev.map((field) =>
                    field.id === fieldId ? { ...field, isVisible: true } : field
                )
            );
        } else if (fieldGroup === 'consultationDetails') {
            setConsultationDynamicFields((prev) =>
                prev.map((field) =>
                    field.id === fieldId ? { ...field, isVisible: true } : field
                )
            );
        } else {
            setInsuranceDynamicFields((prev) =>
                prev.map((field) =>
                    field.id === fieldId ? { ...field, isVisible: true } : field
                )
            );
        }
    };

    const handleRemoveField = (fieldId, fieldGroup) => {
        if (fieldGroup === 'patientDetails') {
            setPatientDynamicFields((prev) =>
                prev.map((field) =>
                    field.id === fieldId ? { ...field, isVisible: false } : field
                )
            );
        } else if (fieldGroup === 'consultationDetails') {
            setConsultationDynamicFields((prev) =>
                prev.map((field) =>
                    field.id === fieldId ? { ...field, isVisible: false } : field
                )
            );
        } else {
            setInsuranceDynamicFields((prev) =>
                prev.map((field) =>
                    field.id === fieldId ? { ...field, isVisible: false } : field
                )
            );
        }
    };

    const handleAddCustomField = (field) => {
        setPatientDynamicFields((prev) => [...prev, field]);
        setConsultationDynamicFields((prev) => [...prev, field]);
        setInsuranceDynamicFields((prev) => [...prev, field]);
    };

    const handleChange = (fieldId, value) => {
        const fieldGroups = [
            { fields: patientDynamicFields, setFields: setPatientDynamicFields },
            { fields: consultationDynamicFields, setFields: setConsultationDynamicFields },
            { fields: insuranceDynamicFields, setFields: setInsuranceDynamicFields },
            { fields: commonFields, setFields: setCommonFields },
            { fields: consultationDetails, setFields: setConsultationDetails }
        ];

        const group = fieldGroups.find((group) => group.fields.some((field) => field.id === fieldId));

        if (group) {
            group.setFields((prev) =>
                prev.map((field) => (field.id === fieldId ? { ...field, value } : field))
            );
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const commonData = commonFields.reduce((acc, field) => {
            acc[field.id] = field.value?.trim() || null;
            return acc;
        }, {});

        const patientData = patientDynamicFields
            .filter((field) => field.isVisible)
            .reduce((acc, field) => {
                acc[field.id] = field.value?.trim() || null;
                return acc;
            }, {});

        const consultationData = consultationDynamicFields
            .filter((field) => field.isVisible)
            .reduce((acc, field) => {
                acc[field.id] = field.value?.trim() || null;
                return acc;
            }, {});

        const insuranceData = insuranceDynamicFields
            .filter((field) => field.isVisible)
            .reduce((acc, field) => {
                acc[field.id] = field.value?.trim() || null;
                return acc;
            }, {});

        const consultationDetailsData = consultationDetails.reduce((acc, field) => {
            acc[field.id] = field.value?.trim() || null;
            return acc;
        }, {});

        if (paymentType === "Insurance") {
            if (!insuranceDetails.cardNumber || !insuranceDetails.provider || !insuranceDetails.subProvider) {
                alert("Please fill in all insurance details for Insurance payment type.");
                return;
            }
        }

        const formData = {
            ...commonData,
            ...patientData,
            ...consultationData,
            ...insuranceData,
            ...consultationDetailsData,
            paymentType: paymentType || null,
            insuranceDetails: paymentType === "Insurance" ? {
                cardNumber: insuranceDetails.cardNumber,
                provider: insuranceDetails.provider,
                subProvider: insuranceDetails.subProvider
            } : '',
         
            contactNumberMobile: commonData.contactNumberMobile,
            contactNumberWork: commonData.contactNumberWork,
    
            customFields: {
                ...Object.fromEntries(
                    Object.entries(commonData).filter(
                        ([key]) => key !== "contactNumberMobile" && key !== "contactNumberWork"
                    )
                ),
                ...patientData,
                ...consultationData,
                ...insuranceData,
                ...consultationDetailsData,
            }
        };

        try {
            // API call to submit data
            const response = await fetch("http://localhost:5000/api/patient-register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Patient registered successfully!", { position: "top-right" });

                // Reset fields upon successful submission
                setCommonFields((fields) => fields.map((field) => ({ ...field, value: "" })));
                setPatientDynamicFields((fields) =>
                    fields.map((field) => ({ ...field, value: "", isVisible: false }))
                );
                setConsultationDynamicFields((fields) =>
                    fields.map((field) => ({ ...field, value: "", isVisible: false }))
                );
                setInsuranceDynamicFields((fields) =>
                    fields.map((field) => ({ ...field, value: "", isVisible: false }))
                );
                setConsultationDetails((fields) => fields.map((field) => ({ ...field, value: "" })));
                setPaymentType("");
                setInsuranceDetails({
                    cardNumber: "",
                    provider: "",
                    subProvider: "",
                });
            } else {
                toast.error(data.message || "Failed to register patient", { position: "top-right" });
            }
        } catch (error) {
            console.error("Error registering patient:", error);
            toast.error("Something went wrong. Please try again later.", { position: "top-right" });
        }
    };

    const renderFields = (fields) => (
        <>
            <div className="grid grid-cols-12 gap-4">
                {fields.map((field) => (
                    <div key={field.id} className={`${field.width || "col-span-12"}`}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label}
                        </label>
                        {field.type === "select" ? (
                            <select
                                id={field.id}
                                value={field.value}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">Select {field.label}</option>
                                {field.options.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : field.type === "phone" ? (
                            <PhoneInput
                                country={"ae"}
                                value={field.value} 
                                onChange={(value) => handleChange(field.id, value)} 
                                enableSearch={true}
                                inputStyle={{
                                    width: "100%",
                                    borderRadius: "0.375rem",
                                    padding: "0.5rem",
                                    borderTopLeftRadius: "0.5rem"
                                }}
                            />
                        ) : (
                            <input
                                id={field.id}
                                type={field.type}
                                value={field.value}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none"
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );

    return (
        <main
            className="bg-gray-100 p-6 overflow-y-auto"
        >
            <form
                onSubmit={handleSubmit}
                className="max-w-8xl mx-auto bg-white rounded-lg shadow-lg p-8 flex-1"
            >
                <section>
                    <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
                    {renderFields(commonFields, handleChange)}
                    <div className="flex flex-row gap-4 mt-4">
                        {patientDynamicFields
                            .filter((field) => field.isVisible)
                            .map((field) => (
                                <div key={field.id} className="mb-4">
                                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                    {field.type === "select" ? (
                                        <select
                                            id={field.id}
                                            value={field.value}
                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none w-[300px]"
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
                                            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none w-[300px]"
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveField(field.id, 'patientDetails')}
                                        className="absolute ml-[-45px] mt-[-7px] text-red-500 hover:text-red-700"
                                    >
                                        <RemoveCircleIcon />
                                    </button>
                                </div>
                            ))}
                    </div>
                </section>

                <section className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Consultation Details</h2>
                    {renderFields(consultationDetails, handleChange)}
                    <div className="flex flex-row gap-4 mt-4">
                        {consultationDynamicFields
                            .filter((field) => field.isVisible)
                            .map((field) => (
                                <div key={field.id} className="mb-4 relative">
                                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>

                                    {field.type === "select" ? (
                                        <select
                                            id={field.id}
                                            value={field.value}
                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none w-[300px]"
                                        >
                                            <option value="">Select {field.label}</option>
                                            {field.options.map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.type === "checkbox" ? (
                                        <input
                                            type="checkbox"
                                            id={field.id}
                                            checked={field.value}
                                            onChange={(e) => handleChange(field.id, e.target.checked)}
                                            className="mt-1 p-1 rounded focus:ring-blue-500 focus:outline-none"
                                        />
                                    ) : field.type === "textarea" ? (
                                        <textarea
                                            id={field.id}
                                            value={field.value}
                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none w-[400px] h-[100px]"
                                        />
                                    ) : field.type === "file" && field.subType === "image" ? (
                                        <input
                                            type="file"
                                            id={field.id}
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(field.id, e.target.files[0])}
                                            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none w-[300px]"
                                        />
                                    ) : field.type === "file" && field.subType === "document" ? (
                                        <input
                                            type="file"
                                            id={field.id}
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => handleFileUpload(field.id, e.target.files[0])}
                                            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none w-[300px]"
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            id={field.id}
                                            value={field.value}
                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none w-[300px]"
                                        />
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveField(field.id, 'consultationDetails')}
                                        className="absolute ml-[-45px] mt-[-7px] text-red-500 hover:text-red-700"
                                    >
                                        <RemoveCircleIcon />
                                    </button>
                                </div>
                            ))}
                    </div>
                </section>

                <section className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Insurance Details</h2>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                            <select
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value)}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">Select Payment Type</option>
                                <option value="cash">Cash</option>
                                <option value="insurance">Insurance</option>
                                <option value="corporate">Corporate</option>
                            </select>
                        </div>
                    </div>

                    {paymentType === "insurance" && (
                        <div className="grid grid-cols-12 gap-4 mt-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Insurance Card Number
                                </label>
                                <input
                                    type="text"
                                    value={insuranceDetails.cardNumber}
                                    onChange={(e) =>
                                        setInsuranceDetails((prev) => ({
                                            ...prev,
                                            cardNumber: e.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Insurance Provider
                                </label>
                                <input
                                    type="text"
                                    value={insuranceDetails.provider}
                                    onChange={(e) =>
                                        setInsuranceDetails((prev) => ({
                                            ...prev,
                                            provider: e.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Insurance Sub Provider
                                </label>
                                <input
                                    type="text"
                                    value={insuranceDetails.subProvider}
                                    onChange={(e) =>
                                        setInsuranceDetails((prev) => ({
                                            ...prev,
                                            subProvider: e.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-row gap-4 mt-4">
                        {insuranceDynamicFields
                            .filter((field) => field.isVisible)
                            .map((field) => (
                                <div key={field.id} className="mb-4">
                                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                    {field.type === "select" ? (
                                        <select
                                            id={field.id}
                                            value={field.value}
                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none w-[300px]"
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
                                            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none w-[300px]"
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveField(field.id, 'insuranceDetails')}
                                        className="absolute ml-[-45px] mt-[-7px] text-red-500 hover:text-red-700"
                                    >
                                        <RemoveCircleIcon />
                                    </button>
                                </div>
                            ))}
                    </div>
                </section>

                <button className="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
                    Register Patient
                </button>
            </form>

            {/* "Add More Fields" Section */}
            <div className="mt-8 p-6 bg-white shadow-md rounded-md">
                <h2 className="text-xl font-bold text-black mb-4">Add More Fields</h2>

                {/* Dropdown to select the field group */}
                <div className="mb-4 grid grid-cols-12 gap-4">
                    <select
                        id="fieldGroup"
                        value={selectedFieldGroup}
                        onChange={(e) => setSelectedFieldGroup(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none w-[400px]"
                    >
                        <option value="patientDetails">Patient Details</option>
                        <option value="consultationDetails">Consultation Details</option>
                        <option value="insuranceDetails">Insurance Details</option>
                    </select>
                </div>
               
                <div className="flex flex-warp gap-4">
                    {selectedFieldGroup === 'patientDetails' &&
                        patientDynamicFields
                            .filter((field) => !field.isVisible)
                            .map((field) => (
                                <div
                                    key={field.id}
                                    className="flex w-[200px] items-center bg-black text-white px-4 py-2 rounded-md text-sm mb-2 gap-4 justify-between"
                                >
                                    <span>{field.label}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleAddField(field.id, 'patientDetails')}
                                        className="flex items-center text-white px-2 py-1 rounded-md text-sm hover:bg-gray-500"
                                    >
                                        <AddCircleIcon />
                                    </button>
                                </div>
                            )
                            )
                    }

                    {selectedFieldGroup === 'consultationDetails' &&
                        consultationDynamicFields
                            .filter((field) => !field.isVisible)
                            .map((field) => (
                                <div
                                    key={field.id}
                                    className="flex w-[200px] items-center bg-black text-white px-4 py-2 rounded-md text-sm mb-2 gap-4 justify-between"
                                >
                                    <span>{field.label}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleAddField(field.id, 'consultationDetails')}
                                        className="flex items-center text-white px-2 py-1 rounded-md text-sm hover:bg-gray-500"
                                    >
                                        <AddCircleIcon />
                                    </button>
                                </div>
                            )
                            )
                    }

                    {selectedFieldGroup === "insuranceDetails" &&
                        (insuranceDynamicFields
                            .filter((field) => !field.isVisible)
                            .map((field) => (
                                <div
                                    key={field.id}
                                    className="flex w-[200px] items-center bg-black text-white px-4 py-2 rounded-md text-sm mb-2 gap-4 justify-between"
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
                            )))
                    }
                </div>
            </div>

            {/* Custom Field Generator Section */}
            <CustomFieldGenerator 
                onAddField={handleAddCustomField} 
                setPatientDynamicFields={setPatientDynamicFields}
                setConsultationDynamicFields={setConsultationDynamicFields}
                setInsuranceDynamicFields={setInsuranceDynamicFields}
            />
        </main>
    );
};

export default PatientRegisterPage;
