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
        <div className="w-64 h-full bg-gradient-to-b from-primary to-secondary text-white p-6 shadow-2xl relative overflow-hidden">
            <button 
                className="absolute top-4 right-4 text-3xl font-bold md:hidden hover:text-secondary transition-colors duration-300"
                onClick={onClose}
            >
                &times;
            </button>

            <div className="absolute inset-0 bg-gradient-radial from-transparent to-secondary opacity-40 blur-2xl z-0"></div>

            <h1 className="text-4xl mb-10 font-extrabold relative z-10 animate-pulse">Vibe Music</h1>
            
            {jwtToken && (
                <div className="mb-10 relative z-10">
                    <h2 className="text-2xl font-semibold">Welcome, <span className="text-yellow-300">{user}</span>!</h2> 
                </div>
            )}

            <nav className="flex flex-col space-y-6 mb-12 relative z-10">
                <Link 
                    to="/" 
                    className="bg-secondary hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-500 hover:to-red-500 text-white py-3 px-5 rounded-full text-center font-semibold shadow-lg transform transition-transform duration-300 hover:-translate-y-1"
                >
                    Home
                </Link>
                <Link 
                    to="/tracks" 
                    onClick={handleSongLibraryClick} 
                    className="bg-secondary hover:bg-gradient-to-r hover:from-green-400 hover:via-blue-500 hover:to-purple-500 text-white py-3 px-5 rounded-full text-center font-semibold shadow-lg transform transition-transform duration-300 hover:-translate-y-1"
                >
                    Song Library
                </Link>
            </nav>

            {jwtToken ? (
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 transition-colors text-white py-3 px-5 rounded-full w-full font-semibold shadow-lg transform transition-transform duration-300 hover:-translate-y-1 relative z-10"
                >
                    Logout
                </button>
            ) : (
                <button
                    onClick={onLoginSignupClick}
                    className="bg-green-500 text-white py-3 px-5 rounded-full w-full font-semibold shadow-lg transform transition-transform duration-300 hover:-translate-y-1 relative z-10"
                >
                    Login/Signup
                </button>
            )}
        </div>
    );
}

export default Sidebar;
