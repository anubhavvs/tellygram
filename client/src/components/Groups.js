import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useQuery } from '@apollo/client';
import { GET_GROUPS } from '../graphql/queries';
import { useStateContext } from '../context/state';
import { getErrorMessage, truncateString } from '../utils/helperFunctions';
import Loader from './Loader';
import Search from './Search';
import CreateModal from './CreateModal';

const Groups = () => {
    const { selectedChat, selectChat, notify } = useStateContext();
    const [searchText, setSearchText] = useState('');
    const [ showModal, setShowModal ] = useState(false);
    const { data: groupData, loading: loadingGroups } = useQuery(GET_GROUPS, {
        onError: (err) => {
            notify(getErrorMessage(err), 'error');
        }
    });

    if(loadingGroups) {
        return <Loader />
    }

    return (
        <div className="flex flex-col justify-center w-1/4 bg-gray-300 p-8">
            <div className="flex flex-row justify-between items-center mb-6">
                <p className="font-semibold text-3xl">Your Groups</p>
                <button className="flex text-md opacity-80" onClick={() => setShowModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New
                </button>
            </div>
            {showModal && ( <CreateModal setShowModal={setShowModal} showModal={showModal} />) }
            <Search placeholderText='Search Groups...' searchText={searchText} onChange={value => setSearchText(value)}/>
            {groupData && groupData.getGroups.length === 0 && (
                <p className="text-xl rounded-xl text-center bg-gray-400 px-3 py-5">You are not part of any group!</p>
            )}
            <Scrollbars autoHide hideTracksWhenNotNeeded>
            {groupData && groupData.getGroups.filter((group) =>group.name.toLowerCase().includes(searchText.toLocaleLowerCase())).map((group) => (
                <div key={group.id} className={`h-20 text-white font-semibold flex space-x-7 py-2 px-3 mb-3 rounded-xl cursor-pointer hover:bg-gray-500 ${selectedChat?.chatType === 'group' && group.id === selectedChat.chatData.id ? `bg-gray-500` : `bg-gray-700`}`} onClick={() => selectChat(group, 'group')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 my-auto rounded-full bg-white" fill="none" viewBox="0 -6 24 40" stroke="black">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="my-auto text-sm">{truncateString(group.name, 23)}</p>
                </div>
            ))}
            </Scrollbars>
            
        </div>
    )
}

export default Groups;
