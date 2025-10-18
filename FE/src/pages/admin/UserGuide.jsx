import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
    ChevronDown,
    ChevronRight,
    User,
    Shield,
    Settings,
    Bell,
    FileText,
    Package,
    Building2,
    Users,
    Activity,
    HelpCircle,
    Search,
    Book,
    CheckCircle,
    X,
    Menu,
    AlertTriangle,
    Info,
    Star,
    ExternalLink
} from "lucide-react";

const UserGuide = () => {
    const [expandedSections, setExpandedSections] = useState({
        intro: true,
        permissions: true,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [activeSection, setActiveSection] = useState("intro");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.menu-button')) {
                setSidebarOpen(false);
            }
        };

        if (sidebarOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [sidebarOpen]);

    const toggleSection = useCallback((sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    }, []);

    const scrollToSection = useCallback((sectionId) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setSidebarOpen(false);
    }, []);

    const permissions = useMemo(() => [
        {
            action: 'Quản lý yêu cầu',
            admin: true,
            manager: false,
            employee: false,
            note: 'Quản trị viên xem tất cả yêu cầu mà trưởng bộ phận gửi lên và phê duyệt hay từ chối yêu cầu đó',
            category: 'workflow'
        },
        {
            action: 'Tạo một yêu cầu cấp tài sản',
            admin: false,
            manager: true,
            employee: false,
            note: 'Trưởng bộ phận yêu cầu cấp tài sản cho nhân viên',
            category: 'workflow'
        },
        {
            action: 'Cấp tài sản cho nhân viên',
            admin: true,
            manager: true,
            employee: false,
            note: 'Trưởng bộ phận chỉ cấp cho nhân viên thuộc quyền quản lý',
            category: 'asset'
        },
        {
            action: 'Xem thông tin tài sản cá nhân',
            admin: true,
            manager: true,
            employee: true,
            note: 'Xem tài sản được giao cho bản thân',
            category: 'asset'
        },
        {
            action: 'Sửa thông tin tài sản của mình',
            admin: true,
            manager: false,
            employee: true,
            note: 'Cập nhật thông tin đăng nhập bao gồm username và password',
            category: 'asset'
        },
        {
            action: 'Xem tài sản của nhân viên',
            admin: true,
            manager: true,
            employee: false,
            note: 'Trưởng bộ phận xem tài sản của nhân viên thuộc quyền',
            category: 'asset'
        },
        {
            action: 'Quản lý tài sản (CRUD)',
            admin: true,
            manager: false,
            employee: false,
            note: 'Thêm/sửa/xóa tài sản trong hệ thống',
            category: 'management'
        },
        {
            action: 'Quản lý danh mục tài sản',
            admin: true,
            manager: false,
            employee: false,
            note: 'Tạo và quản lý các loại tài sản',
            category: 'management'
        },
        {
            action: 'Quản lý phòng ban',
            admin: true,
            manager: false,
            employee: false,
            note: 'Tạo/sửa/xóa phòng ban',
            category: 'management'
        },
        {
            action: 'Quản lý tài khoản người dùng',
            admin: true,
            manager: false,
            employee: false,
            note: 'Xem và quản lý tài khoản trong hệ thống',
            category: 'management'
        },
        {
            action: 'Gửi thông báo hệ thống',
            admin: true,
            manager: true,
            employee: false,
            note: 'Trưởng bộ phận gửi thông báo cho nhân viên của mình',
            category: 'communication'
        },
        {
            action: 'Xem lịch sử hoạt động',
            admin: true,
            manager: false,
            employee: false,
            note: 'Xem hoạt động của bản thân và cấp dưới',
            category: 'monitoring'
        }
    ], []);

    const guideData = useMemo(() => [
        {
            id: 'intro',
            title: 'Giới thiệu Hệ thống',
            icon: <Book className="w-5 h-5" />,
            priority: 'high',
            content: {
                description: 'Hệ thống Quản lý Tài sản (Asset Management System) được thiết kế để giúp doanh nghiệp quản lý tài sản một cách hiệu quả, từ việc phân công, theo dõi đến bảo trì tài sản.',
                features: [
                    'Quản lý phân cấp người dùng rõ ràng',
                    'Theo dõi tài sản thời gian thực',
                    'Hệ thống thông báo tự động',
                    'Báo cáo và thống kê chi tiết'
                ],
                roles: [
                    {
                        level: 'Quản trị viên',
                        desc: 'Toàn quyền quản lý hệ thống, tài sản và tài khoản',
                        color: 'bg-red-50 text-red-800 border-red-200',
                        features: ['Quản lý tất cả chức năng', 'Tạo tài khoản người dùng', 'Quản lý danh mục và phòng ban', 'Xem báo cáo tổng thể']
                    },
                    {
                        level: 'Trưởng bộ phận',
                        desc: 'Quản lý tài sản và nhân viên trong phạm vi được giao',
                        color: 'bg-blue-50 text-blue-800 border-blue-200',
                        features: ['Cấp tài sản cho nhân viên', 'Xem tài sản của cấp dưới', 'Gửi yêu cầu và thông báo', 'Theo dõi tình trạng sử dụng']
                    },
                    {
                        level: 'Nhân viên',
                        desc: 'Sử dụng và cập nhật thông tin tài sản được giao',
                        color: 'bg-green-50 text-green-800 border-green-200',
                        features: ['Xem tài sản của mình', 'Cập nhật thông tin tài sản', 'Nhận thông báo', 'Báo cáo sự cố']
                    }
                ]
            }
        },
        {
            id: 'permissions',
            title: 'Ma trận Phân quyền Chi tiết',
            icon: <Shield className="w-5 h-5" />,
            priority: 'high',
            content: { permissions }
        },
        {
            id: 'workflow',
            title: 'Quy trình Sử dụng',
            icon: <Activity className="w-5 h-5" />,
            priority: 'medium',
            content: {
                admin: [
                    'Thiết lập hệ thống và cấu hình ban đầu',
                    'Tạo và quản lý tài khoản người dùng',
                    'Thiết lập danh mục tài sản và phòng ban',
                    'Nhập và quản lý thông tin tài sản',
                    'Phân công trưởng bộ phận quản lý nhân viên',
                    'Giám sát và đánh giá hiệu quả sử dụng'
                ],
                manager: [
                    'Đăng nhập và làm quen với giao diện',
                    'Xem danh sách nhân viên thuộc quyền quản lý',
                    'Cấp tài sản cho nhân viên theo nhu cầu',
                    'Theo dõi tình trạng và mức độ sử dụng',
                    'Xử lý các yêu cầu và báo cáo từ nhân viên'
                ],
                employee: [
                    'Đăng nhập và xem tài sản được giao',
                    'Cập nhật thông tin sử dụng định kỳ',
                    'Báo cáo sự cố hoặc hư hỏng',
                    'Theo dõi thông báo từ quản lý'
                ]
            }
        },
        {
            id: 'features',
            title: 'Hướng dẫn Chức năng Chi tiết',
            icon: <Package className="w-5 h-5" />,
            priority: 'medium',
            content: {
                sections: [
                    {
                        title: 'Quản lý Yêu cầu',
                        icon: <FileText className="w-4 h-4" />,
                        items: [
                            {
                                feature: 'Tạo yêu cầu mới',
                                desc: 'Vào menu "Yêu cầu" → Nhấn "Tạo mới" → Chọn loại yêu cầu → Điền đầy đủ thông tin → Gửi',
                                level: 'trưởng bộ phận'
                            },
                            {
                                feature: 'Theo dõi yêu cầu',
                                desc: 'Xem danh sách yêu cầu với trạng thái: Chờ xử lý, Đã phê duyệt, Từ chối',
                                level: 'tất cả'
                            },
                            {
                                feature: 'Xử lý yêu cầu',
                                desc: 'Quản trị viên xem chi tiết yêu cầu → Đánh giá → Phê duyệt/Từ chối → Thêm ghi chú',
                                level: 'quản trị viên'
                            }
                        ]
                    },
                    {
                        title: 'Quản lý Tài sản',
                        icon: <Package className="w-4 h-4" />,
                        items: [
                            {
                                feature: 'Xem tài sản cá nhân',
                                desc: 'Menu "Tài sản của tôi" → Xem danh sách với thông tin chi tiết và trạng thái',
                                level: 'tất cả'
                            },
                            {
                                feature: 'Cập nhật thông tin tài sản',
                                desc: 'Chọn tài sản → "Chỉnh sửa" → Cập nhật thông tin cần thiết → Lưu thay đổi',
                                level: 'nhân viên'
                            },
                            {
                                feature: 'Phân công tài sản',
                                desc: 'Menu "Quản lý tài sản" → Chọn tài sản trống → Gán cho nhân viên → Xác nhận',
                                level: 'trưởng bộ phận'
                            }
                        ]
                    },
                    {
                        title: 'Hệ thống Thông báo',
                        icon: <Bell className="w-4 h-4" />,
                        items: [
                            {
                                feature: 'Xem thông báo',
                                desc: 'Click vào biểu tượng chuông → Xem danh sách thông báo mới và cũ',
                                level: 'tất cả'
                            },
                            {
                                feature: 'Tạo thông báo',
                                desc: 'Menu "Thông báo" → "Tạo mới" → Nhập tiêu đề và nội dung → Chọn người nhận → Gửi',
                                level: 'trưởng bộ phận'
                            },
                            {
                                feature: 'Thông báo tự động',
                                desc: 'Hệ thống tự động gửi thông báo khi tài sản sắp hết hạn, cần bảo trì',
                                level: 'hệ thống'
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'tips',
            title: 'Mẹo và Xử lý Sự cố',
            icon: <HelpCircle className="w-5 h-5" />,
            priority: 'low',
            content: {
                security: [
                    'Đăng xuất ngay sau khi sử dụng xong để bảo mật tài khoản',
                    'Thay đổi mật khẩu định kỳ mỗi 3-6 tháng',
                    'Không chia sẻ thông tin đăng nhập với bất kỳ ai',
                    'Báo cáo ngay cho quản trị viên nếu phát hiện hoạt động bất thường',
                    'Sử dụng mật khẩu mạnh với ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt'
                ],
                tips: [
                    'Kiểm tra thông báo hàng ngày để không bỏ lỡ thông tin quan trọng',
                    'Cập nhật thông tin tài sản kịp thời khi có thay đổi',
                    'Sử dụng bộ lọc và tìm kiếm để nhanh chóng tìm thấy tài sản',
                    'Sao lưu dữ liệu quan trọng trước khi thực hiện thay đổi lớn',
                    'Liên hệ bộ phận hỗ trợ thay vì tự xử lý khi gặp vấn đề phức tạp'
                ],
                troubleshooting: [
                    {
                        issue: 'Quên mật khẩu đăng nhập',
                        solution: 'Liên hệ quản trị viên hoặc sử dụng chức năng "Quên mật khẩu" nếu có',
                        severity: 'medium'
                    },
                    {
                        issue: 'Không thấy tài sản được giao',
                        solution: 'Kiểm tra với trưởng bộ phận về việc phân công hoặc liên hệ quản trị viên',
                        severity: 'low'
                    },
                    {
                        issue: 'Lỗi khi cập nhật thông tin',
                        solution: 'Làm mới trang, kiểm tra kết nối mạng hoặc liên hệ IT support',
                        severity: 'medium'
                    },
                    {
                        issue: 'Không nhận được thông báo',
                        solution: 'Kiểm tra cài đặt thông báo trong tài khoản hoặc liên hệ quản trị viên',
                        severity: 'low'
                    },
                    {
                        issue: 'Hệ thống chậm hoặc không phản hồi',
                        solution: 'Kiểm tra kết nối internet, xóa cache trình duyệt hoặc thử trình duyệt khác',
                        severity: 'high'
                    }
                ]
            }
        },
        {
            id: 'shortcuts',
            title: 'Phím tắt và Mẹo nhanh',
            icon: <Star className="w-5 h-5" />,
            priority: 'low',
            content: {
                shortcuts: [
                    { key: 'Ctrl + F', action: 'Tìm kiếm nhanh trong trang hiện tại' },
                    { key: 'F5', action: 'Làm mới trang' },
                    { key: 'Ctrl + D', action: 'Thêm trang vào bookmark' },
                    { key: 'Ctrl + Shift + T', action: 'Mở lại tab vừa đóng' }
                ],
                quickActions: [
                    'Double-click vào tài sản để xem chi tiết nhanh',
                    'Sử dụng thanh tìm kiếm toàn cục để tìm nhanh',
                    'Click chuột phải để mở menu ngữ cảnh',
                    'Sử dụng bộ lọc để thu hẹp danh sách hiển thị'
                ]
            }
        }
    ], [permissions]);

    const filteredData = useMemo(() => {
        if (!searchTerm) return guideData;

        return guideData.filter(section =>
            section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            JSON.stringify(section.content).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [guideData, searchTerm]);

    const RoleBadge = ({ level, desc, color, features }) => (
        <div className={`px-4 py-4 rounded-lg ${color} border transition-all hover:shadow-md`}>
            <div className="font-semibold text-base mb-2">{level}</div>
            <div className="text-sm opacity-90 mb-3 leading-relaxed">{desc}</div>
            <div className="space-y-1">
                {features.map((feature, idx) => (
                    <div key={idx} className="text-xs opacity-80 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="leading-relaxed">{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const PermissionIcon = ({ hasPermission }) => (
        hasPermission ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
            <X className="w-5 h-5 text-gray-400" />
        )
    );

    const PermissionTable = ({ permissions }) => {
        const groupedPermissions = useMemo(() => {
            return permissions.reduce((groups, perm) => {
                const category = perm.category || 'other';
                if (!groups[category]) groups[category] = [];
                groups[category].push(perm);
                return groups;
            }, {});
        }, [permissions]);

        const categoryNames = {
            'workflow': 'Quy trình làm việc',
            'asset': 'Quản lý tài sản',
            'management': 'Quản lý hệ thống',
            'communication': 'Giao tiếp',
            'monitoring': 'Giám sát'
        };

        return (
            <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category}>
                        <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                            {categoryNames[category] || 'Khác'}
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Chức năng</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-red-800">Quản trị viên</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-800">Trưởng bộ phận</th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-800">Nhân viên</th>
                                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {perms.map((perm, idx) => (
                                        <tr key={idx} className={`transition-colors hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                            <td className="border border-gray-300 px-4 py-3 font-medium">{perm.action}</td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <PermissionIcon hasPermission={perm.admin} />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <PermissionIcon hasPermission={perm.manager} />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                <PermissionIcon hasPermission={perm.employee} />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600 leading-relaxed">{perm.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const PriorityBadge = ({ priority }) => {
        const styles = {
            high: 'bg-red-100 text-red-800 border-red-200',
            medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            low: 'bg-green-100 text-green-800 border-green-200'
        };

        const labels = {
            high: 'Quan trọng',
            medium: 'Trung bình',
            low: 'Tham khảo'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[priority]}`}>
                {labels[priority]}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <button
                                className="sm:hidden menu-button p-2 rounded-md border bg-white hover:bg-gray-50 transition-colors"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                            </button>
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                                <Book className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    Hướng dẫn Sử dụng Hệ thống
                                </h1>
                                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                                    Tài liệu hướng dẫn chi tiết cho hệ thống quản lý tài sản doanh nghiệp
                                </p>
                            </div>
                        </div>

                        <div className="w-full sm:w-80">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm hướng dẫn..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div
                        className={`fixed inset-y-0 left-0 w-72 bg-white border-r shadow-xl z-50 transform transition-transform duration-300 ease-in-out sm:static sm:translate-x-0 sm:w-80 sm:shadow-sm sidebar ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                            }`}
                    >
                        <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-900">Mục lục</h2>
                            <button
                                className="sm:hidden p-2 rounded-md hover:bg-gray-200 transition-colors"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <nav className="p-2 max-h-screen overflow-y-auto">
                            {filteredData.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`w-full flex items-center justify-between space-x-3 px-3 py-3 rounded-md text-left transition-all duration-200 group ${activeSection === section.id
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-1 rounded transition-colors ${activeSection === section.id ? 'bg-blue-200' : 'bg-gray-200 group-hover:bg-gray-300'
                                            }`}>
                                            {section.icon}
                                        </div>
                                        <span className="text-sm font-medium">{section.title}</span>
                                    </div>
                                    {section.priority && (
                                        <PriorityBadge priority={section.priority} />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Overlay */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Main Content */}
                    <div className="flex-1 max-w-full">
                        <div className="space-y-6">
                            {filteredData.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                                    <p className="text-gray-600">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
                                </div>
                            ) : (
                                filteredData.map((section) => (
                                    <div key={section.id} id={section.id} className="scroll-mt-6">
                                        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                            {/* Section Header */}
                                            <div
                                                className="flex items-center justify-between p-6 border-b cursor-pointer hover:bg-gray-50 transition-colors group"
                                                onClick={() => toggleSection(section.id)}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                        {section.icon}
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                                                        {section.priority && <PriorityBadge priority={section.priority} />}
                                                    </div>
                                                </div>
                                                {expandedSections[section.id] ? (
                                                    <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                                                )}
                                            </div>

                                            {/* Section Content */}
                                            {expandedSections[section.id] && (
                                                <div className="p-6">
                                                    {/* Introduction Section */}
                                                    {section.id === 'intro' && (
                                                        <div className="space-y-8">
                                                            <div>
                                                                <p className="text-gray-700 text-lg leading-relaxed mb-6">{section.content.description}</p>

                                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                                                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                                                        <Info className="w-5 h-5 mr-2" />
                                                                        Tính năng chính
                                                                    </h4>
                                                                    <div className="grid sm:grid-cols-2 gap-2">
                                                                        {section.content.features.map((feature, idx) => (
                                                                            <div key={idx} className="flex items-center text-blue-800">
                                                                                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                                                                                <span className="text-sm">{feature}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 mb-6 text-xl flex items-center">
                                                                    <Users className="w-6 h-6 mr-2 text-gray-600" />
                                                                    Phân cấp Người dùng
                                                                </h3>
                                                                <div className="grid gap-6 lg:grid-cols-3">
                                                                    {section.content.roles.map((role, idx) => (
                                                                        <RoleBadge key={idx} {...role} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Permissions Matrix */}
                                                    {section.id === 'permissions' && (
                                                        <div className="space-y-6">
                                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                                <div className="flex items-start space-x-3">
                                                                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                                    <div>
                                                                        <h4 className="font-semibold text-yellow-900 mb-1">Lưu ý quan trọng</h4>
                                                                        <p className="text-yellow-800 text-sm leading-relaxed">
                                                                            Bảng dưới đây mô tả chi tiết quyền hạn của từng cấp độ người dùng.
                                                                            Chỉ thực hiện các chức năng trong phạm vi quyền hạn của bạn.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <PermissionTable permissions={section.content.permissions} />
                                                        </div>
                                                    )}

                                                    {/* Workflow */}
                                                    {section.id === 'workflow' && (
                                                        <div className="space-y-8">
                                                            <div className="grid gap-6 lg:grid-cols-3">
                                                                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                                                    <h3 className="font-semibold text-red-800 mb-4 flex items-center">
                                                                        <Shield className="w-5 h-5 mr-2" />
                                                                        Quy trình Quản trị viên
                                                                    </h3>
                                                                    <ol className="list-decimal list-inside text-sm text-red-700 space-y-3">
                                                                        {section.content.admin.map((item, idx) => (
                                                                            <li key={idx} className="leading-relaxed">{item}</li>
                                                                        ))}
                                                                    </ol>
                                                                </div>

                                                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                                                    <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
                                                                        <Users className="w-5 h-5 mr-2" />
                                                                        Quy trình Trưởng bộ phận
                                                                    </h3>
                                                                    <ol className="list-decimal list-inside text-sm text-blue-700 space-y-3">
                                                                        {section.content.manager.map((item, idx) => (
                                                                            <li key={idx} className="leading-relaxed">{item}</li>
                                                                        ))}
                                                                    </ol>
                                                                </div>

                                                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                                                    <h3 className="font-semibold text-green-800 mb-4 flex items-center">
                                                                        <User className="w-5 h-5 mr-2" />
                                                                        Quy trình Nhân viên
                                                                    </h3>
                                                                    <ol className="list-decimal list-inside text-sm text-green-700 space-y-3">
                                                                        {section.content.employee.map((item, idx) => (
                                                                            <li key={idx} className="leading-relaxed">{item}</li>
                                                                        ))}
                                                                    </ol>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Features Guide */}
                                                    {section.id === 'features' && (
                                                        <div className="space-y-8">
                                                            {section.content.sections.map((sec, idx) => (
                                                                <div key={idx}>
                                                                    <h3 className="font-semibold text-gray-900 mb-6 text-xl flex items-center">
                                                                        {sec.icon}
                                                                        <span className="ml-2">{sec.title}</span>
                                                                    </h3>
                                                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                                        {sec.items.map((item, itemIdx) => {
                                                                            const levelColors = {
                                                                                'quản trị viên': 'border-l-red-400 bg-red-50',
                                                                                'trưởng bộ phận': 'border-l-blue-400 bg-blue-50',
                                                                                'nhân viên': 'border-l-green-400 bg-green-50',
                                                                                'tất cả': 'border-l-purple-400 bg-purple-50',
                                                                                'hệ thống': 'border-l-gray-400 bg-gray-50'
                                                                            };
                                                                            return (
                                                                                <div key={itemIdx} className={`p-4 rounded-lg border border-l-4 transition-all hover:shadow-md ${levelColors[item.level] || 'border-l-gray-400 bg-gray-50'}`}>
                                                                                    <div className="flex items-start justify-between mb-2">
                                                                                        <h4 className="font-medium text-gray-900">{item.feature}</h4>
                                                                                        {item.level && (
                                                                                            <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600 border ml-2 flex-shrink-0">
                                                                                                {item.level}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Tips and Troubleshooting */}
                                                    {section.id === 'tips' && (
                                                        <div className="space-y-8">
                                                            {/* Security */}
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-xl">
                                                                    <Shield className="w-6 h-6 mr-2 text-red-600" />
                                                                    Hướng dẫn Bảo mật
                                                                </h3>
                                                                <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                                        {section.content.security.map((item, idx) => (
                                                                            <div key={idx} className="flex items-start space-x-3">
                                                                                <Shield className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                                                                                <span className="text-red-700 text-sm leading-relaxed">{item}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Tips */}
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-xl">
                                                                    <Star className="w-6 h-6 mr-2 text-green-600" />
                                                                    Mẹo sử dụng hiệu quả
                                                                </h3>
                                                                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                                        {section.content.tips.map((item, idx) => (
                                                                            <div key={idx} className="flex items-start space-x-3">
                                                                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                                                <span className="text-green-700 text-sm leading-relaxed">{item}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Troubleshooting */}
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-xl">
                                                                    <HelpCircle className="w-6 h-6 mr-2 text-blue-600" />
                                                                    Xử lý sự cố thường gặp
                                                                </h3>
                                                                <div className="space-y-4">
                                                                    {section.content.troubleshooting.map((item, idx) => {
                                                                        const severityColors = {
                                                                            'high': 'bg-red-50 border-red-200',
                                                                            'medium': 'bg-yellow-50 border-yellow-200',
                                                                            'low': 'bg-blue-50 border-blue-200'
                                                                        };
                                                                        const severityIcons = {
                                                                            'high': <AlertTriangle className="w-4 h-4 text-red-600" />,
                                                                            'medium': <Info className="w-4 h-4 text-yellow-600" />,
                                                                            'low': <HelpCircle className="w-4 h-4 text-blue-600" />
                                                                        };
                                                                        return (
                                                                            <div key={idx} className={`p-4 rounded-lg border transition-all hover:shadow-md ${severityColors[item.severity]}`}>
                                                                                <div className="flex items-start space-x-3 mb-2">
                                                                                    {severityIcons[item.severity]}
                                                                                    <div className="flex-1">
                                                                                        <div className="font-medium text-gray-900 mb-1">❓ {item.issue}</div>
                                                                                        <div className="text-sm text-gray-700">💡 {item.solution}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Shortcuts Section */}
                                                    {section.id === 'shortcuts' && (
                                                        <div className="space-y-8">
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-xl">
                                                                    <Star className="w-6 h-6 mr-2 text-purple-600" />
                                                                    Phím tắt hữu ích
                                                                </h3>
                                                                <div className="grid sm:grid-cols-2 gap-4">
                                                                    {section.content.shortcuts.map((item, idx) => (
                                                                        <div key={idx} className="bg-purple-50 p-4 rounded-lg border border-purple-200 flex items-center justify-between">
                                                                            <span className="text-purple-700 font-mono text-sm bg-white px-2 py-1 rounded border">
                                                                                {item.key}
                                                                            </span>
                                                                            <span className="text-purple-800 text-sm ml-3 flex-1">{item.action}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-xl">
                                                                    <Activity className="w-6 h-6 mr-2 text-indigo-600" />
                                                                    Thao tác nhanh
                                                                </h3>
                                                                <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
                                                                    <div className="space-y-3">
                                                                        {section.content.quickActions.map((action, idx) => (
                                                                            <div key={idx} className="flex items-start space-x-3">
                                                                                <Activity className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
                                                                                <span className="text-indigo-700 text-sm leading-relaxed">{action}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Enhanced Footer */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg shadow-sm">
                            <div className="text-center mb-6">
                                <h3 className="font-semibold text-gray-900 mb-2 text-xl flex items-center justify-center">
                                    <HelpCircle className="w-6 h-6 mr-2 text-blue-600" />
                                    Liên hệ hỗ trợ
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn sử dụng hệ thống hiệu quả nhất
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white p-4 rounded-lg border border-red-200 text-center hover:shadow-md transition-all">
                                    <Shield className="w-8 h-8 text-red-600 mx-auto mb-3" />
                                    <div className="font-medium text-red-800 mb-1">Quản trị viên hệ thống</div>
                                    <div className="text-red-600 text-sm leading-relaxed">
                                        Hỗ trợ kỹ thuật, quản lý tài khoản và cấu hình hệ thống
                                    </div>
                                    <div className="mt-3 text-xs text-red-500">
                                        Thời gian phản hồi: 2-4 giờ
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-blue-200 text-center hover:shadow-md transition-all">
                                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                    <div className="font-medium text-blue-800 mb-1">Trưởng bộ phận trực tiếp</div>
                                    <div className="text-blue-600 text-sm leading-relaxed">
                                        Hỗ trợ nghiệp vụ, phân công tài sản và quy trình làm việc
                                    </div>
                                    <div className="mt-3 text-xs text-blue-500">
                                        Thời gian phản hồi: 1-2 giờ
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-purple-200 text-center hover:shadow-md transition-all">
                                    <Settings className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                                    <div className="font-medium text-purple-800 mb-1">IT Helpdesk</div>
                                    <div className="text-purple-600 text-sm leading-relaxed">
                                        Hỗ trợ các vấn đề kỹ thuật, lỗi hệ thống và cập nhật
                                    </div>
                                    <div className="mt-3 text-xs text-purple-500">
                                        Thời gian phản hồi: 30 phút - 1 giờ
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
                                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <Info className="w-4 h-4" />
                                        <span>Phiên bản: 2.1.0</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-400"></div>
                                    <div className="flex items-center space-x-1">
                                        <Activity className="w-4 h-4" />
                                        <span>Cập nhật cuối: {new Date().toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-400"></div>
                                    <div className="flex items-center space-x-1">
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Tài liệu API</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserGuide;