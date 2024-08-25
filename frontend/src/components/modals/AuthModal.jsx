import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from '../../stores/useAuthStore';

const AuthModal = ({ closeModal }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const { setJwtToken, setUser } = useAuthStore(state => ({
        setJwtToken: state.setJwtToken,
        setUser: state.setUser
    }));

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        const atIndex = value.indexOf('@');
        const dotIndex = value.lastIndexOf('.');

        if (
            atIndex > 0 &&
            dotIndex > atIndex + 1 &&
            dotIndex < value.length - 1
        ) {
            setEmailError('');
        } else {
            setEmailError('Please enter a valid email address.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError) {
            return; // Don't submit if there's an email error
        }
        try {
            const url = isLogin
                ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`
                : `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`;
            const response = await axios.post(url, {
                email,
                username: username,
                password
            });
            localStorage.setItem('jwtToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.userName));
            setJwtToken(response.data.token);
            setUser(response.data.userName);
            closeModal();
        } catch (error) {
            if (error) {
                const { status } = error.response;
                if (status === 401 || status === 400) {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else if (status === 500) {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } else {
                console.error('Error during authentication:', error);
            }
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="fixed inset-0 bg-gray-800 bg-opacity-90 backdrop-blur-sm z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative">
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-gray-600 text-2xl"
                    >
                        &times;
                    </button>
                    <h2 className="text-2xl mb-4 text-center text-primary border-b-4 border-secondary pb-2">
                        {isLogin ? 'Login' : 'Signup'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="mb-4">
                                <label className="block text-primary">Username:</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Create your Username"
                                    className="w-full border border-secondary p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-primary">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Enter your Email"
                                className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                                    emailError ? 'border-red-500' : 'border-secondary'
                                }`}
                                required
                            />
                            {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-primary">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your Password"
                                className="w-full border border-secondary p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors"
                                disabled={!!emailError}
                            >
                                {isLogin ? 'Login' : 'Signup'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary underline"
                            >
                                {isLogin ? 'Need an account? Signup' : 'Already have an account? Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AuthModal;
