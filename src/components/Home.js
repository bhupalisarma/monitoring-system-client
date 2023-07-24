import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-gradient-to-r from-teal-400 to-blue-500 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-5xl font-bold mb-8 text-white text-center">
                    Welcome to the Student Monitoring System
                </h1>
                <p className="text-lg text-white mb-8 text-center">
                    The Student Monitoring System enables mentors and mentees to communicate and collaborate effectively through virtual classrooms, fostering a conducive learning environment.
                </p>
                <div className="text-center">
                    <Link
                        to="/signup"
                        className="bg-white hover:bg-gray-200 text-gray-800 py-3 px-8 rounded-full font-semibold text-lg transition-colors duration-300"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
