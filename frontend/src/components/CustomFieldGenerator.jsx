import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";

const CustomFieldGenerator = ({ 
    onAddField,
    setPatientDynamicFields,
    setConsultationDynamicFields,
    setInsuranceDynamicFields,
 }) => {
    const [label, setLabel] = useState("");
    const [type, setType] = useState("text");
    const [width, setWidth] = useState("full");
    const [options, setOptions] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("patientDetails");

    const handleAddCustomField = () => {
        if (!label) {
            toast.error("Label is required!", { position: "top-right" });
            return;
        }

        const newField = {
            id: `${label.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
            label,
            type,
            value: type === "select" ? [] : "",
            width,
            ...(type === "select" && { options: options.split(",").map((opt) => opt.trim()) }),
            category: selectedCategory, 
            isVisible: false,
        };

        if (selectedCategory === "patientDetails") {
            setPatientDynamicFields((prev) => [...prev, newField]);
        } else if (selectedCategory === "consultationDetails") {
            setConsultationDynamicFields((prev) => [...prev, newField]);
        } else if (selectedCategory === "insuranceDetails") {
            setInsuranceDynamicFields((prev) => [...prev, newField]);
        }

        toast.success("Custom field added successfully!", { position: "top-right" });
    };

    return (
        <div className="mt-8 p-6 bg-white shadow-md rounded-md">
            <h3 className="text-lg font-bold mb-4">Add Custom Field</h3>
            <div className="flex justify-start gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mt-1 w-[250px] p-2 border border-gray-300 rounded-lg focus:outline-none"
                    >
                        <option value="patientDetails">Patient Details</option>
                        <option value="consultationDetails">Consultation Details</option>
                        <option value="insuranceDetails">Insurance Details</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Label Name
                    </label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Input Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1 w-[250px] p-2 border border-gray-300 rounded-lg focus:outline-none"
                    >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="password">Password</option>
                        <option value="date">Date</option>
                        <option value="textarea">Textarea</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="select">Dropdown</option>
                        <option value="image">Upload Image</option>
                        <option value="file">Upload Document</option>
                    </select>
                </div>

                {type === "select" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Dropdown Options (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={options}
                            onChange={(e) => setOptions(e.target.value)}
                            placeholder="e.g., Option 1, Option 2, Option 3"
                            className="mt-1 w-[280px] p-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Width
                    </label>
                    <select
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="mt-1 w-[200px] p-2 border border-gray-300 rounded-lg focus:outline-none"
                    >
                        <option value="full">Full Width</option>
                        <option value="half">Half Width</option>
                    </select>
                </div>
            </div>

            <button
                type="button"
                onClick={() => handleAddCustomField()}
                className="mt-8 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 flex items-center justify-center"
            >
                Add Field
                <AddCircleIcon className="ml-2" />
            </button>
        </div>
    );
};



export default CustomFieldGenerator;
