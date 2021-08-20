import React, { useEffect, useState, createRef } from 'react';
import { useLazyQuery, useSubscription } from '@apollo/client';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    GET_PRIVATE_MSGS,
    GET_GROUP_MSGS,
    GET_GLOBAL_MSGS,
    GET_ALL_USERS,
    GET_GROUPS,
    GET_GLOBAL_GROUP }
from '../graphql/queries';
import { NEW_MESSAGE } from '../graphql/subscriptions';
import { useStateContext } from '../context/state';
import { useAuthContext } from '../context/auth.js';
import Header from './Header';
import Loader from './Loader';
import { getErrorMessage, sameDay, formatToYesterday } from '../utils/helperFunctions';
import Panel from './Panel';
import Bubble from './Bubble';
import SenderBox from './SenderBox';

const Conversation = () => {
    const { selectedChat, notify } = useStateContext();
    const { user } = useAuthContext();
    const [messages, setMessages] = useState(null);
    const [addUser, setAddUser] = useState(false);
    const [info, setInfo] = useState(false);
    const scrollbar = createRef();

    const [
        fetchPrivateMsgs,
        { data: privateData, loading: loadingPrivate },
    ] = useLazyQuery(GET_PRIVATE_MSGS, {
        onError: (err) => {
          notify(getErrorMessage(err), 'error');
        },
    });

    const [
        fetchGroupMsgs,
        { data: groupData, loading: loadingGroup },
    ] = useLazyQuery(GET_GROUP_MSGS, {
        onError: (err) => {
          notify(getErrorMessage(err), 'error');
        },
    });

    const [
        fetchGlobalMsgs,
        { data: globalData, loading: loadingGlobal },
    ] = useLazyQuery(GET_GLOBAL_MSGS, {
        onError: (err) => {
          notify(getErrorMessage(err), 'error');
        },
    });
    
    const { error: subscriptionError } = useSubscription(NEW_MESSAGE, {
        onSubscriptionData: ({ client, subscriptionData }) => {
            const newMessage = subscriptionData.data.newMessage;
            let getMsgQuery, getMsgVariables, getMsgQueryName, getLastMsgQuery, getLastMsgQueryName, lastMsgTargetId;

            if (newMessage.type === 'private') {
                const otherUserId = newMessage.participants.filter(
                  (p) => p !== user.id
                )[0];
        
                getMsgQuery = GET_PRIVATE_MSGS;
                getMsgVariables = { userId: otherUserId };
                getMsgQueryName = 'getPrivateMessages';
                getLastMsgQuery = GET_ALL_USERS;
                getLastMsgQueryName = 'getAllUsers';
                lastMsgTargetId = otherUserId;
            } else if (newMessage.type === 'group') {
                const groupConversationId = newMessage.message.conversationId;
        
                getMsgQuery = GET_GROUP_MSGS;
                getMsgVariables = { conversationId: groupConversationId };
                getMsgQueryName = 'getGroupMessages';
                getLastMsgQuery = GET_GROUPS;
                getLastMsgQueryName = 'getGroups';
                lastMsgTargetId = groupConversationId;
            } else if (newMessage.type === 'public') {
                getMsgQuery = GET_GLOBAL_MSGS;
                getMsgVariables = null;
                getMsgQueryName = 'getGlobalMessages';
                getLastMsgQuery = GET_GLOBAL_GROUP;
                getLastMsgQueryName = 'getGlobalGroup';
            }

            const conversationCache = client.readQuery({
                query: getMsgQuery,
                variables: getMsgVariables,
            });

            if (conversationCache) {
                const updatedConvoCache = [
                  ...conversationCache[getMsgQueryName],
                  newMessage.message,
                ];
        
                client.writeQuery({
                  query: getMsgQuery,
                  variables: getMsgVariables,
                  data: {
                    [getMsgQueryName]: updatedConvoCache,
                  },
                });
            }

            const lastMsgCache = client.readQuery({
                query: getLastMsgQuery,
            });

            if (lastMsgCache) {
                const updatedLastMsgCache =
                  newMessage.type === 'public'
                    ? {
                        ...lastMsgCache[getLastMsgQueryName],
                        latestMessage: newMessage.message,
                      }
                    : lastMsgCache[getLastMsgQueryName].map((l) =>
                        l.id === lastMsgTargetId
                          ? { ...l, latestMessage: newMessage.message }
                          : l
                      );
        
                client.writeQuery({
                  query: getLastMsgQuery,
                  data: {
                    [getLastMsgQueryName]: updatedLastMsgCache,
                  },
                });
            }
        },
        onError: (err) => {
            notify(getErrorMessage(err), 'error');
        }
    });

    useEffect(() => {
        if(subscriptionError) {
            notify(getErrorMessage(subscriptionError), 'error');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscriptionError]);

    useEffect(() => {
        if (!selectedChat) return;
        if (selectedChat.chatType === 'private') {
            fetchPrivateMsgs({
                variables: { userId: selectedChat.chatData.id },
            });
        } else if (selectedChat.chatType === 'group') {
            fetchGroupMsgs({
                variables: { conversationId: selectedChat.chatData.id },
        });
        } else {
            fetchGlobalMsgs();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat]);

    useEffect(() => {
        if (!selectedChat) return;
        if (privateData && selectedChat.chatType === 'private') {
          setMessages(privateData.getPrivateMessages);
          setAddUser(false);
          setInfo(false);
        } else if (groupData && selectedChat.chatType === 'group') {
          setMessages(groupData.getGroupMessages);
        } else if (globalData && selectedChat.chatType === 'public') {
          setMessages(globalData.getGlobalMessages);
          setAddUser(false);
          setInfo(false);
        }
    }, [privateData, groupData, globalData, selectedChat]);


    useEffect(() => {
        if(scrollbar.current){
            scrollbar.current.scrollToBottom();
        }
    }, [scrollbar]);

    if(!selectedChat) {
        return (
            <div className="flex flex-col justify-center items-center w-3/4 bg-indigo-600">
                <p className="font-medium capitalize shadow-2xl text-lg p-5 rounded-2xl text-indigo-900 bg-gray-200">select a chat to get started</p>
            </div>
        )
    }

    const isGroupGlobalChat = selectedChat.chatType === 'public' || selectedChat.chatType === 'group';

    const messageDisplay = () => {
        if(loadingPrivate || loadingGlobal || loadingGroup || !messages) {
            return (
                <Loader />
            )
        } else if(messages.length === 0) {
            return (
                <Scrollbars>
                    <div className="h-5/6 flex shadow-inner">
                        <div className="text-black font-semibold bg-blue-400 py-2 px-4 rounded-lg w-max m-auto shadow-2xl">
                            <p>
                            {selectedChat.chatType === 'private'
                                ? `You are now connected with ${selectedChat.chatData.username} to chat!`
                                : 'You will be the first one to send something!'
                            }
                            </p>
                        </div>
                    </div>
                </Scrollbars>
            )
        } else {
            return (
                <Scrollbars ref={scrollbar}>
                <div className="py-5 px-3 shadow-inner">
                    {messages.map((message, index) => {
                        const isSameDay = index !== 0 ? sameDay(messages[index-1].createdAt, message.createdAt) : false;
                        const isSameUser = index !== 0 && isSameDay && messages[index-1].senderId === message.senderId;
                        const isSentMessage = message.senderId === user.id;
                        
                        return (
                            <div key={message.id}>
                                {!isSameDay && (
                                    <div className="text-black font-semibold bg-blue-400 py-2 px-4 rounded-lg w-max mx-auto shadow-2xl">
                                        <p>{formatToYesterday(message.createdAt)}</p>
                                    </div>
                                )}
                                <div className={`${isSentMessage ? `flex justify-end` : `w-full`}`}>
                                    {isGroupGlobalChat &&
                                        !isSameUser &&
                                        user.id !== message.senderId && (
                                            <p className="text-white ml-2 font-semibold">{message.user.username}</p>
                                    )}
                                    <Bubble message={message} />
                                </div>
                            </div>
                        )
                    })}
                </div>
                </Scrollbars>
            )
        }
    }

    return (
        <>
        <div className={`flex flex-col bg-indigo-600 ${(addUser||info) ? 'w-2/4' : 'w-3/4'}`}>
            <Header addUser={addUser} setAddUser={() => setAddUser(!addUser)} info={info} setInfo={() => setInfo(!info)} />
            {messageDisplay()}
            <SenderBox />
        </div>
        <Panel addUser={addUser} setAddUser={() => setAddUser(!addUser)} info={info} setInfo={() => setInfo(!info)}/>
        </>
    )
}

export default Conversation;
