import React from "react";
function Button({ name, bgColor, hoverColor, textColor, onClick, paddingY, paddingX, textSize, borderColor, border }) {
    return (
        <button
            className={`py-1 px-4 rounded-md w-fit md:min-w-20 md:${paddingX} ${paddingY} ${bgColor} ${textColor} ${textSize} ${borderColor} ${border} hover:${hoverColor}`}
            onClick={onClick}
        >
            {name}
        </button>
    );
}
export default Button;