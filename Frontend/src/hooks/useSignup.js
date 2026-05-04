import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { signupRequest } from "../api/authApi.js";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async ({ fullName, username, email, password, confirmPassword, gender }) => {
		const success = handleInputErrors({ fullName, username, email, password, confirmPassword, gender });
		if (!success) return;

		setLoading(true);
		try {
			const { ok, data } = await signupRequest({
				fullName,
				username,
				email,
				password,
				confirmPassword,
				gender,
			});

			if (!ok || data.error) {
				throw new Error(data.error || "Request failed");
			}

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ fullName, username, email, password, confirmPassword, gender }) {
	if (!fullName || !username || !email || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}
