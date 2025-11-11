import React, { useState } from "react";
import { Sidebar } from "../admin/Sidebar";
import { Header } from "../admin/Header";

const RootLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen flex">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-auto bg-gray-50 p-3 md:p-6">{children}</main>
            </div>
        </div>
    );
};

export default RootLayout;