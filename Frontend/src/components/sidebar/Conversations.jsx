import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversations";

const Conversations = () => {
    const { loading, conversations } = useGetConversations();

    return (
        <div className='py-2 flex flex-col overflow-auto'>
            {loading ? (
                <span className='loading loading-spinner mx-auto'></span>
            ) : conversations.length > 0 ? (
                conversations.map((conversation, idx) => (
                    <Conversation
                        key={conversation._id}
                        contact={conversation}
                        emoji={getRandomEmoji()}
                        lastIdx={idx === conversations.length - 1}
                    />
                ))
            ) : (
                <p className='text-center text-gray-500'>No conversations found</p>
            )}
        </div>
    );
};

export default Conversations;
