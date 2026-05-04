import React from "react";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";

const Sidebar = ({ onConversationClick }) => {
	return (
		<div className='border-r border-slate-500 p-4 flex flex-col'>
			<Link to='/settings' className='btn btn-ghost btn-sm mb-2 text-sky-300'>
				Settings
			</Link>
			<SearchInput />
			<div className='divider px-3'></div>
			<Conversations onConversationClick={onConversationClick} />
			<LogoutButton />
		</div>
	);
};

export default Sidebar;
