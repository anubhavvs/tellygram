import React from 'react';
import { truncateString, formatRecentDate } from '../utils/helperFunctions';

const RecentChat = ({ body, type }) => {
    return (
        <div className="flex-1">
            <div className="flex flex-row justify-between">
                <p className="mt-2 text-lg">
                    {type === 'user'
                        ? truncateString(body.username, 20)
                        : truncateString(body.name, 20)
                    }
                </p>
                {body.latestMessage && (
                    <p className="font-normal text-xs opacity-50">{formatRecentDate(body.latestMessage.createdAt)}</p>
                )}
            </div>
            {body.latestMessage && (
                <p className="font-thin text-sm opacity-75">{truncateString(body.latestMessage.body, 30)}</p>
            )}
        </div>
    )
}

export default RecentChat;
