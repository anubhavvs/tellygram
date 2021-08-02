import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';
import { useStateContext } from '../context/state';
import { getErrorMessage } from '../utils/helperFunctions';
import Loader from './Loader';
import Search from './Search';

const Users = () => {
    const { selectedChat, selectChat, notify } = useStateContext();
    const [searchText, setSearchText] = useState('');
    const { data: userData, loading: loadingUsers } = useQuery(GET_ALL_USERS, {
        onError: (err) => {
            notify(getErrorMessage(err), 'error');
        }
    });

    if(loadingUsers) {
        return <Loader />
    }

    return (
        <div className="flex-col items-center justify-center flex-none w-1/4 bg-gray-300 p-8">
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="font-semibold text-2xl">All Users</p>
            </div>
            <Search placeholderText='Search Users...' searchText={searchText} onChange={value => setSearchText(value)}/>
            {userData && userData.getAllUsers.length === 0 && (
                <p className="text-xl rounded-xl bg-gray-400 px-2 py-5">No other users available!☹️</p>
            )}
            {userData && userData.getAllUsers.filter((user) =>user.username.toLowerCase().includes(searchText.toLocaleLowerCase())).map((user) => (
                <div key={user.id} className={`h-20 text-white font-semibold flex space-x-7 py-2 px-3 mb-3 rounded-xl cursor-pointer hover:bg-gray-500 ${selectedChat?.chatType === 'private' && user.id === selectedChat.chatData.id ? `bg-gray-500` : `bg-gray-700`}`} onClick={() => selectChat(user, 'private')}>
                    <img className="rounded-full h-14 w-14 my-auto" src={`https://ui-avatars.com/api/?name=${user.username}&background=ffffff`} alt="avatar" />
                    <p className="my-auto text-sm">{user.username}</p>
                </div>
            ))}
        </div>
    )
}

export default Users;
