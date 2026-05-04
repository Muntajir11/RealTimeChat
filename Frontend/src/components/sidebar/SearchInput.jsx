import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import { addContactRequest } from "../../api/usersApi.js";
import { fetchConversations } from "../../api/conversationsApi.js";

const SearchInput = ({ onContactAdded }) => {
	const [search, setSearch] = useState("");
	const { setSelectedConversation } = useConversation();
	const { conversations } = useGetConversations();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!search) return;
		if (search.length < 3) {
			return toast.error("Search term must be at least 3 characters long");
		}

		const existingConversation = conversations.find((c) =>
			c.fullName.toLowerCase().includes(search.toLowerCase()),
		);

		if (existingConversation) {
			setSelectedConversation(existingConversation);
			setSearch("");
			return;
		}

		const { ok, data } = await addContactRequest(search);

		if (ok) {
			toast.success(data.message || "Contact added successfully!");

			const convResult = await fetchConversations();
			if (convResult.ok && Array.isArray(convResult.data)) {
				const newConversation = convResult.data.find(
					(c) => c.username.toLowerCase() === search.toLowerCase(),
				);

				if (newConversation) {
					setSelectedConversation(newConversation);
				}

				setSearch("");
				if (onContactAdded) onContactAdded();
			} else {
				toast.error(convResult.data?.error || "Failed to fetch updated conversations");
			}
		} else {
			toast.error(data.error || "Failed to add contact");
		}
	};

	return (
		<form onSubmit={handleSubmit} className='flex items-center gap-2'>
			<input
				type='text'
				placeholder='Search by username…'
				className='input input-bordered rounded-full'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<button type='submit' className='btn btn-circle bg-sky-500 text-white'>
				<IoSearchSharp className='w-6 h-6 outline-none' />
			</button>
		</form>
	);
};

export default SearchInput;
