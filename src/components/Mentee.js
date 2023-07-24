import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Mentee = () => {
    const [profile, setProfile] = useState({
        name: 'Mentee Name',
        email: sessionStorage.getItem('userEmail') || 'mentee@example.com',
        classrooms: [
            { id: 1, subject: 'Math', standard: '9th' },
            { id: 2, subject: 'Science', standard: '10th' },
            { id: 3, subject: 'English', standard: '8th' },
        ],
        isProfileOpen: false,
    });

    const handleOpenProfile = () => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            isProfileOpen: true,
        }));
    };

    const handleCloseProfile = () => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            isProfileOpen: false,
        }));
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (e.target.closest('.profile-icon')) {
                return;
            }
            handleCloseProfile();
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-blue-500 text-white py-4 px-8 flex justify-between">
                <h1 className="text-2xl font-bold">Mentee Page</h1>
                <div className="relative inline-block profile-icon">
                    <button className="text-white" onClick={handleOpenProfile}>
                        <FontAwesomeIcon icon={faUserCircle} size="2x" />
                    </button>
                    {profile.isProfileOpen && (
                        <div
                            className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ul className="list-none">
                                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Email: {profile.email}
                                </li>
                                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Notifications
                                </li>
                                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Link to="/login">Logout</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
            {/* Navbar */}

            {/* Main content */}
            <main className="container mx-auto flex-grow py-8">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded shadow p-4">
                        <h3 className="text-xl font-semibold mb-2">Classrooms</h3>
                        {profile.classrooms.map((classroom) => (
                            <div
                                key={classroom.id}
                                className="mb-4 p-4 border border-gray-300 rounded"
                            >
                                <h4 className="text-lg font-semibold">
                                    {classroom.subject} - {classroom.standard}
                                </h4>
                                <Link
                                    to={`/mentee/classroom/${classroom.id}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2 inline-block"
                                    style={{ marginLeft: 'auto' }}
                                >
                                    View Classroom
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Mentee;
