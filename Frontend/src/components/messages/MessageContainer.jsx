import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = ({ onBack }) => {  // Accept the onBack prop
    const { selectedConversation, setSelectedConversation } = useConversation();
    
    return (
        <div
            className={`flex flex-col flex-1`}
            style={{ height: '100vh' }}
        >
            {!selectedConversation ? (
                 <NoChatSelected />
            ) : (
                <div className='flex flex-col h-full'>
                    {/* Back button for mobile */}
                    <div className='p-2'>
                        <button 
                            className='text-blue-500 hover:underline'
                            onClick={onBack}  // Trigger the onBack prop to show Sidebar
                        >
                            Back
                        </button>
                    </div>
                    
                    <div className='bg-slate-500 px-4 py-2 flex-shrink-0 rounded-none'>
                        <span className='label-text'>To:</span>{" "}
                        <span className='text-gray-900 font-bold'>{selectedConversation.fullName}</span>
                    </div>
                    
                    <div className='flex-1 overflow-auto'>
                        <Messages />
                    </div>
                
                    <div className='flex-shrink-0'>
                        <MessageInput />
                    </div>
                </div>
            )}
        </div>
    );
};

const NoChatSelected = () => {
    const { authUser } = useAuthContext();
    return (
        <div className='flex items-center justify-center w-full h-full' style={{ width: 'auto', height: '100vh' }}>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 👋 {authUser.fullName} ❄</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center' />
            </div>
        </div>
    );
};

export default MessageContainer;
