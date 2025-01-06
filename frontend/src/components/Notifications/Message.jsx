import React from 'react';
import ModalComponent from './ModalComponent';
import { FaCheckCircle, FaExclamation } from 'react-icons/fa';

function Message({ isVisible, onClose, msg, type }) {
    const getMessageStyle = () => {
        if (type === 'success') {
            return {
                borderColor: 'green-500',
                textColor: 'green-500',
                buttonColor: 'green-500',
                transform: '',
                icon: <FaCheckCircle />,
            };
        } else if (type === 'error') {
            return {
                borderColor: 'red-500',
                textColor: 'red-500',
                buttonColor: 'red-500',
                transform: 'transform rotate-180',
                icon: <FaExclamation />,
            };
        } else {
            return {
                borderColor: 'blue-500',
                textColor: 'blue-500',
                buttonColor: 'red-500',
                transform: '',
                icon: <FaExclamation />,
            };
        }
    };

    const { borderColor, textColor, buttonColor, icon, transform } = getMessageStyle();

    if (!isVisible) return null;
    return (
        <ModalComponent isVisible={isVisible} onClose={onClose}>
            <div className={`bg-white p-5 flex flex-col justify-center items-center gap-8 rounded-xl max-w-[500px]`}>
                <div className={`border-4 p-2 rounded-full border-${borderColor} text-${textColor} ${transform}`}>
                    {/* <FaExclamation /> */}
                    {icon}
                </div>
                <h1 className={`font-bold text-xl px-8 text-center text-${textColor}`}>{msg}</h1>
                <div className='flex flex-row w-full gap-5'>
                    <button className={`bg-${buttonColor} text-white w-full py-2 rounded-lg`} onClick={onClose}>Close</button>
                </div>
            </div>
        </ModalComponent>
    )
}
export default Message;