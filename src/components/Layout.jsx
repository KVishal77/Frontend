// src/components/Layout.jsx
import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import BottomNav from './BottomNav';
import { useAuthState } from 'react-firebase-hooks/auth';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    };

    const getUserInitials = (email) => {
        return email ? email.slice(0, 2).toUpperCase() : '';
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Green Header */}
            <header className="bg-green-600 text-white flex justify-between items-center p-4 shadow">
                <h1 className="text-xl font-bold flex items-center">
                    🌿 Rooted
                </h1>
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="bg-white text-green-600 font-semibold px-3 py-1 rounded-full">
                            {getUserInitials(user.email)}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-white text-green-600 px-3 py-1 rounded hover:bg-red-500 hover:text-white"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </header>

            {/* Page Content */}
            <main className="flex-1 p-4">{children}</main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Layout;