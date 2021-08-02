import React from 'react';

const Search = ({ placeholderText, searchText, onChange }) => {
    return (
        <div className="flex items-center px-5 h-16 bg-gray-700 rounded-xl my-3 select-none">
            <span className="flex items-center">
                <svg fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input value={searchText} onChange={ event => onChange(event.target.value)} className="bg-gray-700 ml-5 rounded-md focus:outline-none text-white" placeholder={placeholderText} autoComplete="off" />
        </div>
    )
}

export default Search;
