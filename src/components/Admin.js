import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faHouse } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Admin = () => {
	const [mentors, setMentors] = useState([]);
	const [classrooms, setClassrooms] = useState([]);

	const removeMentor = (index) => {
		const updatedMentors = [...mentors];
		updatedMentors.splice(index, 1);
		setMentors(updatedMentors);
	};

	const addMentor = () => {
		const mentorName = prompt("Enter the name of the mentor");
		if (mentorName) {
			setMentors([...mentors, { name: mentorName, classroom: "" }]);
		}
	};

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
			try {
				const response = await axios.get(
					"http://localhost:5000/api/auth/classrooms"
				);
				setMentors(response.data.mentors);
				setClassrooms(response.data.classrooms); // Add this line to set the classrooms state
			} catch (error) {
				console.error("Error fetching classrooms:", error);
				// Handle error case here
			}
		};

		fetchClassrooms();
	}, []);

	const visitClassroom = (index) => {
		const updatedMentors = [...mentors];
		const classroomName = prompt("Enter the name of the classroom");
		if (classroomName) {
			updatedMentors[index].classroom = classroomName;
			setMentors(updatedMentors);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Navbar */}
			<nav className="bg-blue-500 text-white py-4 px-8 flex justify-between">
				<h1 className="text-2xl font-bold">Admin Page</h1>
				<div className="relative inline-block profile-icon">
					<Link to="/" className="mr-4">
						<FontAwesomeIcon icon={faHouse} size="lg" />
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
						<li className="text-gray-800">Email: {userEmail}</li>
						<li className="text-blue-500 hover:text-blue-600 cursor-pointer">
							Notifications
						</li>
						<li
							className="text-red-500 hover:text-red-600 cursor-pointer"
							onClick={handleLogout}>
							Logout
						</li>
					</ul>
				</div>
			)}

			{/* Main content */}
			<div className="container mx-auto py-8">
				<div className="max-w-3xl mx-auto px-4">
					<h2 className="text-2xl font-bold mb-4">Mentors:</h2>
					{mentors.map((mentor, index) => (
						<div
							key={index}
							className="flex items-center justify-between bg-gray-200 px-4 py-2 rounded mb-4">
							<div>
								<p className="text-gray-800">{mentor.name}</p>
								{mentor.classroom && (
									<div className="mt-2">
										<p className="font-semibold">
											Classroom:
										</p>
										<p>
											{mentor.classroom.subject},{" "}
											{mentor.classroom.standard}
										</p>
									</div>
								)}
							</div>
							<div>
								{mentor.classroom ? (
									<button
										className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
										onClick={() => visitClassroom(index)}>
										Visit Classroom
									</button>
								) : (
									<button
										className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
										onClick={() => visitClassroom(index)}>
										Add Classroom
									</button>
								)}
								<button
									className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
									onClick={() => removeMentor(index)}>
									Remove
								</button>
							</div>
						</div>
					))}

					<button
						className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4 w-full"
						onClick={addMentor}>
						Add Mentor
					</button>

					{/* Display all classrooms */}
					<h2 className="text-2xl font-bold mt-8 mb-4">
						All Classrooms:
					</h2>
					{classrooms.map((classroom, index) => (
						<div
							key={index}
							className="bg-gray-200 p-4 rounded mb-4">
							<p className="font-semibold">
								Mentor: {classroom.mentor.name}
							</p>
							<p className="font-semibold">
								Standard: {classroom.standard}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Admin;
