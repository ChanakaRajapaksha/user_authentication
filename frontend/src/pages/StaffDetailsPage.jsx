import { useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { AiOutlineCloudUpload } from "react-icons/ai";
const StaffDetailsPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [file, setFile] = useState(null);

    const handleToggle = () => {
        setIsVisible(!isVisible);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="bg-gray-100 min-h-screen py-5">
            <div className="bg-white rounded-lg shadow-md mx-auto p-6 w-[95%] md:w-[90%] lg:w-[85%] xl:w-[95%]">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        Basic Information
                    </h2>

                    <div className="">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-2 rounded flex items-center space-x-2">
                            <IoMdAdd className="w-5 h-5 text-white" style={{ fontWeight: "bold" }} />
                            <span>Import Staff</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-col w-2/12">
                            <label className="block text-gray-700 font-bold mb-1">
                                Staff ID <span className="text-red-500">*</span>
                            </label>
                            <input type="text" className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>

                        <div className="flex flex-col w-2/12">
                            <label className="block text-gray-700 font-bold mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                id=""
                                value=""
                                className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
                            >
                                <option value="">Select</option>
                                <option value="Admin">Admin</option>
                                <option value="Accountant">Accountant</option>
                                <option value="Pharmacist">Pharmacist</option>
                                <option value="Pathologist">Pathologist</option>
                                <option value="Radiologist">Radiologist</option>
                                <option value="Super Admin">Super Admin</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Nurse">Nurse</option>
                            </select>
                        </div>

                        <div className="flex flex-col w-2/12">
                            <label
                                className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0 required">
                                Designation
                            </label>
                            <select
                                id=""
                                value=""
                                className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
                            >
                                <option value="">Select</option>
                                <option value="Admin">Admin</option>
                                <option value="Accountant">Accountant</option>
                                <option value="Pharmacist">Pharmacist</option>
                                <option value="Pathologist">Pathologist</option>
                                <option value="Radiologist">Radiologist</option>
                                <option value="Super Admin">Super Admin</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Nurse">Nurse</option>
                            </select>
                        </div>

                        <div className="flex flex-col w-2/12">
                            <label
                                className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">
                                Department
                            </label>
                            <select
                                id=""
                                value=""
                                className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
                            >
                                <option value="">Select</option>
                                <option value="Admin">Admin</option>
                                <option value="Accountant">Accountant</option>
                                <option value="Pharmacist">Pharmacist</option>
                                <option value="Pathologist">Pathologist</option>
                                <option value="Radiologist">Radiologist</option>
                                <option value="Super Admin">Super Admin</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Nurse">Nurse</option>
                            </select>
                        </div>

                        <div className="flex flex-col w-3/12">
                            <label
                                className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">
                                Specialist
                            </label>
                            <select
                                id=""
                                value=""
                                className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50"
                            >
                                <option value="">Select Specialist</option>
                                <option value="Admin">Admin</option>
                                <option value="Accountant">Accountant</option>
                                <option value="Pharmacist">Pharmacist</option>
                                <option value="Pathologist">Pathologist</option>
                                <option value="Radiologist">Radiologist</option>
                                <option value="Super Admin">Super Admin</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Nurse">Nurse</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Specialist</label>
                        <select className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 mr-4">
                            <option>Select Specialist</option>
                        </select>


                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0 required">First Name</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4" placeholder="Enter first name" />

                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Last Name</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter last name" />
                    </div>

                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Father Name</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4" placeholder="Enter father name" />

                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Mother Name</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter mother name" />
                    </div>

                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0 required">Gender</label>
                        <select className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 mr-4">
                            <option>Select</option>
                        </select>
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Marital Status</label>
                        <select className="shadow appearance-none border rounded w-2/12  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 mr-4">
                            <option>Select</option>
                        </select>

                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Blood Group</label>
                        <select className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50">
                            <option>Select</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0 required">Date of Birth</label>
                        <input type="date" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4" />
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Date of Joining</label>
                        <input type="date" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>




                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Phone</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4" placeholder="Enter phone number" />
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Emergency Contact</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter emergency contact" />
                    </div>


                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0 required">Email</label>
                        <input type="text" className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter email" />
                    </div>


                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Photo</label>
                        <input type="file" className="shadow border rounded w-11/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Current Address</label>
                        <textarea className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter current address"></textarea>
                    </div>
                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Permanent Address</label>
                        <textarea className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter permanent address"></textarea>
                    </div>
                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Qualification</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4" placeholder="Enter qualification" />
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Work Experience</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter work experience" />
                    </div>


                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Specialization</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4" placeholder="Enter specialization" />
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Note</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter note" />
                    </div>

                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Pan Number</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4" placeholder="Enter pan number" />
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">National Identification Number</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4" placeholder="Enter national identification number" />
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Local Identification Number</label>
                        <input type="text" className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter local identification number" />
                    </div>

                    <div className="flex flex-wrap items-center">
                        <label className="block text-gray-700 font-bold w-1/12 text-left mb-2 md:mb-0">Reference Contact</label>
                        <input type="text" className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter reference contact" />
                    </div>


                    <div className="space-y-4">
                        <div className="flex items-center cursor-pointer text-gray-700 hover:text-blue-500" onClick={handleToggle}>
                            <button className="text-xl font-bold mr-2 transition-transform transform">
                                {isVisible ? '-' : '+'}
                            </button>
                            <span className="font-bold">{isVisible ? 'Remove Details' : 'Add More Details'}</span>
                        </div>

                        <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
                            {isVisible && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Resume</label>
                                        <input type="file" id="resume" name="resume" className="mt-2 p-2 border rounded w-full" />
                                    </div>
                                    <div>
                                        <label htmlFor="joiningLetter" className="block text-sm font-medium text-gray-700">Joining Letter</label>
                                        <input type="file" id="joiningLetter" name="joiningLetter" className="mt-2 p-2 border rounded w-full" />
                                    </div>
                                    <div>
                                        <label htmlFor="resignationLetter" className="block text-sm font-medium text-gray-700">Resignation Letter</label>
                                        <input type="file" id="resignationLetter" name="resignationLetter" className="mt-2 p-2 border rounded w-full" />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="otherDocuments"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Other Documents
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="otherDocuments"
                                                name="otherDocuments"
                                                className="mt-2 p-2 border rounded w-full opacity-0 absolute inset-0 cursor-pointer"
                                                onChange={handleFileChange}
                                            />
                                            <div
                                                className="border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center py-5 cursor-pointer"
                                                onClick={() => document.getElementById("otherDocuments").click()} // Trigger file input click on container click
                                            >
                                                <AiOutlineCloudUpload className="w-10 h-10 text-gray-500" />
                                                <p className="text-gray-600 mt-2">
                                                    {file ? file.name : "Drop a file here or click"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="button-group">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default StaffDetailsPage;