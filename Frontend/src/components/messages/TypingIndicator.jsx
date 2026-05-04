const TypingIndicator = ({ visible }) => {
	if (!visible) return null;
	return (
		<div className='px-4 py-1 text-xs text-slate-300 italic' aria-live='polite'>
			typing…
		</div>
	);
};

export default TypingIndicator;
