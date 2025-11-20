import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SimpleResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>🔐 Simple Reset Password Page</h1>
            <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
                <strong>Current URL:</strong> {window.location.href}
            </div>
            <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
                <strong>Token from URL:</strong> {token || 'No token found'}
            </div>
            <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
                <strong>Page Status:</strong> Page loaded successfully!
            </div>
            {token ? (
                <div style={{ color: 'green' }}>
                    ✅ Token detected: {token.substring(0, 50)}...
                </div>
            ) : (
                <div style={{ color: 'red' }}>
                    ❌ No token in URL
                </div>
            )}
        </div>
    );
};

export default SimpleResetPassword;