import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <header>My App Header</header>
            <main>
                <Outlet /> {/* This will render the nested route */}
            </main>
        </div>
    );
};

export default Layout;
