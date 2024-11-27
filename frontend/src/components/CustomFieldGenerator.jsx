import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
const CustomFieldGenerator = ({ onAddField }) => {
    const [label, setLabel] = useState("");
    const [type, setType] = useState("text");
    const [width, setWidth] = useState("full");

    const handleAddCustomField = () => {
        if (!label) {
            toast.error("Label is required!", { position: "top-right" });
            return;
        }

        const newField = {
            id: `${label.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
            label,
            type,
            value: "",
            width,
        };

        onAddField(newField);
        setLabel("");
        setType("text");
        setWidth("full");
        toast.success("Custom field added successfully!", { position: "top-right" });
    };

    return (
        <div className="p-4 bg-gray-200 rounded-md">
            <h3 className="text-lg font-bold mb-4">Add Custom Field</h3>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Label Name
                    </label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Input Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="textarea">Textarea</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="select">Dropdown</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Width
                    </label>
                    <select
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                        <option value="full">Full Width</option>
                        <option value="half">Half Width</option>
                    </select>
                </div>
                <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
                >
                    Add Field
                    <AddCircleIcon className="ml-2" />
                </button>
            </div>
        </div>
    );
};

export default CustomFieldGenerator;
