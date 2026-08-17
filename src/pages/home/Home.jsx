import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import MessageContainer from '../../components/messages/MessageContainer';

const Home = () => {
  const [showMessages, setShowMessages] = useState(false); 

  return (
    <div className='relative h-screen'>
      <div 
        className={`flex ${showMessages ? 'flex-col' : 'flex-col md:flex-row'} rounded-lg overflow-auto bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0`}
        style={{  width: '100vw', height: '100vh' }}
      >
        {!showMessages && (
          <Sidebar className='w-full md:w-1/3 lg:w-1/4' onConversationClick={() => setShowMessages(true)} />
        )}
        
        
        {showMessages && (
          <div className='flex-1'>
            <MessageContainer onBack={() => setShowMessages(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
