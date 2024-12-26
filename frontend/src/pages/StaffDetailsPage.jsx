import { useState, useEffect } from "react";
import { IoMdAdd, IoIosRemoveCircle } from "react-icons/io";
import { AiOutlineCloudUpload } from "react-icons/ai";
import CustomField from "../components/CustomField";
import { toast } from "react-toastify";
// import Header from "../components/Header";
// import HeaderCardSection from "../components/HeaderCardSection";
// import PatientCardSection from "../components/PatientCardSection";
import { IoIosArrowDown } from "react-icons/io";

import TextInput from "../components/FormInputs/TextInput";
import Button from "../components/Button";
import SelectInput from "../components/FormInputs/SelectInput";
import DateInput from "../components/FormInputs/DateInput";
import MobileInput from "../components/FormInputs/MobileInput";
import Checkbox from "../components/FormInputs/Checkbox";
import TextareaInput from "../components/FormInputs/TextareaInput";
const StaffDetailsPage = () => {
    const initialDeductibleCopayData = {
        Consultation: {
            deductible: "",
            deductibleType: "all",
            copay: "",
            copayType: "all",
            min: "",
            max: "",
        },
        Lab: {
            deductible: "",
            deductibleType: "all",
            copay: "",
            copayType: "all",
            min: "",
            max: "",
        },
        Radiology: {
            deductible: "",
            deductibleType: "all",
            copay: "",
            copayType: "all",
            min: "",
            max: "",
        },
        Treatment: {
            deductible: "",
            deductibleType: "all",
            copay: "",
            copayType: "all",
            min: "",
            max: "",
        },
        Medicine: {
            deductible: "",
            deductibleType: "all",
            copay: "",
            copayType: "all",
            min: "",
            max: "",
        },
        Dental: {
            deductible: "",
            deductibleType: "all",
            copay: "",
            copayType: "all",
            min: "",
            max: "",
        },
        Maternity: {
            deductible: "",
            deductibleType: "all",
            copay: "",
            copayType: "all",
            min: "",
            max: "",
        },
    };

    const [patientData, setPatientData] = useState({
        insuranceId: "",
        visitType: "Consultation",
        referralCase: "",
        referredBy: "",
        existing: "",
        patientType: "",
        registrationDate: "",
        patientPriority: "",
        patientFullName: "",
        dob: "",
        age: "",
        gender: "",
        nationality: "",
        emailId: "",
        maritalStatus: "",
        visaType: "",
        nationalId: "",
        idType: "",
        idNumber: "",
        mobile: "",
        work: "",
        landPhone: "",
        wMobile: "",
        preferredLanguage: "",
        occupation: "",
        infoSource: "",
        emirates: "",
        place: "",
        mainDistrict: "",
        district: "",
        area: "",
        address: "",
        hasanaId: "",
        companyName: "",
        empId: "",
        patientRemark: "",
        emPerson: "",
        emNumber: "",
        relationship: "",
        alert: "",
        specialty: "",
        doctorName: "",
        encounterType: "",
        paymentType: "",
        insuranceProvider: "",
        subInsurance: "",
        networkType: "",
        insuranceCardNumber: "",
        extraCardNumber: "",
        insuranceEffectiveDate: "",
        insuranceExpiryDate: "",
        certificateNo: "",
        dependentsNo: "",
        insuranceClaimNo: "",
        maxInsuranceLiability: "",
        insuranceApprovalLimit: "",
        maxInsuranceCoPay: "",
        coPayPatient: "",
        deductibles: { ...initialDeductibleCopayData },
    });

    const [verificationResult, setVerificationResult] = useState("");
    const [customFields, setCustomFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [consultationFeeMessage, setConsultationFeeMessage] = useState("");
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const availableLanguages = ["English", "Arabic", "Spanish"];
    const [insuranceTableData, setInsuranceTableData] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null); // Track which row is being edited

    // Format current date and time
    const formatDateTime = () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        const day = now.getDate().toString().padStart(2, "0");
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const year = now.getFullYear();

        return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
    };

    useEffect(() => {
        // Set the initial system date and time if not already set
        if (!patientData.registrationDate) {
            const formattedDateTime = formatDateTime();
            setPatientData((prevData) => ({
                ...prevData,
                registrationDate: formattedDateTime,
            }));
        }
    }, [patientData.registrationDate]);

    // Function to calculate age based on DOB
    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let ageInYears = today.getFullYear() - birthDate.getFullYear();
        let ageInMonths = today.getMonth() - birthDate.getMonth();
        let ageInDays = today.getDate() - birthDate.getDate();

        if (ageInMonths < 0) {
            ageInYears--;
            ageInMonths += 12;
        }
        if (ageInDays < 0) {
            ageInMonths--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            ageInDays += lastMonth.getDate();
        }

        return `${ageInYears} years, ${ageInMonths} months, ${ageInDays} days`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Update age when dob changes
    useEffect(() => {
        if (patientData.dob) {
            const age = calculateAge(patientData.dob);
            setPatientData((prevData) => ({
                ...prevData,
                age: age,
            }));
        }
    }, [patientData.dob]);

    // Function to copy mobile number
    const copyMobileNumber = () => {
        setPatientData((prevData) => ({
            ...prevData,
            wMobile: prevData.mobile, // Copy mobile number to WhatsApp field
        }));
    };

    // Function to add a preferred language
    const handleAddRemoveLanguage = (language) => {
        if (selectedLanguages.includes(language)) {
            setSelectedLanguages((prev) => prev.filter((lang) => lang !== language));
        } else {
            setSelectedLanguages((prev) => [...prev, language]);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const checkConsultationFee = (doctorName) => {
        const doctorsWithoutFee = ["Dr. One", "Dr. Two"]; // Add doctors without a fee here
        if (doctorsWithoutFee.includes(doctorName)) {
            setConsultationFeeMessage(
                `New Consultation Fee NOT set for Doctor ${doctorName}`
            );
        } else {
            setConsultationFeeMessage("");
        }
    };

    //Function to handle new custom fields data
    const handleAddField = (newField) => {
        if (
            newField.field_type === "radio" &&
            (!newField.radio_buttons || newField.radio_buttons.length === 0)
        ) {
            newField.radio_buttons = ["Option 1", "Option 2"]; // Ensure default 2 options
        }

        setCustomFields((prevFields) => {
            const updatedFields = [...prevFields, newField];
            localStorage.setItem("customFields", JSON.stringify(updatedFields));
            return updatedFields;
        });
    };

    const handleRemoveField = async (id) => {
        try {
            // Send DELETE request to your backend using fetch
            const response = await fetch(
                `http://localhost:5000/dynamic/add-dynamic-fields/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                setCustomFields((prevFields) => {
                    const updatedFields = prevFields.filter((field) => field.id !== id);
                    localStorage.setItem("customFields", JSON.stringify(updatedFields));
                    return updatedFields;
                });
                toast.success("Custom field deleted successfully", {
                    position: "top-right",
                });
            } else {
                toast.error("Failed to delete custom field", { position: "top-right" });
            }
        } catch (error) {
            console.error("Error deleting custom field:", error);
            toast.error("Failed to delete custom field", { position: "top-right" });
        }
    };

    const handleVerifyInsurance = async () => {
        if (!insuranceId || insuranceId.length !== 25) {
            toast.error("Please enter a valid 25-digit insurance ID.", {
                position: "top-right",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/insurance/verify', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ insuranceId }),
            });

            if (response.ok) {
                const data = await response.json();
                setVerificationResult(data.message);
                toast.success(data.message, { position: "top-right" });
            } else {
                const errorData = await response.json();
                setVerificationResult(errorData.message);
                toast.error(errorData.message, { position: "top-right" });
            }
        } catch (error) {
            console.error("Error verifying insurance:", error);
            toast.error("Failed to verify insurance. Please try again.", {
                position: "top-right",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedFields = localStorage.getItem("customFields");
        if (storedFields) {
            setCustomFields(JSON.parse(storedFields));
        }
    }, []);

    const handleSave = async () => {
        setLoading(true);

        try {
            const dynamicFieldData = {};

            customFields.forEach((field) => {
                const inputElement = document.querySelector(
                    `[name="${field.field_name}"]`
                );
                dynamicFieldData[field.field_name] = inputElement?.value || "";
            });

            const requestBody = {
                ...patientData,
                dynamicFieldData,
            };

            const response = await fetch('http://localhost:5000/dynamic/add-staff-dynamic', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("staff data saved:", data);

                setPatientData({
                    insuranceId: "",
                    visitType: "",
                    referralCase: "",
                    referredBy: "",
                    existing: "",
                    patientType: "",
                    registrationDate: "",
                    patientPriority: "",
                    patientFullName: "",
                    dob: "",
                    age: "",
                    gender: "",
                    nationality: "",
                    emailId: "",
                    maritalStatus: "",
                    visaType: "",
                    nationalId: "",
                    idType: "",
                    idNumber: "",
                    mobile: "",
                    work: "",
                    landPhone: "",
                    wMobile: "",
                    preferredLanguage: "",
                    occupation: "",
                    infoSource: "",
                    emirates: "",
                    place: "",
                    mainDistrict: "",
                    district: "",
                    area: "",
                    address: "",
                    hasanaId: "",
                    companyName: "",
                    empId: "",
                    patientRemark: "",
                    emPerson: "",
                    emNumber: "",
                    relationship: "",
                    alert: "",
                    specialty: "",
                    doctorName: "",
                    encounterType: "",
                });
                // Reset all custom fields
                setCustomFields([]);
                localStorage.removeItem("customFields");

                toast.success("Staff member added successfully", {
                    position: "top-right",
                });
            } else {
                const errorData = await response.json();
                console.log("Error saving staff data:", errorData);
                toast.error(
                    `Failed to save staff data. ${errorData.message || "Please check the console for errors."
                    }`,
                    { position: "top-right" }
                );
            }
        } catch (error) {
            console.error("Error saving staff data:", error);
            toast.error(
                `Failed to save staff data. ${error.message || "Please check the console for errors."
                }`,
                { position: "top-right" }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleInputChangeForInsurance = (e) => {
        const { name, value } = e.target;
        // Check if the field belongs to deductibles
        if (name.startsWith("deductibles_")) {
            const [_, category, field] = name.split("_"); // Parse name to extract category and field
            setPatientData((prev) => ({
                ...prev,
                deductibles: {
                    ...prev.deductibles,
                    [category]: {
                        ...prev.deductibles[category],
                        [field]: value,
                    },
                },
            }));
        } else {
            // Handle non-deductibles fields
            setPatientData({ ...patientData, [name]: value });
        }
    };

    const handleAddInsurance = () => {
        setLoading(true);

        setTimeout(() => {
            // Add the entered insurance details to the table data
            setInsuranceTableData([...insuranceTableData, patientData]);

            // Clear the fields, including deductibles
            setPatientData({
                paymentType: patientData.paymentType,
                insuranceProvider: "",
                subInsurance: "",
                networkType: "",
                insuranceCardNumber: "",
                extraCardNumber: "",
                insuranceEffectiveDate: "",
                insuranceExpiryDate: "",
                certificateNo: "",
                dependentsNo: "",
                insuranceClaimNo: "",
                maxInsuranceLiability: "",
                insuranceApprovalLimit: "",
                maxInsuranceCoPay: "",
                coPayPatient: "",
                deductibles: { ...initialDeductibleCopayData }, // Reset deductibles to the initial state
            });

            setLoading(false);
        }, 500);
    };

    // Handle edit data in insurance details table
    const handleEditClick = (index) => {
        setEditingIndex(index);
        const selectedData = insuranceTableData[index];
        setPatientData({ ...selectedData }); // Include deductibles in the edit data
    };

    // Handle save edit data in insurance table
    const handleSaveEdit = () => {
        const updatedData = [...insuranceTableData];
        updatedData[editingIndex] = patientData; // Save the updated data, including deductibles
        setInsuranceTableData(updatedData);
        setEditingIndex(null);

        // Reset fields, including deductibles
        setPatientData({
            paymentType: patientData.paymentType,
            insuranceProvider: "",
            subInsurance: "",
            networkType: "",
            insuranceCardNumber: "",
            extraCardNumber: "",
            insuranceEffectiveDate: "",
            insuranceExpiryDate: "",
            certificateNo: "",
            dependentsNo: "",
            insuranceClaimNo: "",
            maxInsuranceLiability: "",
            insuranceApprovalLimit: "",
            maxInsuranceCoPay: "",
            coPayPatient: "",
            deductibles: { ...initialDeductibleCopayData }, // Reset deductibles to the initial state
        });
    };

    // Handle cancel edit in insurance table
    const handleCancelEdit = () => {
        setEditingIndex(null);

        // Reset fields, including deductibles
        setPatientData({
            paymentType: patientData.paymentType,
            insuranceProvider: "",
            subInsurance: "",
            networkType: "",
            insuranceCardNumber: "",
            extraCardNumber: "",
            insuranceEffectiveDate: "",
            insuranceExpiryDate: "",
            certificateNo: "",
            dependentsNo: "",
            insuranceClaimNo: "",
            maxInsuranceLiability: "",
            insuranceApprovalLimit: "",
            maxInsuranceCoPay: "",
            coPayPatient: "",
            deductibles: { ...initialDeductibleCopayData }, // Reset deductibles to the initial state
        });
    };

    // Filter custom fields by category
    const patientDetailFields = customFields.filter(
        (field) => field.category === "patientDetails"
    );
    const consultationFields = customFields.filter(
        (field) => field.category === "consultationDetails"
    );
    const paymentFields = customFields.filter(
        (field) => field.category === "paymentDetails"
    );

    return (
        <div className="bg-gray-50">
            <div className="flex flex-col m-5">
                <div className="min-h-screen py-10 px-2">
                    <div className="bg-white rounded-lg shadow-md mx-auto p-6 w-[95%] md:w-[90%] lg:w-[90%] xl:w-[95%]">
                        <h2 className="text-xl font-semibold mb-6 text-black">
                            Insurance Eligibility Check
                        </h2>

                        <div className="space-y-4">
                            <div className="flex flex-row w-1/3 gap-5">
                                <TextInput
                                    name="insuranceId"
                                    placeholder="Enter 25-digit Insurance ID"
                                    value={patientData.insuranceId}
                                    onChange={handleInputChange}
                                    maxLength={25}
                                />
                                <Button
                                    name={loading ? "Verifying..." : "Verify"}
                                    bgColor="bg-gray-200"
                                    textColor="text-gray-600"
                                    hoverColor="bg-gray-400"
                                    paddingY="h-[38px]"
                                    onClick={handleVerifyInsurance}
                                    disabled={loading}
                                />
                                {verificationResult && (
                                    <div
                                        className={`mt-4 p-4 rounded ${verificationResult.includes("success")
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {verificationResult}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 mt-8">
                            <h2 className="text-xl text-gray-500 font-semibold mb-4">
                                Patient Details
                            </h2>
                            <div className="flex flex-row w-full gap-5">
                                <SelectInput
                                    label="Visit Type *"
                                    name="visitType"
                                    value={patientData.visitType}
                                    onChange={handleInputChange}
                                    options={[
                                        { value: "Consultation", label: "Consultation" },
                                        { value: "Non-Consultation", label: "Non-Consultation" },
                                    ]}
                                    select="Select a visit type"
                                    required={true}
                                />

                                <SelectInput
                                    label="Referral Case"
                                    name="referralCase"
                                    value={patientData.referralCase}
                                    onChange={handleInputChange}
                                    select="Select"
                                    options={[
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" },
                                    ]}
                                />

                                <TextInput
                                    label="Referred By"
                                    name="referredBy"
                                    value={patientData.referredBy}
                                    onChange={handleInputChange}
                                    maxLength={100}
                                />
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <SelectInput
                                    label="Existing *"
                                    name="existing"
                                    value={patientData.existing}
                                    onChange={handleInputChange}
                                    select="Select"
                                    required={true}
                                    options={[
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" },
                                    ]}
                                />

                                <SelectInput
                                    label="Patient Type"
                                    name="patientType"
                                    value={patientData.patientType}
                                    onChange={handleInputChange}
                                    select="Select Patient Type"
                                    options={[
                                        { value: "Normal", label: "Normal" },
                                        { value: "Recruitment", label: "Recruitment" },
                                        { value: "Pre-Employment", label: "Pre-Employment" },
                                        { value: "VIP", label: "VIP" },
                                        { value: "VVIP", label: "VVIP" },
                                        { value: "Determination", label: "Determination" },
                                        { value: "Yugen Member", label: "Yugen Member" },
                                    ]}
                                />

                                <TextInput
                                    label="Registration Date"
                                    name="registrationDate"
                                    value={patientData.registrationDate}
                                    onChange={handleInputChange}
                                    maxLength={100}
                                    readOnly
                                />

                                <SelectInput
                                    label="Patient Priority *"
                                    name="patientPriority"
                                    value={patientData.patientPriority}
                                    onChange={handleInputChange}
                                    select="Select Patient Priority"
                                    required={true}
                                    options={[
                                        { value: "Normal", label: "Normal" },
                                        { value: "VIP", label: "VIP" },
                                        { value: "VVIP", label: "VVIP" },
                                        { value: "Package", label: "Package" },
                                    ]}
                                />
                            </div>

                            <div className="flex flex-row w-[60%] gap-5">
                                <TextInput
                                    label="Patient Full Name *"
                                    name="patientFullName"
                                    value={patientData.patientFullName}
                                    onChange={handleInputChange}
                                    maxLength={100}
                                    minLength={50}
                                    required={true}
                                />
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <DateInput
                                    label="Date of Birth *"
                                    id="dob"
                                    name="dob"
                                    value={patientData.dob}
                                    onChange={handleInputChange}
                                    required={true}
                                />

                                <TextInput
                                    label="Age *"
                                    name="age"
                                    value={patientData.age}
                                    onChange={handleInputChange}
                                    required
                                    readOnly
                                />

                                <SelectInput
                                    label="Gender *"
                                    name="gender"
                                    value={patientData.gender}
                                    onChange={handleInputChange}
                                    select="Select"
                                    required
                                    options={[
                                        { value: "Male", label: "Male" },
                                        { value: "Female", label: "Female" },
                                    ]}
                                />

                                <TextInput
                                    label="Nationality *"
                                    name="nationality"
                                    value={patientData.nationality}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <TextInput
                                    label="Email ID *"
                                    name="emailId"
                                    value={patientData.emailId}
                                    onChange={handleInputChange}
                                    maxLength={50}
                                    required
                                />

                                <SelectInput
                                    label="Marital Status *"
                                    name="maritalStatus"
                                    value={patientData.maritalStatus}
                                    onChange={handleInputChange}
                                    select="Select"
                                    required
                                    options={[
                                        { value: "Single", label: "Single" },
                                        { value: "Married", label: "Married" },
                                        { value: "Divorce", label: "Divorce" },
                                        { value: "Separated", label: "Separated" },
                                        { value: "Widow", label: "Widow" },
                                        { value: "Other", label: "Other" },
                                    ]}
                                />

                                <SelectInput
                                    label="Visa Type *"
                                    name="visaType"
                                    value={patientData.visaType}
                                    onChange={handleInputChange}
                                    select="Select"
                                    required
                                    options={[
                                        { value: "Local", label: "Local" },
                                        { value: "Resident", label: "Resident" },
                                        { value: "Visitor", label: "Visitor" },
                                    ]}
                                />
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <TextInput
                                    label="National ID *"
                                    name="nationalId"
                                    value={patientData.nationalId}
                                    onChange={handleInputChange}
                                    maxLength={20}
                                    minLength={15}
                                    required
                                />

                                <SelectInput
                                    label="ID Type *"
                                    name="idType"
                                    value={patientData.idType}
                                    onChange={handleInputChange}
                                    required
                                    options={[
                                        { value: "Passport", label: "Passport" },
                                        { value: "GCC ID", label: "GCC ID" },
                                        { value: "Driving License", label: "Driving License" },
                                    ]}
                                    select="Select ID Type"
                                />

                                <TextInput
                                    label="ID Number *"
                                    name="idNumber"
                                    value={patientData.idNumber}
                                    onChange={handleInputChange}
                                    maxLength={20}
                                    minLength={15}
                                    required
                                />
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <MobileInput
                                    label="Contact Number (Mobile) *"
                                    name="mobile"
                                    value={patientData.mobile}
                                    onChange={handleInputChange}
                                    maxLength={15}
                                    required
                                />

                                <MobileInput
                                    label="Contact Number (Work)"
                                    name="work"
                                    value={patientData.work}
                                    onChange={handleInputChange}
                                    maxLength={15}
                                />

                                <MobileInput
                                    label="Land Phone"
                                    name="landPhone"
                                    value={patientData.landPhone}
                                    onChange={handleInputChange}
                                    maxLength={15}
                                />

                                <MobileInput
                                    label="WhatsApp Mobile"
                                    name="wMobile"
                                    value={patientData.wMobile}
                                    onChange={handleInputChange}
                                    maxLength={15}
                                />

                                <div className="mt-6 flex items-center">
                                    <Checkbox onChange={copyMobileNumber} />
                                </div>
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <div className="relative w-full max-w-md">
                                    <label className="mb-1 font-normal text-sm text-gray-500">
                                        Preferred Languages
                                    </label>
                                    <div
                                        className="flex items-center justify-between border rounded-md px-3 h-8 bg-white cursor-pointer"
                                        onClick={toggleDropdown}
                                    >
                                        <div className="flex flex-wrap gap-2">
                                            {selectedLanguages.length > 0 ? (
                                                selectedLanguages.map((language, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-100 text-black text-sm rounded px-2"
                                                    >
                                                        {language}
                                                        <button
                                                            onClick={() => handleAddRemoveLanguage(language)}
                                                            className="ml-2 text-red-500 hover:text-red-700"
                                                        >
                                                            &#10005; {/* Cross Icon */}
                                                        </button>
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-black">Select Languages</span>
                                            )}
                                        </div>
                                        <span className="text-black -mr-2 text-md font-bold">
                                            <IoIosArrowDown />
                                        </span>
                                    </div>

                                    {dropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 border bg-white rounded shadow-lg z-10">
                                            {availableLanguages.map((language) => (
                                                <div
                                                    key={language}
                                                    className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedLanguages.includes(language)
                                                        ? "bg-gray-200"
                                                        : ""
                                                        }`}
                                                    onClick={() => handleAddRemoveLanguage(language)}
                                                >
                                                    <span>{language}</span>
                                                    {selectedLanguages.includes(language) && (
                                                        <span className="text-green-500">&#10003;</span> // Check Icon
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <TextInput
                                    label="Occupation *"
                                    name="occupation"
                                    value={patientData.occupation}
                                    onChange={handleInputChange}
                                    maxLength={50}
                                    required
                                />

                                <SelectInput
                                    label="Info. Source *"
                                    name="infoSource"
                                    value={patientData.infoSource}
                                    onChange={handleInputChange}
                                    required
                                    options={[
                                        { value: "Info 1", label: "Info 1" },
                                        { value: "Info 2", label: "Info 2" },
                                        { value: "Info 3", label: "Info 3" },
                                    ]}
                                />

                                <SelectInput
                                    label="Emirates *"
                                    name="emirates"
                                    value={patientData.emirates}
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        setPatientData((prevData) => ({
                                            ...prevData,
                                            emirates: selectedValue,
                                            place: "UAE",
                                        }));
                                    }}
                                    required
                                    options={[
                                        { value: "Abu Dhabi", label: "Abu Dhabi" },
                                        { value: "Ajman", label: "Ajman" },
                                        { value: "Dubai", label: "Dubai" },
                                        { value: "Fujairah", label: "Fujairah" },
                                        { value: "Ras Al Khaimah", label: "Ras Al Khaimah" },
                                        { value: "Sharjah", label: "Sharjah" },
                                        { value: "Umm Al Quwain", label: "Umm Al Quwain" },
                                    ]}
                                    select="Select Emirates"
                                />

                                <TextInput
                                    label="Place *"
                                    name="place"
                                    value={patientData.place}
                                    onChange={handleInputChange}
                                    maxLength={50}
                                    required
                                />
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <SelectInput
                                    label="Main District *"
                                    name="mainDistrict"
                                    value={patientData.mainDistrict}
                                    onChange={handleInputChange}
                                    required
                                    options={[
                                        { value: "Main District 1", label: "Main District 1" },
                                        { value: "Main District 2", label: "Main District 2" },
                                    ]}
                                />

                                <SelectInput
                                    label="District *"
                                    name="district"
                                    value={patientData.district}
                                    onChange={handleInputChange}
                                    required
                                    options={[
                                        { value: "District 1", label: "District 1" },
                                        { value: "District 2", label: "District 2" },
                                    ]}
                                />

                                <SelectInput
                                    label="Community/Area *"
                                    name="area"
                                    value={patientData.area}
                                    onChange={handleInputChange}
                                    required
                                    options={[
                                        { value: "Area 1", label: "Area 1" },
                                        { value: "Area 2", label: "Area 2" },
                                    ]}
                                />
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <TextInput
                                    label="Address *"
                                    name="address"
                                    value={patientData.address}
                                    onChange={handleInputChange}
                                    maxLength={500}
                                    required
                                />
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <div className="w-[25%]">
                                    <TextInput
                                        label="Hasana ID"
                                        name="hasanaId"
                                        value={patientData.hasanaId}
                                        onChange={handleInputChange}
                                        maxLength={20}
                                    />
                                </div>

                                <div className="flex w-[50%] gap-5">
                                    <TextInput
                                        label="Company Name *"
                                        name="companyName"
                                        value={patientData.companyName}
                                        onChange={handleInputChange}
                                        maxLength={70}
                                        required
                                    />
                                </div>

                                <div className="flex w-[25%] gap-5">
                                    <TextInput
                                        label="Employee ID"
                                        name="empId"
                                        value={patientData.empId}
                                        onChange={handleInputChange}
                                        maxLength={20}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <TextInput
                                    label="Patient Remark"
                                    name="patientRemark"
                                    value={patientData.patientRemark}
                                    onChange={handleInputChange}
                                    maxLength={500}
                                />
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <div className="w-[70%]">
                                    <TextInput
                                        label="Emergency Contact Person"
                                        name="emPerson"
                                        value={patientData.emPerson}
                                        onChange={handleInputChange}
                                        maxLength={500}
                                    />
                                </div>

                                <div className="w-[30%]">
                                    <MobileInput
                                        label="Emergency Contact Number"
                                        name="emNumber"
                                        value={patientData.emNumber}
                                        onChange={handleInputChange}
                                        maxLength={15}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row w-full gap-5">
                                <div className="w-[30%]">
                                    <TextInput
                                        label="Relationship with the Patient"
                                        name="relationship"
                                        value={patientData.relationship}
                                        onChange={handleInputChange}
                                        maxLength={20}
                                    />
                                </div>

                                <div className="w-[30%]">
                                    <SelectInput
                                        label="Consent for Promotional Alert"
                                        name="alert"
                                        value={patientData.alert}
                                        onChange={handleInputChange}
                                        select="Select"
                                        options={[
                                            { value: "Yes", label: "Yes" },
                                            { value: "No", label: "No" },
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Render Patient Detail Custom Fields */}
                            {patientDetailFields.length > 0 && (
                                <div className="mb-10 flex flex-wrap gap-5">
                                    {patientDetailFields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className={`w-3/12 md:w-${field.width} flex flex-col relative`}
                                        >
                                            {/* Render input based on the type */}
                                            {field.field_type === "text" && (
                                                <TextInput
                                                    label={field.field_name}
                                                    type="text"
                                                    name={field.field_name}
                                                />
                                            )}
                                            {field.field_type === "number" && (
                                                <TextInput
                                                    label={field.field_name}
                                                    type="number"
                                                    name={field.field_name}
                                                />
                                            )}
                                            {field.field_type === "email" && (
                                                <TextInput
                                                    label={field.field_name}
                                                    type="email"
                                                    name={field.field_name}
                                                />
                                            )}
                                            {field.field_type === "password" && (
                                                <TextInput
                                                    label={field.field_name}
                                                    type="password"
                                                    name={field.field_name}
                                                />
                                            )}
                                            {field.field_type === "date" && (
                                                <DateInput
                                                    label={field.field_name}
                                                    type="date"
                                                    name={field.field_name}
                                                />
                                            )}
                                            {field.field_type === "textarea" && (
                                                <TextareaInput
                                                    label={field.field_name}
                                                    type="textarea"
                                                    name={field.field_name}
                                                    placeholder="Note"
                                                />
                                            )}
                                            {field.field_type === "checkbox" && (
                                                <Checkbox
                                                    label={field.field_name}
                                                    type="checkbox"
                                                    name={field.field_name}
                                                />
                                            )}

                                            {field.field_type === "select" && (
                                                <div className="flex flex-col w-full">
                                                    <label className="mb-1 font-normal text-sm text-gray-500">
                                                        {field.field_name}
                                                    </label>
                                                    <select
                                                        name={field.field_name}
                                                        className="border rounded-md h-8 px-2 bg-white font-normal text-black focus:outline-none"
                                                    >
                                                        <option value="" disabled selected>
                                                            Select an option
                                                        </option>
                                                        {field.dropdown_options &&
                                                            field.dropdown_options.map(
                                                                (option, optionIndex) => (
                                                                    <option
                                                                        key={optionIndex}
                                                                        value={option.trim()}
                                                                    >
                                                                        {option.trim()}
                                                                    </option>
                                                                )
                                                            )}
                                                    </select>
                                                </div>
                                            )}
                                            {field.field_type === "radio" && (
                                                <div className="h-fit">
                                                    <div className="w-full border py-2 px-6 rounded-lg">
                                                        {/* Field Label */}
                                                        <label className="mb-3 font-normal text-gray-500 block">
                                                            {field.field_name}
                                                        </label>
                                                        {/* Render Radio Buttons Dynamically */}
                                                        <div className="flex flex-wrap gap-4">
                                                            {field.radio_buttons &&
                                                                field.radio_buttons.map(
                                                                    (option, optionIndex) => (
                                                                        <div
                                                                            key={optionIndex}
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                name={field.field_name}
                                                                                value={option.trim()}
                                                                                id={`radio_${field.id}_${optionIndex}`}
                                                                                className="h-4 w-4 accent-black cursor-pointer"
                                                                            />
                                                                            <label
                                                                                htmlFor={`radio_${field.id}_${optionIndex}`}
                                                                                className="text-sm text-gray-500"
                                                                            >
                                                                                {option.trim()}
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {field.field_type === "image" && (
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id="imageUpload"
                                                        name={field.field_name}
                                                        className="mt-2 p-2 border rounded w-full opacity-0 absolute inset-0 cursor-pointer"
                                                    />
                                                    <div
                                                        className="border-2 border-gray-200 rounded-md flex gap-2 items-center justify-center py-5 cursor-pointer"
                                                        onClick={() =>
                                                            document.getElementById("imageUpload").click()
                                                        }
                                                    >
                                                        <AiOutlineCloudUpload className="w-8 h-8 text-gray-500" />
                                                        <p className="text-gray-600 text-sm mt-2">
                                                            Drop a file here or click
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {field.field_type === "file" && (
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id="fileUpload"
                                                        name={field.field_name}
                                                        className="mt-2 p-2 border rounded w-full opacity-0 absolute inset-0 cursor-pointer"
                                                    />
                                                    <div
                                                        className="border-2 border-gray-200 rounded-md flex gap-2 items-center justify-center py-5 cursor-pointer"
                                                        onClick={() =>
                                                            document.getElementById("fileUpload").click()
                                                        }
                                                    >
                                                        <AiOutlineCloudUpload className="w-8 h-8 text-gray-500" />
                                                        <p className="text-gray-600 text-sm mt-2">
                                                            Drop a file here or click
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveField(field.id)}
                                                className="absolute ml-[350px] mt-[12px] text-red-500 hover:text-red-700"
                                            >
                                                <IoIosRemoveCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 mt-8 pb-[20px]">
                            <h2 className="text-xl text-gray-500 font-semibold">
                                Consultation Details
                            </h2>

                            <div className="flex flex-row w-full gap-5">
                                <SelectInput
                                    label="Specialty *"
                                    name="specialty"
                                    value={patientData.specialty}
                                    onChange={handleInputChange}
                                    select="Select Specialty"
                                    required
                                    options={[
                                        { value: "Cardiology", label: "Cardiology" },
                                        { value: "Dermatology", label: "Dermatology" },
                                        { value: "Neurology", label: "Neurology" },
                                        { value: "Orthopedics", label: "Orthopedics" },
                                        { value: "Ophthalmology", label: "Ophthalmology" },
                                    ]}
                                />

                                <div className="w-full">
                                    <SelectInput
                                        label="Doctor Name *"
                                        name="doctorName"
                                        value={patientData.doctorName}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            checkConsultationFee(e.target.value);
                                        }}
                                        select="Select"
                                        required
                                        options={[
                                            { value: "Dr. One", label: "Dr. One" },
                                            { value: "Dr. Two", label: "Dr. Two" },
                                        ]}
                                    />

                                    {consultationFeeMessage && (
                                        <p className="text-red-500 text-sm mt-2 mb-0">
                                            {consultationFeeMessage}
                                        </p>
                                    )}
                                </div>
                                <SelectInput
                                    label="Encounter Type"
                                    name="encounterType"
                                    value={patientData.encounterType}
                                    onChange={handleInputChange}
                                    select="Select Encounter Type"
                                    required
                                    options={[
                                        {
                                            value: "No Bed + No Emergency Room",
                                            label: "No Bed + No Emergency Room",
                                        },
                                        {
                                            value: "No Bed + Emergency Room",
                                            label: "No Bed + Emergency Room",
                                        },
                                        {
                                            value: "Day case Bed + No Emergency Room",
                                            label: "Day case Bed + No Emergency Room",
                                        },
                                        {
                                            value: "Day case Bed + Emergency Room",
                                            label: "Day case Bed + Emergency Room",
                                        },
                                    ]}
                                />
                            </div>

                            {/* Render Consultation Detail Custom Fields */}
                            {consultationFields.length > 0 && (
                                <div className="mb-10 flex flex-wrap gap-5">
                                    {consultationFields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className={`w-3/12 md:w-${field.width} flex flex-col relative`}
                                        >
                                            {/* Render input based on the type */}
                                            {field.field_type === "text" && (
                                                <TextInput
                                                    label={field.field_name}
                                                    type="text"
                                                    name={field.field_name}
                                                />
                                            )}
                                            {field.field_type === "number" && (
                                                <TextInput
                                                    label={field.field_name}
                                                    type="number"
                                                    name={field.field_name}
                                                />
                                            )}
                                            {field.field_type === "email" && (
                                                <TextInput
                                                    label={field.field_name}
                                                    type="email"
                                                    name={field.field_name}
                                                />
                                            )}
                                            {field.field_type === "password" && (
                                                <TextInput
                                                    label={field.field_name}
                                                    type="password"
                                                    name={field.field_name}
                                                />
                                            )}
                                            {field.field_type === "date" && (
                                                <DateInput
                                                    label={field.field_name}
                                                    type="date"
                                                    name={field.field_name}
                                                />
                                            )}
                                            {field.field_type === "textarea" && (
                                                <TextareaInput
                                                    label={field.field_name}
                                                    type="textarea"
                                                    name={field.field_name}
                                                    placeholder="Note"
                                                />
                                            )}
                                            {field.field_type === "checkbox" && (
                                                <Checkbox
                                                    label={field.field_name}
                                                    type="checkbox"
                                                    name={field.field_name}
                                                />
                                            )}

                                            {field.field_type === "select" && (
                                                <div className="flex flex-col w-full">
                                                    <label className="mb-1 font-normal text-sm text-gray-500">
                                                        {field.field_name}
                                                    </label>
                                                    <select
                                                        name={field.field_name}
                                                        className="border rounded-md h-8 px-2 bg-white font-normal text-black focus:outline-none"
                                                    >
                                                        <option value="" disabled selected>
                                                            Select an option
                                                        </option>
                                                        {field.dropdown_options &&
                                                            field.dropdown_options.map(
                                                                (option, optionIndex) => (
                                                                    <option
                                                                        key={optionIndex}
                                                                        value={option.trim()}
                                                                    >
                                                                        {option.trim()}
                                                                    </option>
                                                                )
                                                            )}
                                                    </select>
                                                </div>
                                            )}
                                            {field.field_type === "radio" && (
                                                <div className="h-fit">
                                                    <div className="w-full border py-2 px-6 rounded-lg">
                                                        {/* Field Label */}
                                                        <label className="mb-3 font-normal text-gray-500 block">
                                                            {field.field_name}
                                                        </label>
                                                        {/* Render Radio Buttons Dynamically */}
                                                        <div className="flex flex-wrap gap-4">
                                                            {field.radio_buttons &&
                                                                field.radio_buttons.map(
                                                                    (option, optionIndex) => (
                                                                        <div
                                                                            key={optionIndex}
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                name={field.field_name}
                                                                                value={option.trim()}
                                                                                id={`radio_${field.id}_${optionIndex}`}
                                                                                className="h-4 w-4 accent-black cursor-pointer"
                                                                            />
                                                                            <label
                                                                                htmlFor={`radio_${field.id}_${optionIndex}`}
                                                                                className="text-sm text-gray-500"
                                                                            >
                                                                                {option.trim()}
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {field.field_type === "image" && (
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id="imageUpload"
                                                        name={field.field_name}
                                                        className="mt-2 p-2 border rounded w-full opacity-0 absolute inset-0 cursor-pointer"
                                                    />
                                                    <div
                                                        className="border-2 border-gray-200 rounded-md flex gap-2 items-center justify-center py-5 cursor-pointer"
                                                        onClick={() =>
                                                            document.getElementById("imageUpload").click()
                                                        }
                                                    >
                                                        <AiOutlineCloudUpload className="w-8 h-8 text-gray-500" />
                                                        <p className="text-gray-600 text-sm mt-2">
                                                            Drop a file here or click
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {field.field_type === "file" && (
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id="fileUpload"
                                                        name={field.field_name}
                                                        className="mt-2 p-2 border rounded w-full opacity-0 absolute inset-0 cursor-pointer"
                                                    />
                                                    <div
                                                        className="border-2 border-gray-200 rounded-md flex gap-2 items-center justify-center py-5 cursor-pointer"
                                                        onClick={() =>
                                                            document.getElementById("fileUpload").click()
                                                        }
                                                    >
                                                        <AiOutlineCloudUpload className="w-8 h-8 text-gray-500" />
                                                        <p className="text-gray-600 text-sm mt-2">
                                                            Drop a file here or click
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveField(field.id)}
                                                className="absolute ml-[350px] mt-[12px] text-red-500 hover:text-red-700"
                                            >
                                                <IoIosRemoveCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 mt-8 pb-[40px]">
                            <h2 className="text-xl text-gray-500 font-semibold mb-4">
                                Payment Details
                            </h2>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-row w-[20%] gap-5">
                                    <SelectInput
                                        label="Payment Type *"
                                        name="paymentType"
                                        value={patientData.paymentType}
                                        onChange={handleInputChangeForInsurance}
                                        select="Select Payment Type"
                                        required
                                        options={[
                                            { value: "Cash", label: "Cash" },
                                            { value: "Insurance", label: "Insurance" },
                                            { value: "Corporate", label: "Corporate" },
                                        ]}
                                    />
                                </div>

                                {patientData.paymentType === "Insurance" && (
                                    <button
                                        onClick={handleAddInsurance}
                                        className={`bg-black text-white font-semibold py-2 px-4 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        disabled={loading}
                                    >
                                        {loading ? "Adding..." : "Add Insurance"}
                                    </button>
                                )}
                            </div>

                            {patientData.paymentType === "Insurance" && (
                                <div className="flex flex-col md:flex-row justify-between">
                                    {/* Left Section: Input Fields */}
                                    <div className="space-y-6 w-full md:w-[50%] mt-6">
                                        <div className="flex flex-col md:flex-row w-full gap-5">
                                            <SelectInput
                                                label="Insurance Provider"
                                                name="insuranceProvider"
                                                value={patientData.insuranceProvider}
                                                onChange={handleInputChangeForInsurance}
                                                select="Select Insurance Provider"
                                                required
                                                options={[
                                                    { value: "Provider A", label: "Provider A" },
                                                    { value: "Provider B", label: "Provider B" },
                                                    { value: "Provider C", label: "Provider C" },
                                                ]}
                                            />
                                            <SelectInput
                                                label="Sub Insurance"
                                                name="subInsurance"
                                                value={patientData.subInsurance}
                                                onChange={handleInputChangeForInsurance}
                                                select="Select Sub Insurance"
                                                required
                                                options={[
                                                    {
                                                        value: "Sub Insurance A",
                                                        label: "Sub Insurance A",
                                                    },
                                                    {
                                                        value: "Sub Insurance B",
                                                        label: "Sub Insurance B",
                                                    },
                                                    {
                                                        value: "Sub Insurance C",
                                                        label: "Sub Insurance C",
                                                    },
                                                ]}
                                            />
                                        </div>
                                        <div className="flex flex-col md:flex-row w-full md:w-[49%] gap-5">
                                            <SelectInput
                                                label="Network Type"
                                                name="networkType"
                                                value={patientData.networkType}
                                                onChange={handleInputChangeForInsurance}
                                                select="Select Network Type"
                                                required
                                                options={[
                                                    { value: "Network Type A", label: "Network Type A" },
                                                    { value: "Network Type B", label: "Network Type B" },
                                                    { value: "Network Type C", label: "Network Type C" },
                                                ]}
                                            />
                                        </div>
                                        <div className="flex flex-col md:flex-row w-full gap-5">
                                            <TextInput
                                                label="Insurance Card Number *"
                                                name="insuranceCardNumber"
                                                value={patientData.insuranceCardNumber}
                                                onChange={handleInputChangeForInsurance}
                                                maxLength={20}
                                                required
                                            />
                                            <TextInput
                                                label="Extra Card Number"
                                                name="extraCardNumber"
                                                value={patientData.extraCardNumber}
                                                onChange={handleInputChangeForInsurance}
                                                maxLength={20}
                                            />
                                            <DateInput
                                                label="Insurance Effective Date"
                                                name="insuranceEffectiveDate"
                                                value={patientData.insuranceEffectiveDate}
                                                onChange={handleInputChangeForInsurance}
                                                required
                                            />
                                            <DateInput
                                                label="Insurance Expiry Date *"
                                                name="insuranceExpiryDate"
                                                value={patientData.insuranceExpiryDate}
                                                onChange={handleInputChangeForInsurance}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col md:flex-row w-full gap-5">
                                            <TextInput
                                                label="Certificate No"
                                                name="certificateNo"
                                                value={patientData.certificateNo}
                                                onChange={handleInputChangeForInsurance}
                                                maxLength={20}
                                            />
                                            <div className="w-full md:w-[12%]">
                                                <TextInput
                                                    label="Dependents No"
                                                    name="dependentsNo"
                                                    value={patientData.dependentsNo}
                                                    onChange={handleInputChangeForInsurance}
                                                    maxLength={2}
                                                />
                                            </div>
                                            <TextInput
                                                label="Insurance Claim No"
                                                name="insuranceClaimNo"
                                                value={patientData.insuranceClaimNo}
                                                onChange={handleInputChangeForInsurance}
                                                maxLength={20}
                                            />
                                        </div>
                                        <div className="flex flex-col md:flex-row w-full gap-5 md:gap-14">
                                            <div className="w-full md:w-[20%] flex items-center gap-2">
                                                <TextInput
                                                    label="Max. Insurance Liability"
                                                    name="maxInsuranceLiability"
                                                    value={patientData.maxInsuranceLiability}
                                                    onChange={handleInputChangeForInsurance}
                                                    maxLength={20}
                                                    type="number"
                                                />
                                                <span className="text-gray-500 text-sm mt-5">AED</span>
                                            </div>
                                            <div className="w-full md:w-[20%] flex items-center gap-2">
                                                <TextInput
                                                    label="Insurance Approval Limit"
                                                    name="insuranceApprovalLimit"
                                                    value={patientData.insuranceApprovalLimit}
                                                    onChange={handleInputChangeForInsurance}
                                                    maxLength={20}
                                                    type="number"
                                                />
                                                <span className="text-gray-500 text-sm mt-5">AED</span>
                                            </div>
                                            <div className="w-full md:w-[20%] flex items-center gap-2">
                                                <TextInput
                                                    label="Max. Insurance Co-Pay"
                                                    name="maxInsuranceCoPay"
                                                    value={patientData.maxInsuranceCoPay}
                                                    onChange={handleInputChangeForInsurance}
                                                    maxLength={20}
                                                    type="number"
                                                />
                                                <span className="text-gray-500 text-sm mt-5">AED</span>
                                            </div>
                                            <div className="w-full md:w-[20%] flex items-center gap-2">
                                                <TextInput
                                                    label="Co-Pay Patient"
                                                    name="coPayPatient"
                                                    value={patientData.coPayPatient}
                                                    onChange={handleInputChangeForInsurance}
                                                    maxLength={20}
                                                    type="number"
                                                />
                                                <span className="text-gray-500 text-sm mt-5">%</span>
                                            </div>
                                        </div>

                                        {/* Render Payment Details Custom Fields */}
                                        {paymentFields.length > 0 && (
                                            <div className="mb-10 flex flex-wrap gap-5">
                                                {paymentFields.map((field, index) => (
                                                    <div
                                                        key={field.id}
                                                        className={`w-fit md:w-${field.width} flex flex-col relative`}
                                                    >
                                                        {/* Render input based on the type */}
                                                        {field.field_type === "text" && (
                                                            <TextInput
                                                                label={field.field_name}
                                                                type="text"
                                                                name={field.field_name}
                                                            />
                                                        )}
                                                        {field.field_type === "number" && (
                                                            <TextInput
                                                                label={field.field_name}
                                                                type="number"
                                                                name={field.field_name}
                                                            />
                                                        )}
                                                        {field.field_type === "email" && (
                                                            <TextInput
                                                                label={field.field_name}
                                                                type="email"
                                                                name={field.field_name}
                                                            />
                                                        )}
                                                        {field.field_type === "password" && (
                                                            <TextInput
                                                                label={field.field_name}
                                                                type="password"
                                                                name={field.field_name}
                                                            />
                                                        )}
                                                        {field.field_type === "date" && (
                                                            <DateInput
                                                                label={field.field_name}
                                                                type="date"
                                                                name={field.field_name}
                                                            />
                                                        )}
                                                        {field.field_type === "textarea" && (
                                                            <TextareaInput
                                                                label={field.field_name}
                                                                type="textarea"
                                                                name={field.field_name}
                                                                placeholder="Note"
                                                            />
                                                        )}
                                                        {field.field_type === "checkbox" && (
                                                            <Checkbox
                                                                label={field.field_name}
                                                                type="checkbox"
                                                                name={field.field_name}
                                                            />
                                                        )}

                                                        {field.field_type === "select" && (
                                                            <div className="flex flex-col w-full">
                                                                <label className="mb-1 font-normal text-sm text-gray-500">
                                                                    {field.field_name}
                                                                </label>
                                                                <select
                                                                    name={field.field_name}
                                                                    className="border rounded-md h-8 px-2 bg-white font-normal text-black focus:outline-none"
                                                                >
                                                                    <option value="" disabled selected>
                                                                        Select an option
                                                                    </option>
                                                                    {field.dropdown_options &&
                                                                        field.dropdown_options.map(
                                                                            (option, optionIndex) => (
                                                                                <option
                                                                                    key={optionIndex}
                                                                                    value={option.trim()}
                                                                                >
                                                                                    {option.trim()}
                                                                                </option>
                                                                            )
                                                                        )}
                                                                </select>
                                                            </div>
                                                        )}
                                                        {field.field_type === "radio" && (
                                                            <div className="">
                                                                <div className="border py-2 px-6 rounded-lg">
                                                                    {/* Field Label */}
                                                                    <label className="mb-3 font-normal text-gray-500 block">
                                                                        {field.field_name}
                                                                    </label>
                                                                    {/* Render Radio Buttons Dynamically */}
                                                                    <div className="flex flex-wrap gap-4">
                                                                        {field.radio_buttons &&
                                                                            field.radio_buttons.map(
                                                                                (option, optionIndex) => (
                                                                                    <div
                                                                                        key={optionIndex}
                                                                                        className="flex items-center gap-2"
                                                                                    >
                                                                                        <input
                                                                                            type="radio"
                                                                                            name={field.field_name}
                                                                                            value={option.trim()}
                                                                                            id={`radio_${field.id}_${optionIndex}`}
                                                                                            className="h-4 w-4 accent-black cursor-pointer"
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`radio_${field.id}_${optionIndex}`}
                                                                                            className="text-sm text-gray-500"
                                                                                        >
                                                                                            {option.trim()}
                                                                                        </label>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {field.field_type === "image" && (
                                                            <div className="relative">
                                                                <input
                                                                    type="file"
                                                                    id="imageUpload"
                                                                    name={field.field_name}
                                                                    className="mt-2 p-2 border rounded w-full opacity-0 absolute inset-0 cursor-pointer"
                                                                />
                                                                <div
                                                                    className="border-2 border-gray-200 rounded-md flex gap-2 items-center justify-center py-5 cursor-pointer"
                                                                    onClick={() =>
                                                                        document
                                                                            .getElementById("imageUpload")
                                                                            .click()
                                                                    }
                                                                >
                                                                    <AiOutlineCloudUpload className="w-8 h-8 text-gray-500" />
                                                                    <p className="text-gray-600 text-sm mt-2">
                                                                        Drop a file here or click
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {field.field_type === "file" && (
                                                            <div className="relative">
                                                                <input
                                                                    type="file"
                                                                    id="fileUpload"
                                                                    name={field.field_name}
                                                                    className="mt-2 p-2 border rounded w-full opacity-0 absolute inset-0 cursor-pointer"
                                                                />
                                                                <div
                                                                    className="border-2 border-gray-200 rounded-md flex gap-2 items-center justify-center py-5 cursor-pointer"
                                                                    onClick={() =>
                                                                        document
                                                                            .getElementById("fileUpload")
                                                                            .click()
                                                                    }
                                                                >
                                                                    <AiOutlineCloudUpload className="w-8 h-8 text-gray-500" />
                                                                    <p className="text-gray-600 text-sm mt-2">
                                                                        Drop a file here or click
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveField(field.id)}
                                                            className="absolute right-2 top-3 text-red-500 hover:text-red-700"
                                                        >
                                                            <IoIosRemoveCircle className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Section: Table-like Design */}
                                    <div className="w-full lg:w-[43%] mt-4">
                                        <div className="space-y-6 text-sm">
                                            {/* Header Row */}
                                            <div className="grid grid-cols-9 items-center text-gray-600 text-sm font-semibold">
                                                <span className="col-span-1"></span>
                                                <span className="col-span-1 text-center">
                                                    | [Deductible (AED)
                                                </span>
                                                <span className="col-span-1 text-center">All</span>
                                                <span className="col-span-1 text-center">Each]</span>
                                                <span className="col-span-1 text-center">
                                                    | [Co Pay %
                                                </span>
                                                <span className="col-span-1 text-center">Min</span>
                                                <span className="col-span-1 text-center">Max</span>
                                                <span className="col-span-1 text-center">All</span>
                                                <span className="col-span-1 text-center">Each] |</span>
                                            </div>
                                            {/* Dynamic Rows for Categories */}
                                            {[
                                                "Consultation",
                                                "Lab",
                                                "Radiology",
                                                "Treatment",
                                                "Medicine",
                                                "Dental",
                                                "Maternity",
                                            ].map((category) => (
                                                <div
                                                    key={category}
                                                    className="grid grid-cols-9 items-center"
                                                >
                                                    {/* Category Name */}
                                                    <span className="col-span-1 font-normal text-sm text-gray-500 -ml-4">
                                                        {category}
                                                    </span>
                                                    <div className="col-span-1 text-center ml-4">
                                                        <input
                                                            type="number"
                                                            name={`deductibles_${category}_deductible`}
                                                            value={
                                                                patientData.deductibles[category]?.deductible ||
                                                                ""
                                                            }
                                                            onChange={handleInputChangeForInsurance}
                                                            className="border rounded px-2 py-1 w-full text-center"
                                                        />
                                                    </div>

                                                    <div className="col-span-2 flex justify-center gap-[42px]">
                                                        {category !== "Consultation" &&
                                                            category !== "Maternity" && (
                                                                <>
                                                                    <label className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`deductibles_${category}_allOrEach`}
                                                                            value="all"
                                                                            checked={
                                                                                patientData.deductibles[category]
                                                                                    ?.allOrEach === "all"
                                                                            }
                                                                            onChange={handleInputChangeForInsurance}
                                                                            className="accent-black cursor-pointer"
                                                                        />
                                                                    </label>
                                                                    <label className="flex items-center gap-1">
                                                                        <input
                                                                            type="radio"
                                                                            name={`deductibles_${category}_allOrEach`}
                                                                            value="each"
                                                                            checked={
                                                                                patientData.deductibles[category]
                                                                                    ?.allOrEach === "each"
                                                                            }
                                                                            onChange={handleInputChangeForInsurance}
                                                                            className="accent-black cursor-pointer"
                                                                        />
                                                                    </label>
                                                                </>
                                                            )}
                                                    </div>

                                                    <div className="col-span-1 text-center ml-4">
                                                        <input
                                                            type="number"
                                                            name={`deductibles_${category}_min`}
                                                            value={
                                                                patientData.deductibles[category]?.min || ""
                                                            }
                                                            onChange={handleInputChangeForInsurance}
                                                            className="border rounded px-2 py-1 w-full text-center"
                                                        />
                                                    </div>
                                                    <div className="col-span-1 text-center ml-4">
                                                        <input
                                                            type="number"
                                                            name={`deductibles_${category}_max`}
                                                            value={
                                                                patientData.deductibles[category]?.max || ""
                                                            }
                                                            onChange={handleInputChangeForInsurance}
                                                            className="border rounded px-2 py-1 w-full text-center"
                                                        />
                                                    </div>
                                                    <div className="col-span-1 text-center ml-4">
                                                        <input
                                                            type="number"
                                                            name={`deductibles_${category}_copay`}
                                                            value={
                                                                patientData.deductibles[category]?.copay || ""
                                                            }
                                                            onChange={handleInputChangeForInsurance}
                                                            className="border rounded px-2 py-1 w-full text-center"
                                                        />
                                                    </div>

                                                    <div className="col-span-2 flex justify-center gap-[42px]">
                                                        <label className="flex items-center gap-1">
                                                            <input
                                                                type="radio"
                                                                name={`deductibles_${category}_copayAllOrEach`}
                                                                value="all"
                                                                checked={
                                                                    patientData.deductibles[category]
                                                                        ?.copayAllOrEach === "all"
                                                                }
                                                                onChange={handleInputChangeForInsurance}
                                                                className="accent-black cursor-pointer"
                                                            />
                                                        </label>
                                                        <label className="flex items-center gap-1">
                                                            <input
                                                                type="radio"
                                                                name={`deductibles_${category}_copayAllOrEach`}
                                                                value="each"
                                                                checked={
                                                                    patientData.deductibles[category]
                                                                        ?.copayAllOrEach === "each"
                                                                }
                                                                onChange={handleInputChangeForInsurance}
                                                                className="accent-black cursor-pointer"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Insurance details table */}
                            {insuranceTableData.length > 0 && (
                                <div className="flex items-center justify-center">
                                    <table className="table-auto border-collapse border border-gray-300 mt-8">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 px-4 py-2">
                                                    Insurance Card Number
                                                </th>
                                                <th className="border border-gray-300 px-4 py-2">
                                                    Extra Card Number
                                                </th>
                                                <th className="border border-gray-300 px-4 py-2">
                                                    Insurance Effective Date
                                                </th>
                                                <th className="border border-gray-300 px-4 py-2">
                                                    Insurance Expiry Date
                                                </th>
                                                <th className="border border-gray-300 px-4 py-2">
                                                    Certificate No
                                                </th>
                                                <th className="border border-gray-300 px-4 py-2">
                                                    Dependents No
                                                </th>
                                                <th className="border border-gray-300 px-4 py-2">
                                                    Insurance Claim No
                                                </th>
                                                <th className="border border-gray-300 px-4 py-2">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {insuranceTableData.map((data, index) => (
                                                <tr key={index}>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {data.insuranceCardNumber}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {data.extraCardNumber || "N/A"}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {data.insuranceEffectiveDate}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {data.insuranceExpiryDate}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {data.certificateNo || "N/A"}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {data.dependentsNo || "N/A"}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {data.insuranceClaimNo || "N/A"}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {editingIndex === index ? (
                                                            <>
                                                                <button
                                                                    onClick={handleSaveEdit}
                                                                    className="text-green-500"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelEdit}
                                                                    className="text-red-500 ml-2"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => handleEditClick(index)}>
                                                                <FaEdit
                                                                    size={18}
                                                                    className="text-yellow-600 ml-4"
                                                                />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className={`bg-black text-white font-semibold py-2 px-4 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading ? "Registering..." : "Register Patient"}
                            </button>
                        </div>
                        {/* Custom Field Generator Component */}
                        <CustomField onAddField={handleAddField} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDetailsPage;