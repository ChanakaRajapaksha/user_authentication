import React, { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { toast } from "react-toastify";
import TextInput from "./FormInputs/TextInput";
import SelectInput from "./FormInputs/SelectInput";

const CustomField = ({ onAddField }) => {
    const [label, setLabel] = useState("");
    const [type, setType] = useState("text");
    const [options, setOptions] = useState("");
    const [radioCount, setRadioCount] = useState("");
    const [radioOptions, setRadioOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("patientDetails");

    const handleAddCustomField = async () => {
        if (!label) {
            toast.error("Label is required!", { position: "top-right" });
            return;
        }

        setLoading(true);

        try {
            const newField = {
                field_name: label,
                field_type: type,
                dropdown_options:
                    type === "select"
                        ? options.split(",").map((option) => option.trim())
                        : null,
                radio_buttons:
                    type === "radio" && radioOptions.length
                        ? radioOptions.map((option) => option.trim())
                        : null,
                category: selectedCategory, 
            };

            const response = await fetch(
                'http://localhost:5000/dynamic/add-dynamic-fields',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify([newField]),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const addedField = {
                    ...newField,
                    id: data.data[0].id,
                };
                onAddField(addedField);

                setLabel("");
                setType("text");
                setOptions("");
                setRadioCount("");
                setRadioOptions([]);

                toast.success("Custom field added successfully!", {
                    position: "top-right",
                });
            } else {
                toast.error("Failed to add custom field", { position: "top-right" });
            }
        } catch (error) {
            console.error("Error adding custom field:", error);
            toast.error("Failed to add custom field", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateRadioFields = (count) => {
        const radios = Array.from({ length: count }, (_, i) => `Option ${i + 1}`);
        setRadioOptions(radios);
    };

    const handleRadioOptionChange = (index, value) => {
        const updatedOptions = [...radioOptions];
        updatedOptions[index] = value;
        setRadioOptions(updatedOptions);
    };

    return (
        <div className="mt-8 p-6 bg-gray-200 shadow-md rounded-md">
            <h2 className="text-xl text-black font-semibold mb-4">Add Custom Field</h2>
            <div className="flex justify-start gap-4">
                <div className="flex flex-row w-full gap-5">
                    <SelectInput
                        label="Category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        options={[
                            { value: "patientDetails", label: "Patient Details" },
                            { value: "consultationDetails", label: "Consultation Details" },
                            { value: "paymentDetails", label: "Insurance Details" },
                        ]}
                    />

                    <TextInput
                        label="Label Name"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />

                    <SelectInput
                        label="Input Type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        select="Select Input Type"
                        options={[
                            { value: "text", label: "Text" },
                            { value: "number", label: "Number" },
                            { value: "email", label: "Email" },
                            { value: "password", label: "Password" },
                            { value: "date", label: "Date" },
                            { value: "textarea", label: "Textarea" },
                            { value: "checkbox", label: "Checkbox" },
                            { value: "radio", label: "Radio Button" },
                            { value: "select", label: "Dropdown" },
                            { value: "image", label: "Upload Image" },
                            { value: "file", label: "Upload Document" },
                        ]}
                    />

                    {type === "select" && (
                        <TextInput
                            label="Dropdown Options (comma-separated)"
                            value={options}
                            onChange={(e) => setOptions(e.target.value)}
                            placeholder="e.g., Option 1, Option 2, Option 3"
                        />
                    )}

                    {type === "radio" && (
                        <TextInput
                            label="Number of Radio Buttons"
                            type="number"
                            value={radioCount}
                            onChange={(e) => {
                                setRadioCount(e.target.value);
                                handleGenerateRadioFields(e.target.value);
                            }}
                        />
                    )}

                    {type === "radio" && radioOptions.map((option, index) => (
                        <div key={index}>
                            <TextInput
                                label={`Radio Option ${index + 1}`}
                                value={option}
                                onChange={(e) => handleRadioOptionChange(index, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button
                type="button"
                onClick={handleAddCustomField}
                className={`mt-8 bg-black text-white font-semibold rounded py-2 px-4 flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
            >
                {loading ? "Adding..." : "Add Field"}
                <IoMdAddCircle className="ml-2" />
            </button>
        </div>
    );
};

export default CustomField;
