import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUserCircle, faBars, faBell, faSignOutAlt, faCalendar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Random = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [profile, setProfile] = useState({
		name: "Mentee Name",
		email: sessionStorage.getItem("userEmail") || "mentee@example.com",
		classrooms: [
			{ id: 1, subject: "Math", standard: "9th" },
			{ id: 2, subject: "Science", standard: "10th" },
			{ id: 3, subject: "English", standard: "8th" },
		],
		isProfileOpen: false,
	});
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [mentors, setMentors] = useState([]);
	const [classrooms, setClassrooms] = useState([]);
	const [inviteLink, setInviteLink] = useState('');
	const [showCopyButton, setShowCopyButton] = useState(true);


	// Profile section
	const [userEmail, setUserEmail] = useState("");
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const navigate = useNavigate();

	const handleProfileToggle = () => {
		setIsProfileOpen(!isProfileOpen);
	};

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		// Perform logout action, such as making a request to your backend API or clearing session/cookie
		navigate("/login");
	};

	useEffect(() => {
		// Retrieve the user's email from session storage
		const loggedInUserEmail = sessionStorage.getItem("userEmail");
		setUserEmail(loggedInUserEmail);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				isProfileOpen &&
				event.target.closest(".profile-section") === null
			) {
				setIsProfileOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isProfileOpen]);

	useEffect(() => {
		const fetchClassrooms = async () => {
			const accessToken = localStorage.getItem("accessToken")
			try {
				const response = await axios.get(
					"http://localhost:5000/api/classrooms",
					{
						headers: {
							"auth-token": accessToken
						}
					}
				);
				console.log(response.data.classrooms)
				setClassrooms(response.data); // Add this line to set the classrooms state
			} catch (error) {
				console.error("Error fetching classrooms:", error);
				// Handle error case here
			}
		};

		fetchClassrooms();
	}, []);

	return (
		<div className="flex min-h-screen bg-stone-200">
			{/* Sidebar */}
			<aside
				className={`${sidebarOpen ? 'w-38' : 'w-16'
					} bg-[#131313] text-white transition-all duration-300 ease-in-out overflow-hidden`}
			>
				<div className="py-4 px-4">
					<button
						className="text-white"
						onClick={() => setSidebarOpen(!sidebarOpen)}
					>
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
						<Link to="/meetings" className="block py-2 px-4 text-white">
							<FontAwesomeIcon icon={faCalendar} /> Meetings
						</Link>
						<Link to="/login" onClick={handleLogout} className="block py-2 px-4 text-white">
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
						<Link to="/meetings" className="block py-2 px-4 text-white">
							<FontAwesomeIcon icon={faCalendar} />
						</Link>
						<Link to="/login" className="block py-2 px-4 text-white" onClick={handleLogout}>
							<FontAwesomeIcon icon={faSignOutAlt} />
						</Link>
					</div>
				)}
			</aside>
			<div className="flex-1 flex flex-col">
				{/* Navbar */}
				<nav className="bg-[#131313] text-white py-4 px-8 flex justify-between">
					<h1 className="text-2xl font-bold">Mentee Page</h1>
					<div className="relative inline-block profile-icon">
						<Link to="/" className="mr-4">
							<FontAwesomeIcon icon={faBell} size="lg" />
						</Link>
						<button
							className="text-white"
							onClick={handleProfileToggle}>
							<FontAwesomeIcon icon={faUserCircle} size="lg" />
						</button>
					</div>
				</nav>

				{/* Profile section */}
				{isProfileOpen && (
					<div className="bg-white rounded shadow p-4 absolute top-12 right-4 z-10 profile-section">
						<ul className="list-none">
							<li className="text-gray-800">{userEmail}</li>
							{/* <li className="text-blue-500 hover:text-blue-600 cursor-pointer">
								Notifications
							</li>							 */}
						</ul>
					</div>
				)}

				{/* Main content */}
				<main className="container mx-auto flex-grow py-8">
					<div className="max-w-3xl mx-auto px-4">
						<div className="bg-white rounded shadow p-4">
							<h3 className="text-xl font-semibold mb-2">
								Classrooms
							</h3>
							{profile.classrooms.map((classroom) => (
								<div
									key={classroom.id}
									className="mb-4 p-4 border border-gray-300 rounded">
									<h4 className="text-lg font-semibold">
										{classroom.subject} - {classroom.standard}
									</h4>
									<Link
										to={`/mentee/classroom/${classroom.id}`}
										className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2 inline-block"
										style={{ marginLeft: "auto" }}>
										View Classroom
									</Link>
								</div>
							))}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Random;
