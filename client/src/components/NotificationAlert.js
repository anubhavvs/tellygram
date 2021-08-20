import React from 'react';
import { useStateContext } from '../context/state';

const NotificationAlert = () => {
    const { notification, clearNotif } = useStateContext();

    if(!notification?.message) {
        return null;
    }

    const { message, severity } = notification;
    const styles = {success: 'bg-green-100 text-green-900 border-green-200', error: 'bg-red-100 text-red-900 border-red-200'}

    return (
        <div className={`py-3 absolute select-none top-20 left-0 right-0 w-max mx-auto px-3 ${severity === 'success' ? styles.success : styles.error} text-sm rounded-md border flex items-center`} role="alert">
            <div className="w-4 mr-2">
                {severity === 'success' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                ): (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                    </svg>
                )}
            </div>
            <span>{message}</span>
            <div className="w-4 ml-12">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => clearNotif()} className="cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
    )
}

export default NotificationAlert;
