import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosConfig from '../../axiosConfig';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const token = searchParams.get('token');

    useEffect(() => {
        console.log('🔍 ResetPassword component mounted');
        console.log('Token from URL:', token);
        console.log('Full URL:', window.location.href);

        if (!token) {
            console.log('❌ No token found, redirecting to login');
            toast.error('Token không hợp lệ');
            navigate('/login');
            return;
        }

        verifyToken();
    }, [token, navigate]);

    const verifyToken = async () => {
        try {
            console.log('🔍 Verifying token:', token);
            setVerifying(true);
            const response = await axiosConfig.get(`/auth/verify-token/${token}`);
            console.log('✅ Token verification response:', response);

            if (response.valid) {
                console.log('✅ Token is valid');
                setTokenValid(true);
            } else {
                console.log('❌ Token is invalid');
                toast.error('Token không hợp lệ hoặc đã hết hạn');
                navigate('/login');
            }
        } catch (error) {
            console.error('❌ Error verifying token:', error);
            toast.error('Token không hợp lệ hoặc đã hết hạn');
            navigate('/login');
        } finally {
            setVerifying(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            setLoading(true);
            console.log('🔄 Submitting new password for token:', formData);
            await axiosConfig.post('/auth/reset-password', {
                token,
                newPassword: formData.newPassword
            });

            toast.success('Đặt lại mật khẩu thành công!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang xác thực token...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đặt lại mật khẩu
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Nhập mật khẩu mới cho tài khoản của bạn
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu mới
                            </label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Nhập mật khẩu mới"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                minLength="6"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Xác nhận mật khẩu mới"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang xử lý...
                                </div>
                            ) : (
                                'Đặt lại mật khẩu'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                            ← Quay lại đăng nhập
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;