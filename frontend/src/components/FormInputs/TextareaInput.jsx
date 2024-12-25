import React from "react";

function TextareaInput({ label, name, value, onChange, placeholder, required = false, }) {
    return (
        <div className="flex flex-col w-full">
            <label className="mb-1 font-normal text-sm text-gray-500">{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="border rounded-md p-2 h-20 focus:outline-none"
            />
        </div>
    );
}

export default TextareaInput;