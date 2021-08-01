import React from 'react';

const Loader = () => {
    return (
        <div className="loader bg-indigo-600 px-3 py-4 rounded-full flex space-x-4 w-min m-auto">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
        </div>
    )
}

export default Loader;
