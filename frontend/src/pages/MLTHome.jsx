import { useNavigate } from "react-router-dom";

const MLTHome = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/dashboard");
    };

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-[100vh]">
            <h1 className="text-3xl font-bold">Welcome to the MLT Home Page!</h1>
            <button
                onClick={handleNavigation}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Go to the Dashboard Home Page
            </button>
        </div>
    );
};

export default MLTHome;