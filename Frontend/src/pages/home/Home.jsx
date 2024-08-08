import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import MessageContainer from '../../components/messages/MessageContainer';

const Home = () => {
  return (
    <div className='relative'>
      <div 
        className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'
        style={{ width: '100vw', height: '100vh' }}
      >
        <Sidebar />
        <MessageContainer />
      </div>
    </div>
  );
};

export default Home;
