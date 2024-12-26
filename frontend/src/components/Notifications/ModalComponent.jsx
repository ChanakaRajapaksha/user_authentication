import React from "react";

function ModalComponent({ isVisible, onClose, children }) {
    if (!isVisible) return null;
    return (
        <div className="fixed h-full inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center pt-5 z-20">
            {children}
        </div>
    );
}
export default ModalComponent;