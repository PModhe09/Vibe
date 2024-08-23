import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

function Sidebar({ onLoginSignupClick, onClose }) {
    const { jwtToken, user, setJwtToken, setUser } = useAuthStore(state => ({
        jwtToken: state.jwtToken,
        user: state.user,
        setJwtToken: state.setJwtToken,
        setUser: state.setUser,
    }));

    const handleLogout = () => {
        localStorage.removeItem('user');
        setJwtToken(null);
        setUser(null);
    };

    const handleSongLibraryClick = (e) => {
        if (!jwtToken) {
            e.preventDefault();
            onLoginSignupClick(); 
        }
    };

    return (
        <div className="w-64 h-full bg-primary text-white p-4 shadow-lg relative">
            <button 
                className="absolute top-4 right-4 text-2xl font-semibold md:hidden" 
                onClick={onClose}
            >
                &times;
            </button>
            
            <h1 className="text-3xl mb-8 font-semibold">Vibe Music</h1>
            {jwtToken && (
                <div className="mb-6">
                    <h2 className="text-xl">Welcome! {user}</h2> 
                </div>
            )}

            <nav className="flex flex-col space-y-4 mb-8">
                <Link 
                    to="/" 
                    className="bg-secondary hover:bg-opacity-80 transition-colors text-white py-3 px-4 rounded text-center font-medium shadow-md"
                >
                    Home
                </Link>
                <Link 
                    to="/tracks" 
                    onClick={handleSongLibraryClick} 
                    className="bg-secondary hover:bg-opacity-80 transition-colors text-white py-3 px-4 rounded text-center font-medium shadow-md"
                >
                    Song Library
                </Link>
            </nav>

            {jwtToken ? (
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 transition-colors text-white py-3 px-4 rounded w-full font-medium shadow-md"
                >
                    Logout
                </button>
            ) : (
                <button
                    onClick={onLoginSignupClick}
                    className="bg-secondary hover:bg-opacity-80 transition-colors text-white py-3 px-4 rounded w-full font-medium shadow-md"
                >
                    Login/Signup
                </button>
            )}
        </div>
    );
}

export default Sidebar;
