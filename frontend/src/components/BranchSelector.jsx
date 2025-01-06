import React, { useState } from 'react';
import { ClipLoader } from "react-spinners";
import { motion } from 'framer-motion'; // Import framer-motion for animations

const BranchSelector = ({ branches, onSelectBranch, onClose }) => {
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleBranchClick = async (branch) => {
        setLoading(true);
        setTimeout(() => {
            setSelectedBranch(branch);
            onSelectBranch(branch);
        }, 800); 
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
    };

    return (
        <motion.div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.div
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md" 
                variants={modalVariants}
            >
                <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">Select Your Branch</h2>
                <ul className="space-y-4"> {/* Increased vertical spacing */}
                    {branches.map((branch) => (
                        <li key={branch.id}>
                            <motion.button
                                whileHover={{ scale: 1.02 }} 
                                whileTap={{ scale: 0.98 }} 
                                onClick={() => handleBranchClick(branch.name)}
                                className={`w-full py-2 px-2 border border-gray-300 rounded-lg
                                 bg-white text-gray-700 text-md font-medium
                                 hover:bg-gray-50 hover:border-gray-400
                                  text-left transition-colors duration-200 ease-in-out
                                  flex items-center justify-between
                                  ${selectedBranch === branch.name ? 'bg-blue-100 border-blue-300  font-semibold' : ''}`} 
                            >
                                <span>{branch.name}</span>
                                {loading && selectedBranch === branch.name && (
                                    <ClipLoader size={20} color={"#2563eb"} />
                                )}

                            </motion.button>
                        </li>
                    ))}
                </ul>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-black px-4 py-2 text-white border border-gray-300 rounded transition-colors duration-200 ease-in-out"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BranchSelector;