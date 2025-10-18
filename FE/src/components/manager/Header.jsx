import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarDefault from "../../assets/avatar_Defaute.webp";
import { Bell, LogOut, User, Menu, X } from "lucide-react";
import { NotificationStore } from "../../stores/notification";
import { formatDateTime } from "@/utils/formatDate";
import { useAuth } from "@/context/AuthContext";
import { capToLetter } from "@/utils/capToLetter";
function Header() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [userNotification, setUserNotification] = useState([]);
    const notification = NotificationStore();
    const { user, handleLogout } = useAuth();

    const logout = async () => {
        try {
            await handleLogout();
            navigate("/login");
        } catch (err) {
            console.error("Logout thất bại:", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const notifs = await notification.getNotificationByUser();
            setUserNotification(notifs);
        };
        fetchData();
    }, []);

    // Close menus on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
                setIsNotifOpen(false);
                setShowUserMenu(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navigationLinks = [
        { to: "/dashboard_manager", label: "Trang chủ" },
        { to: "/request-asset", label: "Yêu cầu cấp tài sản" },
        { to: "/asset-manager", label: "Tài sản của tôi" },
        { to: "/assign-asset", label: "Cấp tài sản cho nhân viên" }
    ];

    return (
        <>
            <header className="flex items-center justify-between px-3 md:px-6 py-4 bg-white shadow sticky top-0 z-50">
                {/* Left nav */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    <Link to="/dashboard_manager" className="text-xl md:text-2xl font-bold text-blue-600">
                        TMEDU
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navigationLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.to}
                                className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-md hover:bg-gray-100"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Right nav */}
                <div className="flex items-center gap-2 md:gap-3 ml-auto">
                    {user ? (
                        <>
                            {/* Notification Bell */}
                            <div className="relative notif-menu">
                                <button
                                    type="button"
                                    className="relative p-2 rounded-full hover:bg-gray-100"
                                    onClick={() => {
                                        setIsNotifOpen(!isNotifOpen);
                                        setShowUserMenu(false);
                                    }}
                                >
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    {userNotification?.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                                            {userNotification.length}
                                        </span>
                                    )}
                                </button>

                                {isNotifOpen && (
                                    <div className="absolute right-0 md:right-[-32px] mt-2 w-80 max-w-[90vw] bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
                                        <div className="p-3 font-semibold border-b bg-gray-50 flex justify-between items-center">
                                            <span>Thông báo</span>
                                            <button
                                                className="text-xs text-blue-600 hover:underline"
                                                onClick={() => setUserNotification([])}
                                            >
                                                Đánh dấu đã đọc
                                            </button>
                                        </div>

                                        <ul className="max-h-64 overflow-y-auto">
                                            {userNotification.length > 0 ? (
                                                userNotification.map((notif, index) => (
                                                    <li
                                                        key={index}
                                                        className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                                    >
                                                        <div className="break-words text-gray-800">
                                                            {notif?.noi_dung || "Nội dung thông báo"}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {formatDateTime(notif?.thoi_gian)}
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="px-4 py-6 text-sm text-gray-500 text-center">
                                                    🎉 Không có thông báo mới
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>


                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowUserMenu(!showUserMenu);
                                        setIsNotifOpen(false);
                                    }}
                                    className="flex items-center space-x-2 md:space-x-3 p-2 rounded-md hover:bg-gray-100"
                                >
                                    <img
                                        src={avatarDefault}
                                        alt="avatarDefault"
                                        className="h-8 w-8 rounded-full"
                                    />
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-gray-900">{user?.ho_ten}</p>
                                        <span className="text-xs text-gray-500">
                                            {capToLetter(user.cap)}
                                        </span>
                                    </div>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                        <div className="py-1">
                                            <div className="sm:hidden px-4 py-2 border-b border-gray-200">
                                                <p className="text-sm font-medium text-gray-900">{user?.ho_ten}</p>
                                                <span className="text-xs text-gray-500">
                                                    {capToLetter(user.cap)}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    navigate("/manager/profile");
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <User className="h-4 w-4 mr-3" />
                                                Thông tin cá nhân
                                            </button>

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
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="text-blue-600 font-semibold hover:underline text-sm md:text-base"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </header>

            {/* Mobile Navigation Menu */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-opacity ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"} bg-black bg-opacity-50`}
                onClick={() => setMobileMenuOpen(false)}
            />

            <div
                className={`fixed top-[73px] left-0 w-full bg-white shadow-lg z-50 md:hidden transform transition-transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <nav className="py-2">
                    {navigationLinks.map((link, index) => (
                        <Link
                            key={index}
                            to={link.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 border-b border-gray-100 last:border-b-0"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
}

export default Header;
