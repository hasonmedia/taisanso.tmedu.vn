import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosConfig from '../axiosConfig';

const SSOLogin = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSSOLogin = async (e) => {
        e.preventDefault();
        console.log('SSO Login initiated with email:', email);
        if (!email) {
            toast.error('Vui lòng nhập email');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Email không hợp lệ');
            return;
        }

        try {
            setLoading(true);

            // Call API để khởi tạo SSO
            const response = await axiosConfig.post('/sso/initiate', { email });

            if (response.success && response.url) {
                // Chuyển hướng đến WorkOS
                window.location.href = response.url;
            } else {
                toast.error('Không thể khởi tạo SSO');
            }
        } catch (error) {
            console.error('SSO Error:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập SSO');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Hoặc</span>
                </div>
            </div>

            <div className="mt-6">
                <form onSubmit={handleSSOLogin} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email công ty để đăng nhập SSO"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all flex items-center justify-center
              ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 active:scale-95"
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Đang chuyển hướng...
                            </>
                        ) : (
                            <>
                                🔐 Đăng nhập với SSO
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-2 text-xs text-gray-500 text-center">
                    Sử dụng email công ty của bạn để đăng nhập thông qua Single Sign-On
                </p>
            </div>
        </div>
    );
};

export default SSOLogin;