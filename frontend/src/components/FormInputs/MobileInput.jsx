import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../../assets/styles/Mobile2.css"

function MobileInput({ label, placeholder, name, value, onChange, required = false, disabled = false }) {
    return (
        <div className="abcd flex flex-col w-full">
            <label className="mb-1 font-normal text-sm text-gray-500">{label}</label>
            <PhoneInput
                country={"ae"} // Default country (can be changed)
                value={value} // Phone number value (state in the parent component)
                onChange={(phone) => onChange({ target: { name, value: phone } })} // Format to mimic native event
                placeholder={placeholder}
                required={required} // Validate manually in the parent component
                disabled={disabled}
                enableSearch={true} // Adds search functionality in the dropdown
                inputStyle={{
                    height: "2rem"
                }}
            />
        </div>
    );
}

export default MobileInput;