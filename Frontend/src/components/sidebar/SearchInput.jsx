import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";

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

        // Check if the user is already a contact
        const existingConversation = conversations.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

        if (existingConversation) {
            setSelectedConversation(existingConversation); // Set the selected conversation
            setSearch(""); // Clear the search input
            return; // Exit early if user is already a contact
        }

        // User is not already a contact, proceed with adding the contact
        
            const response = await fetch("/api/users/add-contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: search }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Contact added successfully!");

                // Fetch updated list of conversations
                const convResponse = await fetch("/api/users/conversations"); // Adjust endpoint if needed
                const conversationsData = await convResponse.json();

                if (convResponse.ok) {
                    // Find the newly added contact
                    const newConversation = conversationsData.find((c) => c.fullName.toLowerCase() === search.toLowerCase());

                    if (newConversation) {
                        setSelectedConversation(newConversation); // Set the selected conversation
                    }

                    setSearch(""); // Clear the search input
                    if (onContactAdded) onContactAdded(); // Notify parent component
                } else {
                    toast.error(data.error || "Failed to fetch updated conversations");
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
