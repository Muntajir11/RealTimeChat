import { useState } from "react";
import { BsSend } from "react-icons/bs";
import { GrEmoji } from "react-icons/gr";
import useSendMessage from "../../hooks/useSendMessage";
import { useTypingEmitter } from "../../hooks/useTypingEmitter.js";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const { notifyTyping, emitStop } = useTypingEmitter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		emitStop();
		await sendMessage(message);
		setMessage("");
	};

	const handleEmojiClick = (emojiData) => {
		setMessage((prevMessage) => prevMessage + emojiData.emoji);
	};

	return (
		<div className='relative'>
			<form className='px-4 my-3' onSubmit={handleSubmit}>
				<div className='w-full relative flex items-center'>
					<button
						type='button'
						className='text-white me-2'
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					>
						<GrEmoji />
					</button>

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
						onChange={(e) => {
							setMessage(e.target.value);
							if (e.target.value.length > 0) notifyTyping();
						}}
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
