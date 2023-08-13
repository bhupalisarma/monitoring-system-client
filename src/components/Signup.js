import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";

const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [role, setRole] = useState("");
	const [error, setError] = useState("");
	const [registrationSuccess, setRegistrationSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const handleSignup = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:5000/api/auth/register",
				{
					email,
					password,
					role,
				}
			);

			// Set registration success message and navigate to login
			setRegistrationSuccess(true);
			navigate("/login");
		} catch (error) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				setError(error.response.data.message);
			} else {
				setError("An error occurred during signup");
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow-lg p-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign up
					</h2>
				</div>
				{error && (
					<div className="text-red-600 text-center">
						<p>{error}</p>
					</div>
				)}
				{registrationSuccess ? (
					<div className="text-green-600 text-center">
						<p>Registration Successful! Please proceed to login.</p>
						<Link
							to="/login"
							className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300">
							Login
						</Link>
					</div>
				) : (
					<form className="mt-8 space-y-6" onSubmit={handleSignup}>
						<input type="hidden" name="remember" value="true" />
						<div className="rounded-md shadow-sm -space-y-px">
							<div>
								<label htmlFor="email" className="sr-only">
									Email address
								</label>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-t-md bg-gray-100"
									placeholder="Email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor="password" className="sr-only">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="new-password"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-100"
									placeholder="Password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</div>
							<div>
								<label
									htmlFor="confirmPassword"
									className="sr-only">
									Confirm Password
								</label>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									autoComplete="new-password"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-100"
									placeholder="Confirm Password"
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
								/>
							</div>
							<div>
								<label htmlFor="role" className="sr-only">
									Role
								</label>
								<select
									id="role"
									name="role"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-100"
									value={role}
									onChange={(e) => setRole(e.target.value)}>
									<option value="">Select Role</option>
									<option value="admin">Admin</option>
									<option value="mentor">Mentor</option>
									<option value="mentee">Mentee</option>
								</select>
							</div>
						</div>
						<Button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							disabled={isLoading} // Disable the button when loading
						>
							{isLoading ? (
								<>
									<Spinner aria-label="Loading" />
									<span className="pl-3">Loading...</span>
								</>
							) : (
								"Sign up"
							)}
						</Button>

						<div className="text-gray-600 text-center">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300">
								Login
							</Link>
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default Signup;
