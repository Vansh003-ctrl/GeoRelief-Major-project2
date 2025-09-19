import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Local storage mein token check karein
    const token = localStorage.getItem('token');
    
    // Agar token nahi hai, to user ko login page par bhej dein
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // Agar token hai, to protected page dikhayein
    return children;
};

export default PrivateRoute;