// import { useState } from "react";
// import { IoSearchSharp } from "react-icons/io5";
// import toast from "react-hot-toast";

// const SearchInput = ({ onContactAdded }) => {
//     const [search, setSearch] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!search) return;
//         if (search.length < 3) {
//             return toast.error("Search term must be at least 3 characters long");
//         }

//         try {
//             const response = await fetch("/api/users/add-contact", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ username: search }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 toast.success(data.message || "Contact added successfully!");
//                 setSearch("");
//                 if (onContactAdded) onContactAdded(); // Notify parent component
//             } else {
//                 toast.error(data.error || "Failed to add contact");
//             }
//         } catch (error) {
//             toast.error("An error occurred. Please try again.");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className='flex items-center gap-2'>
//             <input
//                 type='text'
//                 placeholder='Search by username…'
//                 className='input input-bordered rounded-full'
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//             />
//             <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
//                 <IoSearchSharp className='w-6 h-6 outline-none' />
//             </button>
//         </form>
//     );
// };

// export default SearchInput;



import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import toast from "react-hot-toast";

const SearchInput = ({ onContactAdded }) => {
    const [search, setSearch] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!search) return;
        if (search.length < 3) {
            return toast.error("Search term must be at least 3 characters long");
        }

        try {
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
                setSearch("");
                if (onContactAdded) onContactAdded(); // Notify parent component
            } else {
                toast.error(data.error || "Failed to add contact");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
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

