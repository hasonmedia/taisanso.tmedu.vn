import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function SSOCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { fetchUser } = useAuth();
    const [status, setStatus] = useState('loading'); // loading, success, error

    useEffect(() => {
        const code = searchParams.get('code');
        const ssoSuccess = searchParams.get('sso');

        console.log('SSO Callback - code:', code);
        console.log('SSO Callback - sso param:', ssoSuccess);

        if (code) {
            // Nếu có code từ WorkOS, gọi API backend để xử lý
            handleCodeExchange(code);
        } else if (ssoSuccess === 'success') {
            // Nếu đã đăng nhập thành công (từ backend redirect)
            handleSSOSuccess();
        } else {
            setStatus('error');
        }
    }, [searchParams]);

    const handleCodeExchange = async (code) => {
        try {
            console.log('Đang chuyển hướng đến backend với code:', code);

            // Chuyển hướng trực tiếp đến backend endpoint để xử lý code
            // Backend sẽ xử lý và redirect lại với sso=success
            const state = searchParams.get('state') || '';
            window.location.href = `http://localhost:3000/api/sso/callback?code=${code}&state=${state}`;

        } catch (error) {
            console.error('Lỗi xử lý SSO code:', error);
            setStatus('error');
            toast.error('Có lỗi xảy ra khi xử lý SSO');
        }
    };

    const handleSSOSuccess = async () => {
        try {
            // Fetch user data để cập nhật context
            const userData = await fetchUser();
            console.log('User data sau fetchUser:', userData);

            setStatus('success');
            toast.success('Đăng nhập SSO thành công!');

            // Delay một chút rồi redirect về trang chính
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 1000);

        } catch (error) {
            console.error('Error after SSO success:', error);
            setStatus('error');
            toast.error('Có lỗi xảy ra sau khi đăng nhập');
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang xử lý đăng nhập SSO...</p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto h-24 w-24 text-green-600 mb-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Đăng nhập thành công!
                    </h2>
                    <p className="text-gray-600">
                        Đang chuyển hướng đến dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="mx-auto h-24 w-24 text-red-600 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Đăng nhập không thành công
                </h2>
                <p className="text-gray-600 mb-4">
                    Có lỗi xảy ra trong quá trình đăng nhập SSO
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Quay lại đăng nhập
                </button>
            </div>
        </div>
    );
}