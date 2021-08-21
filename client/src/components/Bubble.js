import React from 'react';
import { useAuthContext } from '../context/auth';
import { formatBubbleTime } from '../utils/helperFunctions';

const Bubble = ({ message }) => {
    const { user } = useAuthContext();
    const isSentMessage = message.senderId === user.id;
    return (
        <div className={`bg-indigo-900 mx-2 mb-2 py-2 px-3 rounded-xl shadow-lg text-white ${isSentMessage ? `justify-items-end` : `text-left`} w-1/2 max-w-max flex flex-row`}>
            <p className="text-lg">{message.body}</p>
            <p className="text-xs mt-3 ml-2">{formatBubbleTime(message.createdAt)}</p>
        </div>
    )
}

export default Bubble;
