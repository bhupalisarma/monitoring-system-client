import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faHouse } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Admin = () => {
	const [mentors, setMentors] = useState([]);
	const [classrooms, setClassrooms] = useState([]);
	const [inviteLink, setInviteLink] = useState('');
	const [showCopyButton, setShowCopyButton] = useState(true);


	const generateInviteLink = () => {
		// TODO: Implement the logic to generate the invite link
		const roleParam = "role=mentor";
		const fullLink = `${window.location.origin}/signup?${roleParam}`;
		setInviteLink(fullLink); // Store the link in the component state	
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(inviteLink)
			.then(() => {
				alert('Link copied to clipboard!');
				setShowCopyButton(false); // Hide the button after copying the link
			})
			.catch((error) => {
				console.error('Error copying link to clipboard:', error);
			});
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
			const accessToken = localStorage.getItem("accessToken")
			try {
				const response = await axios.get(
					"http://localhost:5000/api/auth/classrooms",
					{
						headers : {
						"auth-token" : accessToken
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
						<li className="text-blue-500 hover:text-blue-600 cursor-pointer">
							<button onClick={() => {
								generateInviteLink();
							}}>
								Add Mentor
							</button>
							<br></br>
							{/* Copy Button */}
							{showCopyButton && inviteLink && (
								<button
									onClick={copyToClipboard}
									className="text-warning transition duration-150 ease-in-out hover:text-warning-600 focus:text-warning-600 active:text-warning-700"
								>
									Copy Invite Link
								</button>
							)}

							{/* Display the invite link */}
							{/* {inviteLink && (
								<p>
									Share this link: <a href={inviteLink} target="_blank" rel="noopener noreferrer">{inviteLink}</a>
								</p>
							)} */}
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
					{/* <button
						className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4 w-full"
						onClick={addMentor}>
						Add Mentor
					</button> */}
						{/* <button onClick={generateInviteLink} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
							Add Mentor
						</button> */}
						{/* Display the invite link */}
						{/* {inviteLink && (
							<p>
								Share this link: <a href={inviteLink} target="_blank" rel="noopener noreferrer">{inviteLink}</a>
							</p>
						)} */}

					{/* Display all classrooms */}
					<h2 className="text-2xl font-bold mt-8 mb-4">
						All Classrooms:
					</h2>
					{classrooms.map((classroom, index) => (
						<Link to={`/admin/classroom/${classroom._id}`} key={index}>
							<div className="bg-gray-200 p-4 rounded mb-4 border border-green-500">
								{/* <p className="font-semibold">Mentor: {classroom.mentor.name}</p> */}
								<p className="font-semibold">Standard: {classroom.standard}</p>
								<p className="font-semibold">Subject: {classroom.subject}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Admin;
