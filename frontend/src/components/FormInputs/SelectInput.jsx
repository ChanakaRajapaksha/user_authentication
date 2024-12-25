import React from "react";

function SelectInput({ label, name, value, onChange, options, select, required = false, disabled = false }) {
    return (
        <div className="flex flex-col w-full">
            <label className="mb-1 font-normal text-sm text-gray-500">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="border rounded-md h-8 px-2 bg-white font-normal text-black focus:outline-none"
            >
                <option value="" disabled>
                    {select}
                </option>
                {options.map((option, index) => (
                    <option key={index} value={option.value} className="w-40">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectInput;