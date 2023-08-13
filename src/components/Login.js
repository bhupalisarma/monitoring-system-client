import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            // Retrieve the access token from the response
            const accessToken = response.data.token;

            // Store the access token in local storage
            localStorage.setItem('accessToken', accessToken);

            // Store the email in session storage
            sessionStorage.setItem('userEmail', email);

            // Check the role of the user
            const userRole = response.data.role;

            // Navigate to respective pages based on the user's role
            if (userRole === 'admin') {
                navigate('/admin');
            } else if (userRole === 'mentor') {
                navigate('/mentor');
            } else if (userRole === 'mentee') {
                navigate('/mentee');
            } else {
                // Handle unknown role or error case
                console.log('Unknown role or error occurred');
            }
        } catch (error) {
            // Handle any error that occurred during login
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred during login');
            }
        }
    };
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-indigo-500">
            <div className="bg-white rounded-lg shadow-lg p-8 w-96">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="text-red-600 text-center">
                            <p>{error}</p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="text-gray-800 font-medium block">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-indigo-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-gray-800 font-medium block">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-indigo-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-500 text-white py-2 px-4 rounded w-full hover:bg-indigo-600 transition-colors duration-300"
                        disabled={isLoading} // Disable the button when loading
                    >
                        {isLoading ? (
                            <>
                                <Spinner aria-label="Loading" />
                                <span className="pl-3">Loading...</span>
                            </>
                        ) : (
                            'Log In'
                        )}
                    </button>
                    <div className="text-center">
                        <p className="text-gray-500">Don't have an account?</p>
                        <a
                            href="/signup"
                            className="text-indigo-500 hover:text-indigo-700 font-semibold transition-colors duration-300"
                        >
                            Sign up
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
