import { useEffect } from "react";
import Header from "../manager/Header";

function ManagerLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="px-3 md:px-6 py-4">{children}</main>
        </div>
    );
}

export default ManagerLayout;