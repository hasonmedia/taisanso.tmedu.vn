import { useState, useEffect } from "react";
import { AlertTriangle, Clock, Bell, Calendar, Eye, EyeOff, Settings, Mail, X } from "lucide-react";
import { AssetStore } from "../../stores/asset";
import { UserStore } from "../../stores/tai_khoan";
import { MailStore } from "../../stores/nhan_mail";
import { capToLetter } from "../../utils/capToLetter";

export default function AssetExpiryWarning() {
    const { getAssetsExpiringSoon } = AssetStore();
    const [expiryData, setExpiryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({
        critical: true,
        warning: true,
        notice: false
    });

    const [isEmailConfigOpen, setIsEmailConfigOpen] = useState(false);
    const { data, getUsers } = UserStore();
    const [availableRecipients, setAvailableRecipients] = useState([]);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const { data: mail, getAllMails, saveMail } = MailStore();

    // Danh sách email mặc định
    const defaultEmails = [
        { id: '1', email: 'Hcns@tmedu.vn', ho_ten: 'Phòng Hành chính nhân sự', cap: 2 },
        { id: '2', email: 'Thaont@tmedu.vn', ho_ten: 'Thaont', cap: 2 },
        { id: '3', email: 'Bantruyenthong@tmedu.vn', ho_ten: 'Ban truyền thông', cap: 2 },
        { id: '4', email: 'Mkt@tmedu.vn', ho_ten: 'Phòng Marketing', cap: 2 },
        { id: '5', email: 'Admin@tmedu.vn', ho_ten: 'Quản trị viên hệ thống', cap: 1 }
    ];

    useEffect(() => {
        fetchExpiryData();
        const fetchEmailData = async () => {
            await getUsers();
            await getAllMails();
        };
        fetchEmailData();
    }, []);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            const filtered = data.filter(user => user.cap === 1 || user.cap === 0);
            // Kết hợp với email mặc định
            setAvailableRecipients([...defaultEmails, ...filtered]);
        } else {
            setAvailableRecipients(defaultEmails);
        }
    }, [data]);

    useEffect(() => {
        if (mail && mail.recipients) {
            setSelectedRecipients(mail.recipients);
        }
    }, [mail]);

    const fetchExpiryData = async () => {
        setLoading(true);
        try {
            const data = await getAssetsExpiringSoon();
            console.log(data);
            setExpiryData(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tài sản sắp hết hạn:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Không có";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const getSeverityColor = (type) => {
        switch (type) {
            case 'critical':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'notice':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getSeverityIcon = (type) => {
        switch (type) {
            case 'critical':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'warning':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'notice':
                return <Bell className="w-5 h-5 text-blue-600" />;
            default:
                return <Calendar className="w-5 h-5 text-gray-600" />;
        }
    };

    const handleOpenEmailConfig = () => {
        setIsEmailConfigOpen(true);
    };

    const handleRecipientChange = (recipient) => {
        setSelectedRecipients(prev => {
            const exists = prev.find(r => r.id === recipient.id);
            if (exists) {
                // bỏ ra nếu đã có
                return prev.filter(r => r.id !== recipient.id);
            } else {
                // thêm object { id, email }
                return [...prev, { id: recipient.id, email: recipient.email || recipient.username }];
            }
        });
    };

    const handleSaveEmailConfig = async () => {
        const config = {
            recipients: selectedRecipients
        };
        try {
            const response = await saveMail(config);
            console.log(response);
            if (response.success) {
                alert("Cấu hình email đã được lưu thành công!");
                setIsEmailConfigOpen(false);
            }
        } catch (error) {
            console.log("Lưu cấu hình thất bại. Vui lòng thử lại.");
        }
    };

    const renderAssetCard = (asset) => (
        <div key={asset.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-semibold text-gray-900">{asset.ten_tai_san}</h4>
                    <p className="text-sm text-gray-600">{asset.danh_muc_tai_san_ten}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${asset.so_ngay_con_lai <= 3 ? 'bg-red-100 text-red-800' :
                    asset.so_ngay_con_lai <= 7 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                    {asset.so_ngay_con_lai} ngày
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-gray-500">Ngày đăng ký:</span>
                    <p className="font-medium">{formatDate(asset.ngay_dang_ky)}</p>
                </div>
                <div>
                    <span className="text-gray-500">Ngày hết hạn:</span>
                    <p className="font-medium text-red-600">{formatDate(asset.ngay_het_han)}</p>
                </div>
            </div>

            {asset.ten_nha_cung_cap && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-gray-500 text-sm">Nhà cung cấp:</span>
                    <p className="font-medium text-sm">{asset.ten_nha_cung_cap}</p>
                </div>
            )}

            {asset.thong_tin && Object.keys(asset.thong_tin).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-gray-500 text-sm">Thông tin chi tiết:</span>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                        {Object.entries(asset.thong_tin).map(([key, value]) => (
                            <div key={key} className="text-xs">
                                <span className="text-gray-500">{key}:</span>
                                <span className="ml-1 font-medium">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderSection = (type, data, title, description) => (
        <div className={`border rounded-lg ${getSeverityColor(type)}`}>
            <div
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={() => toggleSection(type)}
            >
                <div className="flex items-center space-x-3">
                    {getSeverityIcon(type)}
                    <div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                        <p className="text-sm opacity-75">{description}</p>
                    </div>
                    <span className="ml-2 px-3 py-1 bg-white bg-opacity-50 rounded-full text-sm font-bold">
                        {data.count}
                    </span>
                </div>
                <div className="flex items-center">
                    {expandedSections[type] ?
                        <EyeOff className="w-5 h-5" /> :
                        <Eye className="w-5 h-5" />
                    }
                </div>
            </div>

            {expandedSections[type] && data.assets.length > 0 && (
                <div className="px-4 pb-4">
                    <div className="grid gap-3">
                        {data.assets.map(renderAssetCard)}
                    </div>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!expiryData) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">Không thể tải dữ liệu</h3>
                <button
                    onClick={fetchExpiryData}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Cảnh báo tài sản sắp hết hạn
                        </h1>
                        <p className="text-gray-600">
                            Theo dõi và quản lý các tài sản sắp hết hạn trong hệ thống
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleOpenEmailConfig}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                        >
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Cấu hình Email</span>
                            <span className="sm:hidden">Email</span>
                        </button>
                        <button
                            onClick={fetchExpiryData}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Làm mới
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center">
                            <Calendar className="w-8 h-8 text-gray-400" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-500">Tổng cộng</p>
                                <p className="text-2xl font-bold text-gray-900">{expiryData.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                        <div className="flex items-center">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                            <div className="ml-3">
                                <p className="text-sm text-red-600">Khẩn cấp</p>
                                <p className="text-2xl font-bold text-red-700">{expiryData.critical.count}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm">
                        <div className="flex items-center">
                            <Clock className="w-8 h-8 text-yellow-500" />
                            <div className="ml-3">
                                <p className="text-sm text-yellow-600">Cảnh báo</p>
                                <p className="text-2xl font-bold text-yellow-700">{expiryData.warning.count}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                        <div className="flex items-center">
                            <Bell className="w-8 h-8 text-blue-500" />
                            <div className="ml-3">
                                <p className="text-sm text-blue-600">Thông báo</p>
                                <p className="text-2xl font-bold text-blue-700">{expiryData.notice.count}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {expiryData.total === 0 ? (
                    <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
                        <Calendar className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-green-800">Tuyệt vời!</h3>
                        <p className="text-green-600">Hiện tại không có tài sản nào sắp hết hạn trong 10 ngày tới.</p>
                    </div>
                ) : (
                    <>
                        {/* Critical Assets */}
                        {expiryData.critical.count > 0 &&
                            renderSection('critical', expiryData.critical, 'Khẩn cấp (≤ 3 ngày)', 'Các tài sản cần xử lý ngay lập tức')
                        }

                        {/* Warning Assets */}
                        {expiryData.warning.count > 0 &&
                            renderSection('warning', expiryData.warning, 'Cảnh báo (4-7 ngày)', 'Các tài sản cần lên kế hoạch xử lý')
                        }

                        {/* Notice Assets */}
                        {expiryData.notice.count > 0 &&
                            renderSection('notice', expiryData.notice, 'Thông báo (8-10 ngày)', 'Các tài sản cần theo dõi')
                        }
                    </>
                )}
            </div>

            {/* Email Configuration Modal */}
            {isEmailConfigOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsEmailConfigOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center space-x-2 mb-6">
                            <Mail className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-bold text-gray-800">
                                Cấu hình thông báo Email
                            </h3>
                        </div>

                        <div className="space-y-6">
                            {/* Email Settings */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-3">Cài đặt thông báo tài sản sắp hết hạn</h4>
                                <p className="text-sm text-gray-600">
                                    Chọn danh sách người nhận thông báo khi có tài sản sắp hết hạn trong hệ thống.
                                </p>
                            </div>

                            {/* Recipients Selection */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3">
                                    Chọn người nhận thông báo ({selectedRecipients.length} được chọn)
                                </h4>

                                <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                                    {availableRecipients.map((recipient) => (
                                        <div
                                            key={recipient.id}
                                            className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        id={`recipient-${recipient.id}`}
                                                        checked={selectedRecipients.some(r => r.id === recipient.id)}
                                                        onChange={() => handleRecipientChange(recipient)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                    <div className="flex-1">
                                                        <label
                                                            htmlFor={`recipient-${recipient.id}`}
                                                            className="block font-medium text-gray-800 cursor-pointer"
                                                        >
                                                            {recipient.ho_ten}
                                                        </label>
                                                        <div className="text-sm text-gray-600">
                                                            {recipient.email || recipient.username}
                                                        </div>
                                                        <div className="text-xs text-blue-600 font-medium">
                                                            {capToLetter(recipient.cap)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsEmailConfigOpen(false)}
                                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveEmailConfig}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Lưu cấu hình</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}