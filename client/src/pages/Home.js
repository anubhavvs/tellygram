import React, { useState } from 'react';
import Chats from '../components/Chats';
import Groups from '../components/Groups';
import Sidebar from '../components/Sidebar';
import Users from '../components/Users';
import Conversation from '../components/Conversation';

const Home = () => {
    const [tab, setTab] = useState('chat');
    
    return (
        <div className="flex flex-row min-h-screen bg-gray-50">
            <Sidebar changeTab={(value) => setTab(value)} selectedTab={tab} />
            { tab === 'chat' ? (
                <Chats />
            ) : tab === 'users' ? (
                <Users />
            ) : (
                <Groups />
            )}
            <Conversation />
        </div>
    )
}

export default Home;
