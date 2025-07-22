import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const [user, setUser] = useState(null);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, setUser);
        return unsub;
    }, [auth]);

    const logout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow z-20 flex justify-between items-center px-4 h-16">
            <Link to="/dashboard" className="text-green-700 font-bold text-xl">🌿 Rooted</Link>
            {user ? (
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700">{user.email}</span>
                    <button onClick={logout} className="btn btn-blue">Logout</button>
                </div>
            ) : (
                <div className="space-x-4">
                    <Link to="/login" className="text-green-600 hover:underline">Login</Link>
                    <Link to="/signup" className="text-green-600 hover:underline">Signup</Link>
                </div>
            )}
        </header>
    );
}