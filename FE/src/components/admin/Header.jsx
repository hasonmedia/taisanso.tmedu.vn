import { Bell, LogOut, User, Menu } from "lucide-react";
import { useState } from "react";
import avatarDefaute from "../../assets/avatar_Defaute.webp";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { capToLetter } from "@/utils/capToLetter";
export function Header({ setSidebarOpen }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await handleLogout();
            navigate("/login");
        } catch (err) {
            console.error("Logout thất bại:", err);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 px-3 md:px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Mobile menu button */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-2 rounded-md hover:bg-gray-100"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Mobile title */}
                <div className="md:hidden font-semibold text-gray-900">
                    Admin Panel
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
                    {/* User menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 md:space-x-3 p-2 rounded-md hover:bg-gray-100"
                        >
                            <img
                                src={avatarDefaute}
                                alt="avatarDefaute"
                                className="h-8 w-8 rounded-full"
                            />

                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.ho_ten}
                                </p>
                                <span className="text-xs text-gray-500">
                                    {capToLetter(user.cap)}
                                </span>
                            </div>
                        </button>

                        {/* Dropdown menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                <div className="py-1">
                                    {/* Show user info on mobile */}
                                    <div className="sm:hidden px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.ho_ten}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                            {capToLetter(user.cap)}
                                        </span>
                                    </div>

                                    {/* Nút Thông tin cá nhân */}
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            navigate("/profile");
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <User className="h-4 w-4 mr-3" />
                                        Thông tin cá nhân
                                    </button>

                                    {/* Nút Đăng xuất */}
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            logout();
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4 mr-3" />
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
