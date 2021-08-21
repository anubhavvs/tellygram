import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Select from 'react-select';
import Scrollbars from 'react-custom-scrollbars';
import { GET_ALL_USERS, GET_GROUPS } from '../graphql/queries';
import { REMOVE_GROUP_USER, DELETE_GROUP, LEAVE_GROUP, ADD_GROUP_USER } from '../graphql/mutations';
import { useStateContext } from '../context/state';
import { useAuthContext } from '../context/auth';
import { getErrorMessage, formatDateInWords } from '../utils/helperFunctions';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';

const Panel = ({ addUserPanel, setAddUserPanel, infoPanel, setInfoPanel }) => {
    const { selectedChat, updateMembers, unselectChat, notify } = useStateContext();
    const [ errorMessage, setErrorMessage ] = useState(null);
    const [ usersToAdd, setUsersToAdd ] = useState([]);
    const [addUser, { loading: addingUser }] = useMutation(ADD_GROUP_USER, {
      onError: (err) => {
        setErrorMessage(getErrorMessage(err));
      },
    });
    const { user } = useAuthContext();

    const { data: userData, loading: loadingUsers } = useQuery(GET_ALL_USERS, {
        onError: (err) => {
          notify(getErrorMessage(err), 'error');
        }
    });

    const [removeGroup] = useMutation(DELETE_GROUP, {
        onError: (err) => {
          notify(getErrorMessage(err), 'error');
        },
    });
    const [removeUser] = useMutation(REMOVE_GROUP_USER, {
        onError: (err) => {
          notify(getErrorMessage(err), 'error');
        },
    });
    const [leaveGroup] = useMutation(LEAVE_GROUP, {
        onError: (err) => {
          notify(getErrorMessage(err), 'error');
        },
    });

    const handleGroupDelete = () => {
        removeGroup({
          variables: { conversationId: selectedChat.chatData.id },
          update: (proxy, { data }) => {
            const returnedData = data.deleteGroup;
            const dataInCache = proxy.readQuery({
              query: GET_GROUPS,
            });
    
            const updatedGroups = dataInCache.getGroups.filter(
              (g) => g.id !== returnedData
            );
    
            proxy.writeQuery({
              query: GET_GROUPS,
              data: { getGroups: updatedGroups },
            });

            unselectChat();
            notify('Group deleted successfully!');
          },
        });
    };
    
    const handleRemoveUser = (userToRemoveId) => {
        removeUser({
          variables: {
            conversationId: selectedChat.chatData.id,
            userId: userToRemoveId,
          },
          update: (proxy, { data }) => {
            const returnedData = data.removeGroupUser;
            const dataInCache = proxy.readQuery({
              query: GET_GROUPS,
            });
    
            const updatedGroups = dataInCache.getGroups.map((g) =>
              g.id === returnedData.groupId
                ? { ...g, participants: returnedData.participants }
                : g
            );
    
            proxy.writeQuery({
              query: GET_GROUPS,
              data: { getGroups: updatedGroups },
            });
    
            if (selectedChat.chatData.id === returnedData.groupId) {
              updateMembers(returnedData);
            }
            notify('Group member removed!');
          },
        });
    };
    
    const handleGroupLeave = () => {
        leaveGroup({
          variables: {
            conversationId: selectedChat.chatData.id,
          },
          update: (proxy, { data }) => {
            const returnedData = data.leaveGroup;
            const dataInCache = proxy.readQuery({
              query: GET_GROUPS,
            });
    
            const updatedGroups = dataInCache.getGroups.filter(
              (g) => g.id !== returnedData
            );
    
            proxy.writeQuery({
              query: GET_GROUPS,
              data: { getGroups: updatedGroups },
            });

            unselectChat();
            notify('Left the group!');
          },
        });
    };

    const handleAddUser = (e) => {
      e.preventDefault();
      addUser({
        variables: {
          conversationId: selectedChat.chatData.id,
          participants: usersToAdd,
        },
        update: (proxy, { data }) => {
          const returnedData = data.addGroupUser;
          const dataInCache = proxy.readQuery({
            query: GET_GROUPS,
          });
  
          const updatedGroups = dataInCache.getGroups.map((g) =>
            g.id === returnedData.groupId
              ? { ...g, participants: returnedData.participants }
              : g
          );
  
          proxy.writeQuery({
            query: GET_GROUPS,
            data: { getGroups: updatedGroups },
          });
  
          if (selectedChat.chatData.id === returnedData.groupId) {
            updateMembers(returnedData);
          }
          notify(`${usersToAdd.length} new ${usersToAdd.length > 1 ? `members` : `member`} added to the group!`);
          setAddUserPanel(false);
          setInfoPanel(true)
        },
      });
    };

    const closePanel = (e) => {
      if(e.keyCode === 27) {
          if(infoPanel){
            setInfoPanel(false);
          }
          if(addUserPanel){
            setAddUserPanel(false);
          }
      }
    }

    useEffect(() => {
      window.addEventListener('keydown', closePanel);
      return () => window.removeEventListener('keydown', closePanel)
    })

    const { name, participants, adminUser, createdAt } = selectedChat.chatData;
    const isGroupAdmin = user.id === selectedChat.chatData.admin;

    return (
        <>
        {
            (addUserPanel && selectedChat.chatType==='group') && (
                <div className="flex flex-col w-1/4 bg-gray-300 items-center pb-3">
                  <div className="flex flex-row w-full text-lg border-b-2 py-8 pl-5 border-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 cursor-pointer" onClick={() => setAddUserPanel(!infoPanel)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="ml-4 mb-1">Add Members</p>
                  </div>
                  <p className="text-xl mt-10 font-semibold">Select Users to Add</p>
                  <form className="flex flex-col w-full p-7 space-y-5" onSubmit={handleAddUser}>
                    <Select
                      isSearchable
                      options={userData ? userData.getAllUsers.filter(
                        (u) => !selectedChat.chatData.participants.includes(u.id)
                      ) : []}
                      getOptionLabel={(option) => option.username}
                      getOptionValue={(option) => option.id}
                      onChange={(option) => setUsersToAdd(option.map((o) => o.id))}
                      isMulti
                      required
                      placeholder="Select Users..."
                    />
                    <button className="flex flex-row justify-center items-center text-white bg-blue-900 text-md px-4 py-2 shadow-2xl rounded-lg" type="sumbit" disabled={addingUser}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                            Add Users
                    </button>
                  </form>
                  <ErrorAlert errorMessage={errorMessage} clearErrorMessage={() => setErrorMessage(null)} />
                </div>
            )
        }
        {
            (infoPanel && selectedChat.chatType==='group') && (
                <div className="flex flex-col w-1/4 bg-gray-300 items-center pb-3">
                  <div className="flex flex-row w-full text-lg border-b-2 py-8 pl-5 border-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 cursor-pointer" onClick={() => setInfoPanel(!infoPanel)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="ml-4 mb-1">Group Info</p>
                  </div>
                  <p className="text-3xl font-bold mx-5 mt-7 mb-7">{name}</p>
                    {isGroupAdmin ? (
                        <div className="flex flex-row text-sm">
                            <button onClick={handleGroupDelete} className="flex flex-row px-4 py-3 bg-blue-900 shadow-2xl text-white rounded-lg items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Group
                            </button>
                        </div>
                    ) : (
                      <div className="flex flex-row text-sm">
                            <button onClick={handleGroupLeave} className="flex flex-row px-4 py-3 bg-blue-900 shadow-2xl text-white rounded-lg items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Leave Group
                            </button>
                        </div>
                    )
                  
                  }
                    <div className="flex flex-col w-full items-center mt-10">
                        <p className="text-lg font-semibold">ADMIN: <span className="font-normal">{adminUser.username}</span></p>
                        <p className="text-lg font-semibold">CREATED: <span className="font-normal">{formatDateInWords(createdAt)}</span></p>
                    </div>
                    {
                      loadingUsers ? <Loader /> : (
                        <div className="border-2 border-black mt-8 mb-5 w-3/4 h-full pb-10 overflow-hidden">
                          <p className="text-lg py-2 px-4 text-center border-b-2 border-black">{participants.length} {participants.length > 1 ? 'Members' : 'Member'}</p>
                          <Scrollbars autoFocus>
                            <div className="flex flex-row m-4">
                              <img className="rounded-full h-10 w-10" src={`https://ui-avatars.com/api/?name=${user.username}&background=000000&color=fff`} alt="avatar" />
                              <p className="ml-3 text-lg my-auto">YOU</p>
                            </div>
                            {userData &&
                              userData.getAllUsers
                                .filter((u)=>participants.includes(u.id))
                                .map((u) => (
                                  <div className="flex flex-row justify-between m-4" key={u.id}>
                                    <div className="flex flex-row">
                                      <img className="rounded-full h-10 w-10" src={`https://ui-avatars.com/api/?name=${u.username}&background=000000&color=fff`} alt="avatar" />
                                      <p className="ml-3 text-lg my-auto">{u.username}</p>
                                    </div>
                                    <p className="my-auto">
                                    {
                                      isGroupAdmin ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleRemoveUser(u.id)} className="h-5 w-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      ) : null
                                    }
                                    </p>
                                  </div>
                                ))}
                              </Scrollbars>
                        </div>
                      )
                    }
                </div>
            )
        }
        </>
    )
}

export default Panel;
