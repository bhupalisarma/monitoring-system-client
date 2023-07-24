import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import axios from 'axios';

const Mentor = () => {
    const [profile, setProfile] = useState({
        name: 'Mentor Name',
        email: sessionStorage.getItem('userEmail') || 'mentor@example.com',
        classrooms: [],
        isProfileOpen: false,
        isAddingClassroom: false,
        newClassroom: { subject: '', standard: '' },
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

    const handleAddClassroom = () => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            isAddingClassroom: true,
        }));
    };

    const handleSubjectChange = (e) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            newClassroom: {
                ...prevProfile.newClassroom,
                subject: e.target.value,
            },
        }));
    };

    const handleStandardChange = (e) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            newClassroom: {
                ...prevProfile.newClassroom,
                standard: e.target.value,
            },
        }));
    };

    const handleSaveClassroom = async () => {
        if (profile.newClassroom.subject && profile.newClassroom.standard) {
            const newClassroom = {
                subject: profile.newClassroom.subject,
                standard: profile.newClassroom.standard,
            };

            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.post('http://localhost:5000/api/auth/classrooms', newClassroom, {
                    headers: {
                        'auth-token': accessToken,
                    },
                });

                const savedClassroom = response.data;
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    classrooms: [...prevProfile.classrooms, savedClassroom],
                    isAddingClassroom: false,
                    newClassroom: { subject: '', standard: '' },
                }));
            } catch (error) {
                console.error('Error saving classroom:', error);
                // Handle error case here
            }
        }
    };

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/classrooms');
                const classrooms = response.data;
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    classrooms,
                }));
            } catch (error) {
                console.error('Error fetching classrooms:', error);
                // Handle error case here
            }
        };

        fetchClassrooms();
    }, []);

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
                <h1 className="text-2xl font-bold">Mentor Page</h1>
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
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={handleAddClassroom}
                                >
                                    Add Classroom
                                </button>
                                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Link to="/login">Logout</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main content */}
            <main className="container mx-auto flex-grow py-8">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {profile.classrooms.map((classroom) => (
                            <div
                                key={classroom._id}
                                className="bg-white rounded shadow-md p-4 flex flex-col justify-between transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                <div>
                                    <h4 className="text-lg font-semibold mb-2">{classroom.subject}</h4>
                                    <p className="text-gray-600">Standard: {classroom.standard}</p>
                                </div>
                                <Link
                                    to={`/mentor/classroom/${classroom._id}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                >
                                    View Classroom
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Add Classroom Modal */}
            <Modal
                isOpen={profile.isAddingClassroom}
                onRequestClose={() =>
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        isAddingClassroom: false,
                        newClassroom: { subject: '', standard: '' },
                    }))
                }
                contentLabel="Add Classroom"
                className="modal fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
            >
                <div className="bg-white w-full max-w-sm p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Add Classroom</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-1">Subject</label>
                        <input
                            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-indigo-500"
                            type="text"
                            placeholder="Enter subject"
                            value={profile.newClassroom.subject}
                            onChange={handleSubjectChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-1">Standard</label>
                        <input
                            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-indigo-500"
                            type="text"
                            placeholder="Enter standard"
                            value={profile.newClassroom.standard}
                            onChange={handleStandardChange}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                            onClick={handleSaveClassroom}
                        >
                            Save
                        </button>
                        <button
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                            onClick={() =>
                                setProfile((prevProfile) => ({
                                    ...prevProfile,
                                    isAddingClassroom: false,
                                    newClassroom: { subject: '', standard: '' },
                                }))
                            }
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Mentor;
