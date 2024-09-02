import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

function Sidebar({ onLoginSignupClick, onClose }) { 

    const jwtToken = localStorage.getItem('jwtToken');
    const user = localStorage.getItem('user');
    const handleLogout = () => {
        console.log('Logout button clicked');
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
        onClose(); 
    };

    const handleSongLibraryClick = (e) => {
        if (!jwtToken) {
            e.preventDefault();
            onLoginSignupClick(); 
            onClose(); 
        }
    };

    return (
        <div className="w-64 h-full bg-gradient-to-b from-primary to-secondary text-white p-6 shadow-2xl relative overflow-hidden">
            <button 
                className="absolute top-2 right-4 md:hidden hover:text-secondary transition-colors duration-300"
                
            >
                <X size={24} className='cursor-pointer' onClick={onClose} />
            </button>

            <h1 className="text-4xl font-extrabold mt-6 mb-8 relative z-10 animate-pulse">Vibe Music</h1>
            
            {jwtToken && (
                <div className="mb-10 relative z-10">
                    <h2 className="text-2xl font-semibold">Welcome, <span className="text-yellow-300">{user}</span>!</h2> 
                </div>
            )}

            <nav className="flex flex-col space-y-6 mb-12 relative z-10">
                <Link 
                    to="/" 
                    className="bg-secondary hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-500 hover:to-red-500 text-white py-3 px-5 rounded-full text-center font-semibold shadow-lg transform transition-transform duration-300 hover:-translate-y-1"
                    onClick={onClose} 
                >
                    Home
                </Link>
                <Link 
                    to="/tracks" 
                    onClick={(e) => {
                        handleSongLibraryClick(e);
                        onClose();
                    }} 
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
                    onClick={() => {
                        console.log('Login/Signup button clicked');
                        onLoginSignupClick();
                        onClose();
                    }}
                    className="bg-green-500 text-white py-3 px-5 rounded-full w-full font-semibold shadow-lg transform transition-transform duration-300 hover:-translate-y-1 relative z-10"
                >
                    Login/Signup
                </button>
            )}
        </div>
    );
}

export default Sidebar;
