import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchSidebarUsers } from "../api/usersApi.js";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const { ok, data } = await fetchSidebarUsers();
				if (!ok || data.error) {
					throw new Error(data.error || "Request failed");
				}
				setConversations(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};

export default useGetConversations;
