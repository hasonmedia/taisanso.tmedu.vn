import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState } from "react";

export default function AdminLayout({ children }) {
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
}