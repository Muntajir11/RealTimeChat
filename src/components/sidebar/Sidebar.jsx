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
			<div className='flex flex-col gap-1 mb-2'>
				<Link to='/safety/blocks' className='btn btn-ghost btn-xs text-slate-200'>
					Blocks
				</Link>
				<Link to='/safety/reports' className='btn btn-ghost btn-xs text-slate-200'>
					Reports
				</Link>
				<Link to='/search/thread' className='btn btn-ghost btn-xs text-slate-200'>
					Search
				</Link>
			</div>
			<SearchInput />
			<div className='divider px-3'></div>
			<Conversations onConversationClick={onConversationClick} />
			<LogoutButton />
		</div>
	);
};

export default Sidebar;
