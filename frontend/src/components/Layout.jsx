import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="h-screen flex overflow-hidden">
            <div className="w-full bg-[#F7F8FA] flex flex-col">
                <Navbar />
                <div className="">
                    {/* Content rendered from child components */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
