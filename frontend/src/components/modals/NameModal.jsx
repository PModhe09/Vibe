import React, { useState } from 'react';

const NameModal = ({ isOpen, onClose, onSave, initialName }) => {
    const [name, setName] = useState(initialName || '');

    const handleSave = () => {
        onSave(name);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl mb-4">Change Name</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                    placeholder="Enter new name"
                />
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NameModal;
