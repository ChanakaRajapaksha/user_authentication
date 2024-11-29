import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth"; 

const Navbar = () => {
    const { auth, setAuth } = useAuth(); 

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/logout", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                // Clear the auth state
                setAuth({});
                toast.success("Logged out successfully!", { position: "top-right" });

                navigate("/login");
            } else {
                throw new Error("Logout failed.");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred during logout.", { position: "top-right" });
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-indigo-600 to-purple-600 text-white">
            <div className="w-full">
                <Link to="/" className="flex gap-2 outline-none">
                    <img src="/logo.png" alt="logo" width={32} height={32} />
                    <span className="hidden lg:block font-bold">RCP Health Lab</span>
                </Link>
            </div>
            {/* ICONS AND USER */}
            <div className="flex items-center gap-6 justify-end w-full">
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                    <Link to="/appointments">
                        <img src="/message.png" alt="message" width={20} height={20} />
                    </Link>
                </div>
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
                    <Link to='/announcement'>
                        <img src="/announcement.png" alt="announcement" width={20} height={20} />
                    </Link>
                    <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-sm">1</div>
                </div>

                {auth?.username && auth?.roles?.length > 0 && (
                    <div className="relative flex flex-col text-white group">
                        <span className="text-xs leading-3 font-medium">{auth.username}</span>
                        <span className="text-[12px] text-white text-right">{auth.roles[0]}</span>

                        <div className="absolute hidden group-hover:flex flex-col  text-black right-0 mt-1 rounded shadow">
                            <button
                                onClick={handleLogout}
                                className="text-left text-sm hover:bg-gray-200 p-1 rounded">
                                Logout
                            </button>
                        </div>
                    </div>
                )}
                <img src="/avatar.png" alt="avatar" width={36} height={36} className="rounded-full" />
            </div>
        </div>
    );
};

export default Navbar;
