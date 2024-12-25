import React from "react";

function TextInput({
    label,
    placeholder,
    name,
    value,
    onChange,
    type = "text",
    maxLength,
    minLength,
    required = false,
    readOnly = false,
    disabled = false,
}) {
    return (
        <div className="flex flex-col w-full">
            <label className="mb-1 font-normal text-sm text-gray-500">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="border rounded-md h-8 px-2 focus:outline-none"
                maxLength={maxLength}
                minLength={minLength}
                required={required}
                readOnly={readOnly}
                disabled={disabled}
            />
        </div>
    );
}

export default TextInput;