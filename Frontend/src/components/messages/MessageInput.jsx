import { useState } from "react";
import { BsSend } from "react-icons/bs";
import { GrEmoji } from "react-icons/gr"; // Emoji icon
import useSendMessage from "../../hooks/useSendMessage";
import EmojiPicker from "emoji-picker-react"; // Import EmojiPicker

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};

	// Updated handleEmojiClick function
	const handleEmojiClick = (emojiData) => {
		setMessage((prevMessage) => prevMessage + emojiData.emoji);
	};

	return (
		<div className='relative'>
			<form className='px-4 my-3' onSubmit={handleSubmit}>
				<div className='w-full relative flex items-center'>
					{/* Emoji Icon */}
					<button
						type='button'
						className='text-white me-2'
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					>
						<GrEmoji />
					</button>

					{/* Emoji Picker */}
					{showEmojiPicker && (
						<div className='absolute bottom-10 left-0'>
							<EmojiPicker onEmojiClick={handleEmojiClick} />
						</div>
					)}

					<input
						type='text'
						className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
						placeholder='Send a message'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>

					<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
						{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
					</button>
				</div>
			</form>
		</div>
	);
};

export default MessageInput;
