import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { signIn } = useAuth();
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState([]);
    
    const addLog = (message) => {
        console.log(message);
        setDebugInfo(prev => [...prev, message]);
    };
    
    useEffect(() => {
        const processAuth = async () => {
            try {
                addLog('🔍 Step 1: Parsing URL parameters...');
                
                const accessToken = searchParams.get('accessToken');
                const refreshToken = searchParams.get('refreshToken');
                
                addLog(`Access Token: ${accessToken ? 'Present' : 'MISSING'}`);
                addLog(`Refresh Token: ${refreshToken ? 'Present' : 'MISSING'}`);
                
                if (!accessToken || !refreshToken) {
                    throw new Error('No tokens found in URL');
                }
                
                addLog('✅ Step 2: Saving tokens to localStorage...');
                localStorage.setItem('token', accessToken);
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                addLog('✅ Tokens saved successfully');
                
                addLog('📡 Step 3: Fetching user data from API...');
                addLog('API URL: http://localhost:3000/api/v1/auth/current-user');
                
                // Use axios with the correct backend URL
                const response = await axios.get('http://localhost:3000/api/v1/auth/current-user', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    withCredentials: true
                });
                
                addLog(`✅ Response Status: ${response.status}`);
                addLog(`Response data: ${JSON.stringify(response.data)}`);
                
                const user = response.data.data;
                
                if (!user) {
                    throw new Error('User data not found in response');
                }
                
                addLog(`✅ Step 4: User data extracted`);
                addLog(`User Email: ${user.email}`);
                addLog(`User Role: ${user.role}`);
                
                addLog('✅ Step 5: Calling signIn...');
                if (!signIn) {
                    throw new Error('signIn function not available');
                }
                
                signIn(user);
                addLog('✅ signIn completed');
                
                window.history.replaceState({}, document.title, '/dashboard');
                addLog('🎉 Authentication completed!');
                
                setTimeout(() => {
                    if (user.role === 'volunteer') {
                        navigate('/volunteer', { state: { userType: 'volunteer' }, replace: true });
                    } else if (user.role === 'admin') {
                        navigate('/admin-dashboard', { replace: true });
                    } else {
                        navigate('/dashboard', { replace: true });
                    }
                }, 1000);
                
            } catch (err) {
                addLog(`❌ ERROR: ${err.message}`);
                if (err.response) {
                    addLog(`Response status: ${err.response.status}`);
                    addLog(`Response data: ${JSON.stringify(err.response.data)}`);
                }
                setError(err.message);
                localStorage.clear();
                
                setTimeout(() => {
                    navigate('/login?error=auth_failed', { replace: true });
                }, 3000);
            }
        };
        
        processAuth();
    }, [searchParams, navigate, signIn]);
    
    if (error) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                backgroundColor: '#f8f9fa',
                padding: '20px'
            }}>
                <div style={{
                    padding: '32px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    maxWidth: '600px',
                    width: '100%'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>❌</div>
                    <h2 style={{ color: '#dc3545', marginBottom: '16px', textAlign: 'center' }}>
                        Authentication Failed
                    </h2>
                    <p style={{ color: '#6c757d', marginBottom: '24px', textAlign: 'center' }}>
                        {error}
                    </p>
                    
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '16px',
                        borderRadius: '8px',
                        marginTop: '16px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '12px'
                    }}>
                        <strong>Debug Log:</strong>
                        {debugInfo.map((log, index) => (
                            <div key={index} style={{ 
                                padding: '4px 0',
                                borderBottom: '1px solid #dee2e6'
                            }}>
                                {log}
                            </div>
                        ))}
                    </div>
                    
                    <p style={{ fontSize: '14px', color: '#999', marginTop: '16px', textAlign: 'center' }}>
                        Redirecting to login in 3 seconds...
                    </p>
                </div>
            </div>
        );
    }
    
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            padding: '20px'
        }}>
            <div style={{
                padding: '48px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                textAlign: 'center',
                maxWidth: '600px',
                width: '100%'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '4px solid #e9ecef',
                    borderTop: '4px solid #4CAF50',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 24px'
                }}></div>
                
                <h2 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600',
                    color: '#212529',
                    marginBottom: '16px'
                }}>
                    Completing Sign In
                </h2>
                
                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '16px',
                    borderRadius: '8px',
                    marginTop: '16px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    textAlign: 'left'
                }}>
                    {debugInfo.map((log, index) => (
                        <div key={index} style={{ padding: '2px 0' }}>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
            
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AuthCallback;