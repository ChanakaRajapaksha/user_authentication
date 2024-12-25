import React from "react";

function DateInput({ label, name, value, onChange, required = false, disabled = false }) {
    return (
        <div className="flex flex-col w-full">
            <label className="mb-1 font-normal text-sm text-gray-500">{label}</label>
            <input
                type="date"
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="border rounded-md h-8 px-2 focus:outline-none"
            />
        </div>
    );
}

export default DateInput;