import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_PRIVATE_MSG, SEND_GLOBAL_MSG, SEND_GROUP_MSG } from '../graphql/mutations';
import { useStateContext } from '../context/state';
import { getErrorMessage } from '../utils/helperFunctions';

const SenderBox = () => {
    const [ message, setMessage ] = useState('');
    const { selectedChat, notify } = useStateContext();
    const inputElement = useRef(null);
    const [submitPrivateMsg, { loading: loadingPrivate }] = useMutation(
        SEND_PRIVATE_MSG,
        {
          onError: (err) => {
            notify(getErrorMessage(err), 'error');
          },
        }
    );
    const [submitGroupMsg, { loading: loadingGroup }] = useMutation(
        SEND_GROUP_MSG,
        {
          onError: (err) => {
            notify(getErrorMessage(err), 'error');
          },
        }
    );
    const [submitGlobalMsg, { loading: loadingGlobal }] = useMutation(
        SEND_GLOBAL_MSG,
        {
          onError: (err) => {
            notify(getErrorMessage(err), 'error');
          },
        }
    );

    useEffect(() => {
        if(inputElement.current) {
            inputElement.current.focus();
        }
    })

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() === '' || !selectedChat) return;
    
        if (selectedChat.chatType === 'private') {
          submitPrivateMsg({
            variables: { receiverId: selectedChat.chatData.id, body: message },
            update: () => {
              setMessage('')
            },
          });
        } else if (selectedChat.chatType === 'group') {
          submitGroupMsg({
            variables: {
              conversationId: selectedChat.chatData.id,
              body: message,
            },
            update: () => {
              setMessage('');
            },
          });
        } else {
          submitGlobalMsg({
            variables: { body: message },
            update: () => {
              setMessage('');
            },
          });
        }
    };

    const disabled = loadingGlobal || loadingGroup || loadingPrivate || message==='' || (!message.replace(/\s/g, '').length);

    return (
        <div className="h-28 bg-indigo-900 p-5">
            <form className="flex flex-row justify-between h-full border-2 rounded-3xl" onSubmit={handleSendMessage}>
                <input ref={inputElement} onChange={e => setMessage(e.target.value)} value={message} className="px-4 w-full bg-indigo-900 text-lg h-full rounded-3xl text-white focus:outline-none" placeholder="Type a message"></input>
                <button type="submit" className={`pr-5 my-auto ${disabled ? `hidden` : `block`}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 transform rotate-90" viewBox="0 0 20 20" fill="white">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                </button>
            </form>
        </div>
    )
}

export default SenderBox;
