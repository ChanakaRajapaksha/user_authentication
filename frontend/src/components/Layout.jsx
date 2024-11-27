import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <main>
                <Outlet /> {/* This will render the nested route */}
            </main>
        </div>
    );
};

export default Layout;
