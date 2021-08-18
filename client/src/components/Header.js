import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';
import { useAuthContext } from '../context/auth';
import { useStateContext } from '../context/state';
import { getErrorMessage } from '../utils/helperFunctions';

const Header = ({ info ,setInfo, addUser, setAddUser }) => {
    const { user } = useAuthContext();
    const { selectedChat, notify } = useStateContext();
    const { username, name, participants, admin } = selectedChat.chatData;
    const { data: userData, loading: loadingUsers } = useQuery(GET_ALL_USERS, {
        onError: (err) => {
          notify(getErrorMessage(err), 'error');
        }
    });

    const openAddUser = () => {
        if(info){
            setInfo();
        }
        setAddUser();
    }
    const openInfo = () => {
        if(addUser){
            setAddUser();
        }
        setInfo();
    }
    
    return (
        <div className="flex flex-row space-x-3 items-center p-5 border-b-2 border-gray-200 justify-between">
            <div className="flex flex-row items-center space-x-4 select-none">
            {selectedChat.chatType === 'public' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 my-auto bg-white rounded-full" fill="none" viewBox="0 -3 24 30" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
            ) : selectedChat.chatType === 'group' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 my-auto rounded-full bg-white" fill="none" viewBox="0 -6 24 40" stroke="black">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ) : (
                <img className="rounded-full h-14 w-14 my-auto" src={`https://ui-avatars.com/api/?name=${username}&background=ffffff`} alt="avatar" />
            )}
            <p className={`text-2xl font-semibold text-white ${selectedChat.chatType === 'group' ? 'capitalize' : ''}`}>{selectedChat.chatType === 'private' ? username : name}</p>
            {selectedChat.chatType === 'group' && (
                <p className="font-semibold text-lg text-gray-200">({participants.length} {participants.length > 1 ? 'members' : 'member'})</p>
            )}
            </div>
            <div className="flex flex-row items-center pr-8 space-x-7">
                {admin === user.id && (
                    <button onClick={openAddUser}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </button>
                    
                )}
                {selectedChat.chatType === 'group' && (
                    <button onClick={openInfo}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}

export default Header;
