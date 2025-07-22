import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, Plus, Info } from 'lucide-react';

export default function Layout() {
    const location = useLocation();
    const hideNav = location.pathname.includes('login');

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <header className="bg-green-800 text-white text-xl font-semibold p-4">
                <Link to="/" className="font-bold text-white">🌱 Rooted</Link>
            </header>

            {/* Page content */}
            <main className="flex-1 p-4">
                <Outlet />
            </main>

            {/* Bottom Nav */}
            {!hideNav && (
                <footer className="bg-white border-t border-gray-200 p-2 fixed bottom-0 w-full flex justify-around items-center">
                    <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-green-700">
                        <Home size={20} /><span className="text-xs">Home</span>
                    </Link>
                    <Link to="/new" className="flex flex-col items-center text-gray-600 hover:text-green-700">
                        <Plus size={20} /><span className="text-xs">Add Plant</span>
                    </Link>
                    <Link to="/about" className="flex flex-col items-center text-gray-600 hover:text-green-700">
                        <Info size={20} /><span className="text-xs">About</span>
                    </Link>
                </footer>
            )}
        </div>
    );
}
