import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import MessageContainer from '../../components/messages/MessageContainer';
import Login from '../login/Login';
import SignUp from '../signup/SignUp';

const Home = () => {
  return (
    <div className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>

    <Sidebar />
    <MessageContainer />
    {/* <Login /> */}
    {/* <SignUp /> */}
    </div>
  );
};

export default Home;
