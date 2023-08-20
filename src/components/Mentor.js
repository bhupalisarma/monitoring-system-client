import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faUserCircle,
	faBars,
	faBell,
	faSignOutAlt,
	faCalendar,
	faUserPlus,
	faUser,
	faUsersViewfinder,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import axios from "axios";

const Mentor = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [profile, setProfile] = useState({
		name: "Mentor Name",
		email: sessionStorage.getItem("userEmail") || "mentor@example.com",
		classrooms: [],
		isProfileOpen: false,
		isAddingClassroom: false,
		newClassroom: { subject: "", standard: "" },
	});

	const fetchClassrooms = async () => {
		try {
			const accessToken = localStorage.getItem("accessToken");
			if (accessToken) {
				const response = await axios.get(
					"http://localhost:5000/api/classrooms",
					{
						headers: {
							"auth-token": accessToken,
						},
					}
				);
				const classrooms = response.data;
				setProfile((prevProfile) => ({
					...prevProfile,
					classrooms,
				}));
			}
		} catch (error) {
			console.error("Error fetching classrooms:", error);
			// Handle error case here
		}
	};

	const handleLogin = async () => {
		// Implement your login logic here, e.g., send login request and handle the response
		try {
			// Make a login request to the backend and get the access token
			const response = await axios.post(
				"http://localhost:5000/api/auth/login",
				{
					// Provide login credentials here, e.g., username and password
					// For example: username: 'mentor2', password: 'password123'
				}
			);

			// Store the access token in localStorage
			localStorage.setItem("accessToken", response.data.accessToken);

			// Set isLoggedIn to true
			setIsLoggedIn(true);

			// Fetch classrooms for the logged-in mentor
			fetchClassrooms();
		} catch (error) {
			console.error("Error logging in:", error);
			// Handle login error here
		}
	};

	const handleLogout = () => {
		// Implement your logout logic here, e.g., remove the token from localStorage
		localStorage.removeItem("accessToken");

		// Set isLoggedIn to false
		setIsLoggedIn(false);

		// After a successful logout, set the isLoggedIn state to false
		setIsLoggedIn(false);
		setProfile({
			name: "Mentor Name",
			email: "mentor@example.com",
			classrooms: [],
			isProfileOpen: false,
			isAddingClassroom: false,
			newClassroom: { subject: "", standard: "" },
		});
	};

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
				const accessToken = localStorage.getItem("accessToken");
				const response = await axios.post(
					"http://localhost:5000/api/classrooms",
					newClassroom,
					{
						headers: {
							"auth-token": accessToken,
						},
					}
				);

				const savedClassroom = response.data;
				setProfile((prevProfile) => ({
					...prevProfile,
					classrooms: [...prevProfile.classrooms, savedClassroom],
					isAddingClassroom: false,
					newClassroom: { subject: "", standard: "" },
				}));
			} catch (error) {
				console.error("Error saving classroom:", error);
				// Handle error case here
			}
		}
	};

	useEffect(() => {
		const userToken = localStorage.getItem("accessToken");
		if (userToken) {
			setIsLoggedIn(true);
			fetchClassrooms();
		}
	}, []);

	useEffect(() => {
		const handleOutsideClick = (e) => {
			if (e.target.closest(".profile-icon")) {
				return;
			}
			handleCloseProfile();
		};

		document.addEventListener("click", handleOutsideClick);

		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	return (
		<div className="flex min-h-screen bg-stone-200">
			{/* Sidebar */}
			<aside
				className={`${
					sidebarOpen ? "w-38" : "w-16"
				} bg-[#131313] text-white transition-all duration-300 ease-in-out overflow-hidden`}>
				<div className="py-4 px-4">
					<button
						className="text-white"
						onClick={() => setSidebarOpen(!sidebarOpen)}>
						<FontAwesomeIcon icon={faBars} />
					</button>
				</div>
				{/* Conditional rendering for sidebar content */}
				{sidebarOpen ? (
					<div className="mt-4">
						{/* Sidebar links with text */}
						<Link to="/" className="block py-2 px-4 text-white">
							<FontAwesomeIcon icon={faHouse} /> Home
						</Link>
						<Link to="/" className="block py-2 px-4 text-white">
							<FontAwesomeIcon icon={faBell} /> Notifications
						</Link>
						<Link
							to="/meetings"
							className="block py-2 px-4 text-white">
							<FontAwesomeIcon icon={faCalendar} /> Meetings
						</Link>
						<Link
							to="/login"
							onClick={handleLogout}
							className="block py-2 px-4 text-white">
							<FontAwesomeIcon icon={faSignOutAlt} /> Logout
						</Link>
					</div>
				) : (
					<div className="mt-4">
						{/* Sidebar links with icons only */}
						<Link to="/" className="block py-2 px-4 text-white">
							<FontAwesomeIcon icon={faHouse} />
						</Link>
						<Link to="/" className="block py-2 px-4 text-white">
							<FontAwesomeIcon icon={faBell} />
						</Link>
						<Link
							to="/meetings"
							className="block py-2 px-4 text-white">
							<FontAwesomeIcon icon={faCalendar} />
						</Link>
						<Link
							to="/login"
							className="block py-2 px-4 text-white"
							onClick={handleLogout}>
							<FontAwesomeIcon icon={faSignOutAlt} />
						</Link>
					</div>
				)}
			</aside>
			<div className="flex-1 flex flex-col">
				{/* Navbar */}
				<nav className="bg-[#131313] text-white py-4 px-8 flex justify-between">
					<h1 className="text-2xl font-bold">Mentor Page</h1>
					<div className="relative inline-block profile-icon">
						<Link to="/" className="mr-4">
							<FontAwesomeIcon icon={faBell} size="lg" />
						</Link>
						<button
							className="text-white"
							onClick={handleOpenProfile}>
							<FontAwesomeIcon icon={faUserCircle} size="lg" />
						</button>
						{profile.isProfileOpen && (
							<div
								className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-10"
								onClick={(e) => e.stopPropagation()}>
								<ul className="list-none">
									<li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
										<FontAwesomeIcon
											icon={faUser}
											className="text-gray-500"
										/>{" "}
										{profile.email}
									</li>
									{isLoggedIn ? (
										<>
											<button
												className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
												onClick={handleAddClassroom}>
												<FontAwesomeIcon
													icon={faUserPlus}
													className="text-gray-500"
												/>{" "}
												Add Classroom
											</button>
										</>
									) : (
										<li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
											<Link
												to="/login"
												onClick={handleLogin}>
												Login
											</Link>
										</li>
									)}
								</ul>
							</div>
						)}
					</div>
				</nav>

				{/* Main content */}
				<main className="container mx-auto flex-grow py-8">
					<div className="max-w-3xl mx-auto px-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
							{profile.classrooms.map((classroom, index) => (
								<Link to={`/mentor/classroom/${classroom._id}`}>
									<div
										key={classroom._id}
										className="border border-gray-500 border-1 rounded shadow-md flex flex-col justify-between transition duration-300 ease-in-out transform hover:scale-105">
										{/* Classroom Header */}
										<p className="bg-black text-white text-lg mb-1 w-full py-2 px-4 flex justify-between items-center">
											Classroom {index + 1} - {classroom.subject}

											{/* <FontAwesomeIcon
											icon={faUsersViewfinder}
										/>										 */}
										</p>

										<div>
											<p className="text-base font-semibold justify-between px-4">
												Subject : {classroom.subject}
											</p>
											<p className="text-base font-semibold px-4">
												Standard : {classroom.standard}
											</p>
											{/* <p className="text-gray-600">
											Standard: {classroom.mentor.email}
										</p> */}
										</div>
										{/* <div className="flex space-x-2 mt-2 justify-center px-4">
											<button class="bg-transparent hover:bg-blue-500 text-orange-600  hover:text-white py-1 px-2 border border-orange-300 hover:border-transparent rounded text-sm">
												Update
											</button>
											<button class="bg-transparent hover:bg-blue-500 text-red-600 hover:text-white py-1 px-2 border border-red-600 hover:border-transparent rounded text-sm">
												Delete
											</button>
										</div> */}
										

										<div className="px-4 py-3">
											{/* <Link
											to={`/mentor/classroom/${classroom._id}`}
											className="border border-slate-900 border-2 bg-transparent text-black hover:bg-black hover:text-white hover:border-slate-900 py-1  flex text-base items-center rounded justify-center">
											Enter Classroom
										</Link> */}
										</div>

									</div>
								</Link>
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
							newClassroom: { subject: "", standard: "" },
						}))
					}
					contentLabel="Add Classroom"
					className="modal fixed inset-0 flex items-center justify-center z-50"
					overlayClassName="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
					<div className="bg-white w-full max-w-sm p-4 rounded-lg shadow-md">
						<h2 className="text-xl font-semibold mb-4">
							Add Classroom
						</h2>
						<div className="mb-4">
							<label className="block text-gray-700 text-sm font-bold mb-1">
								Subject
							</label>
							<input
								className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-indigo-500"
								type="text"
								placeholder="Enter subject"
								value={profile.newClassroom.subject}
								onChange={handleSubjectChange}
							/>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 text-sm font-bold mb-1">
								Standard
							</label>
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
								onClick={handleSaveClassroom}>
								Save
							</button>
							<button
								className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
								onClick={() =>
									setProfile((prevProfile) => ({
										...prevProfile,
										isAddingClassroom: false,
										newClassroom: {
											subject: "",
											standard: "",
										},
									}))
								}>
								Cancel
							</button>
						</div>
					</div>
				</Modal>
			</div>
		</div>
	);
};

export default Mentor;
