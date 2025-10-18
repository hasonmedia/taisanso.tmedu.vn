import { useLocation, Link, href } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Users,
    Building,
    ClipboardCheck,
    RotateCcw,
    Bell,
    BarChart,
    BookUser,
    KeyRound,
    X,
    BellPlus,
} from "lucide-react";
import { useEffect } from "react";

const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Quản Lý Tài Sản", icon: Package, href: "/dashboard/quan-ly-tai-san" },
    { label: "Quản Lý Người Dùng", icon: Users, href: "/dashboard/quan-ly-nguoi-dung" },
    { label: "Quản Lý Danh Mục Tài Sản", icon: Building, href: "/dashboard/quan-ly-danh-muc-tai-san" },
    { label: "Quản Lý Phòng Ban", icon: Building, href: "/dashboard/quan-ly-phong-ban" },
    { label: "Phê Duyệt Yêu Cầu", icon: ClipboardCheck, href: "/dashboard/phe-duyet-yeu-cau" },
    { label: "Lịch Sử Hoạt Động", icon: RotateCcw, href: "/dashboard/lich-su-hoat-dong" },
    { label: "Tài Sản Sắp Hết Hạn", icon: BellPlus, href: "/dashboard/tai-san-sap-het-han" },
    { label: "Thông Báo Hết Hạn", icon: Bell, href: "/dashboard/thong-bao-het-han" },
    { label: "Cấp tài sản trực tiếp", icon: BarChart, href: "/dashboard/cap-tai-san-truc-tiep" },
    { label: "Nhật Ký Cá Nhân", icon: BookUser, href: "/dashboard/nhat-ky-ca-nhan" },
    { label: "Thông Tin Đăng Nhập Tài Sản", icon: KeyRound, href: "/dashboard/thong-tin-dang-nhap-tai-san" },
    { label: "Hướng dẫn sử dụng", icon: BookUser, href: "/user-guide" },
];

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setSidebarOpen]);

    return (
        <>
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:relative z-50 bg-[#243647] text-white w-64 min-h-screen
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 font-bold text-lg border-b border-gray-700">
                    <span>Menu Quản Trị</span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-1 rounded hover:bg-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-2">
                    {menuItems.map((item, idx) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.href;

                        return (
                            <Link to={item.href} key={idx}>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center w-full text-left px-4 py-3 transition
                                        ${isActive ? "bg-blue-500" : "hover:bg-blue-600"}
                                    `}
                                >
                                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </button>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
