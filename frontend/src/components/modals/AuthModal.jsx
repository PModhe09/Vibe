import React, { useState } from 'react';
import axios from 'axios';

import useAuthStore from '../../stores/useAuthStore';

const AuthModal = ({ closeModal }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setJwtToken, setUser } = useAuthStore(state => ({
        setJwtToken: state.setJwtToken,
        setUser: state.setUser
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isLogin
                ? 'https://vibe-backend-ybmd.onrender.com/api/auth/login'
                : 'https://vibe-backend-ybmd.onrender.com/api/auth/signup';
            const response = await axios.post(url, {
                email,
                username: username,
                password
            });
            localStorage.setItem('jwtToken', response.data.token);
            console.log(response.data);
            console.log(response.data.userName);
            localStorage.setItem('user', JSON.stringify(response.data.userName));
            setJwtToken(response.data.token);
            setUser(response.data.userName);
            closeModal();
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    };

    return (
        <div>

            <div className="fixed inset-0 bg-gray-800 bg-opacity-90 backdrop-blur-sm z-40"></div>

            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative">
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-gray-600 text-2xl"
                    >
                        &times;
                    </button>
                    <h2 className="text-2xl mb-4 text-center">{isLogin ? 'Login' : 'Signup'}</h2>
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="mb-4">
                                <label className="block text-gray-700">Username:</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-gray-700">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded"
                            >
                                {isLogin ? 'Login' : 'Signup'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-600"
                            >
                                {isLogin ? 'Need an account? Signup' : 'Already have an account? Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </div>
    );
};

export default AuthModal;
