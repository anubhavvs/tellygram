import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS, GET_GROUPS, GET_GLOBAL_GROUP } from '../graphql/queries';
import { useStateContext } from '../context/state';
import { getErrorMessage } from '../utils/helperFunctions';
import Loader from './Loader';
import RecentChat from './RecentChat';

const Chats = () => {
    const { selectedChat, selectChat, notify } = useStateContext();
    const { data: userData, loading: loadingUsers } = useQuery(GET_ALL_USERS, {
        onError: (err) => {
            notify(getErrorMessage(err), 'error');
        }
    });
    const { data: groupData, loading: loadingGroups } = useQuery(GET_GROUPS, {
        onError: (err) => {
            notify(getErrorMessage(err), 'error');
        }
    });
    const { data: globalData, loading: loadingGlobal } = useQuery(GET_GLOBAL_GROUP, {
        onError: (err) => {
            notify(getErrorMessage(err), 'error');
        },
    });

    if(loadingUsers || loadingGroups || loadingGlobal) {
        return <Loader />
    }

    return (
        <div className="flex flex-col justify-center w-1/4 bg-gray-300 px-8 pt-8 pb-3">
            <div className="flex flex-row justify-between items-center mb-6">
                <p className="font-semibold text-3xl">Chats</p>
            </div>
            <Scrollbars hideTracksWhenNotNeeded autoHide>
            {globalData && (
                <div className={`h-20 text-white font-semibold flex space-x-5 py-2 px-3 mb-3 rounded-xl cursor-pointer hover:bg-gray-500 ${selectedChat?.chatType === 'public' && globalData.getGlobalGroup.id === selectedChat.chatData.id ? `bg-gray-500` : `bg-gray-700`}`} onClick={() => selectChat(globalData.getGlobalGroup, 'group')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 my-auto bg-white rounded-full" fill="none" viewBox="0 -3 24 30" stroke="black">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <RecentChat body={globalData.getGlobalGroup} />
                </div>
            )}
            {groupData && groupData.getGroups.filter((group) =>group.latestMessage).sort((a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt)).map((group) => (
                <div key={group.id} className={`h-20 text-white font-semibold flex space-x-5 py-2 px-3 mb-3 rounded-xl cursor-pointer hover:bg-gray-500 ${selectedChat?.chatType === 'group' && group.id === selectedChat.chatData.id ? `bg-gray-500` : `bg-gray-700`}`} onClick={() => selectChat(group, 'group')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 my-auto flex-initial rounded-full bg-white" fill="none" viewBox="0 -6 24 40" stroke="black">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <RecentChat body={group} />
                </div>
            ))}
            {userData && userData.getAllUsers.filter((user) =>user.latestMessage).sort((a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt)).map((user) => (
                <div key={user.id} className={`h-20 text-white font-semibold flex space-x-5 py-2 px-3 mb-3 rounded-xl cursor-pointer hover:bg-gray-500 ${selectedChat?.chatType === 'private' && user.id === selectedChat.chatData.id ? `bg-gray-500` : `bg-gray-700`}`} onClick={() => selectChat(user, 'private')}>
                    <img className="rounded-full h-14 w-14 my-auto" src={`https://ui-avatars.com/api/?name=${user.username}&background=ffffff`} alt="avatar" />
                    <RecentChat body={user} type="user" />
                </div>
            ))}
            </Scrollbars>
        </div>
    )
}

export default Chats;
