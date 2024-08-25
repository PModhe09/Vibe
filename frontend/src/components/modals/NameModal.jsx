import React, { useState } from 'react';

const NameModal = ({ isOpen, onClose, onSave, initialName }) => {
    const [name, setName] = useState(initialName || '');

    const handleSave = () => {
        onSave(name);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-3xl shadow-2xl transform transition-all duration-500 scale-95 hover:scale-100">
                <div className="absolute -top-4 -right-4 h-16 w-16 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-500 font-bold text-2xl cursor-pointer transition-transform transform hover:rotate-180 hover:text-red-500"
                     onClick={onClose}>
                    &times;
                </div>
                <h2 className="text-2xl text-white font-bold mb-4 text-center animate-pulse">Enter Playlist Name</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-full mb-6 text-center bg-white text-indigo-500 font-semibold shadow-inner focus:outline-none focus:ring-4 focus:ring-pink-300 transition-all"
                    placeholder="Enter playlist name"
                />
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full font-bold shadow-md transition-transform transform hover:scale-110"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white rounded-full font-bold shadow-md transition-transform transform hover:scale-110"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NameModal;
