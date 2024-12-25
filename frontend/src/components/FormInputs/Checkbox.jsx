import React from "react";

function Checkbox({ label, name, value, onChange, required = false }) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                name={name}
                checked={value}
                onChange={onChange}
                required={required}
                className="h-4 w-4 accent-black cursor-pointer"
            />
            <label className="font-normal text-sm text-gray-500">{label}</label>
        </div>
    );
}

export default Checkbox;